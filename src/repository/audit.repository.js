import { AuditLogModel } from "#models/index.js";

export const auditRepository = {
    read: {
        auditCount: (tenant) => {
            return AuditLogModel.countDocuments({ tenant }).exec();
        },
    },

    write: {
        auditLog: (data) => {
            return AuditLogModel.create(data);
        },
    },
};
