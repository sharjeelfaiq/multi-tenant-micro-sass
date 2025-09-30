import createError from "http-errors";

import { repository } from "#repository/index.js";
import { io } from "#server/socket.server.js";

const { read, update, write } = repository;

export const tenantServices = {
  getById: async (requestParams) => {
    const { id } = requestParams;
    const tenant = await read.tenantById(id);

    if (!tenant) {
      throw createError(404, "Tenant not found");
    }
    const auditLogData = {
      tenant: tenant._id,
      action: "get",
    };

    await write.auditLog(auditLogData);
    const [usersCount, auditCount] = await Promise.all([
      read.usersCount(tenant),
      read.auditCount(tenant),
    ]);

    io.emit("audit_count_updated", { usersCount, auditCount });

    return {
      status: "success",
      message: "Tenant fetched successfully",
      data: tenant,
    };
  },


  updateById: async (requestParams, requestBody) => {
    const { id } = requestParams;
    const data = { ...requestBody };

    const existingTenant = await read.tenantById(id);

    if (!existingTenant) {
      throw createError(404, "Tenant not found");
    }

    const updatedTenant = await update.tenantById(id, data);

    if (!updatedTenant) {
      throw createError(500, "Tenant update failed");
    }

    const auditLogData = {
      tenant: existingTenant._id,
      action: "update",
    };

    await write.auditLog(auditLogData);

    const [usersCount, auditCount] = await Promise.all([
      read.usersCount(existingTenant._id),
      read.auditCount(existingTenant._id),
    ]);

    io.emit("audit_count_updated", { usersCount, auditCount });

    return {
      status: "success",
      message: "Tenant updated successfully",
      data: updatedTenant,
    };
  },
};
