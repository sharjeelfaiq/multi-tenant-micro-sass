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
      const userTenant = await read.tenantById({ _id: existingUser.tenant});

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

    if (!newUser) {
      throw createError(500, "Failed to create a new user.");
    }

    return {
      status: "success",
      message: "Signed up successfully.",
      data: { id: newUser._id, tenant: tenantId },
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

    io.emit("audit_count_updated");

    const data = {
      id: user._id,
      accessToken,
    };

    return {
      status: "success",
      message: "Signed in successfully.",
      data,
    };
  },
};
