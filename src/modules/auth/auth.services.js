import createError from "http-errors";

import { tokenUtils, passwordUtils } from "#utils/index.js";
import { repository } from "#repository/index.js";
import { io } from "#server/socket.server.js"

const { write, read } = repository;

export const authServices = {
  signUp: async (requestBody, tenantSubdomain) => {
    const { email, password, role } = requestBody;

    let tenantId;
    const existingTenant = await read.tenantBySubdomain(tenantSubdomain);

    if (!existingTenant) {
      const tenant = await write.tenant({ subdomain: tenantSubdomain });
      tenantId = tenant._id;
    } else {
      tenantId = existingTenant._id;
    }

    const existingUser = await read.userByEmail(email);

    if (existingUser) {
      const userTenant = await read.tenantById({ _id: existingUser.tenant });

      if (userTenant?.subdomain === tenantSubdomain) {
        throw createError(400, "A user with this email already exists under this tenant.");
      }
    }

    const hashedPassword = await passwordUtils.hash(password, { rounds: 12 });

    const registrationData = {
      tenant: tenantId,
      email,
      role,
      password: hashedPassword,
    };

    const newUser = await write.user(registrationData);

    io.emit("user_count_updated");
    ``
    if (!newUser) {
      throw createError(500, "Failed to create a new user.");
    }

    const accessToken = tokenUtils.generate(
      { id: newUser._id, role: newUser.role },
      "accessToken",
    );

    return {
      status: "success",
      message: "Signed up successfully.",
      data: { id: newUser._id, tenant: tenantId, accessToken },
    };
  },

  signIn: async (requestBody) => {
    const { email, password } = requestBody;

    const user = await read.userByEmail(email);

    if (!user) {
      throw createError(401, "Invalid credentials.");
    }

    const isPasswordValid = await passwordUtils.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw createError(401, "Invalid credentials.");
    }

    const accessToken = tokenUtils.generate(
      { id: user._id, role: user.role },
      "accessToken",
    );

    if (!accessToken) {
      throw createError(500, "Token generation failed.");
    }

    const auditLogData = {
      tenant: user.tenant,
      action: "login",
    };

    await write.auditLog(auditLogData);

    const [usersCount, auditCount] = await Promise.all([
      read.usersCount(user.tenant),
      read.auditCount(user.tenant),
    ]);

    io.emit("audit_count_updated", { usersCount, auditCount });

    const data = {
      id: user._id,
      tenant: user.tenant,
      accessToken,
    };

    return {
      status: "success",
      message: "Signed in successfully.",
      data,
    };
  },
};
