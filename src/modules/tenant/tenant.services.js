import createError from "http-errors";

import { repository } from "#repository/index.js";
import { io } from "#server/socket.server.js";

const { read, update, write } = repository;

export const tenantServices = {
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

    io.emit("audit_count_updated");

    return {
      status: "success",
      message: "Tenant updated successfully",
      data: updatedTenant,
    };
  },
};
