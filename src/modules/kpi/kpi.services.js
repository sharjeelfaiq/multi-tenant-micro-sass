import { io } from "#server/socket.server.js"
import { repository } from "#repository/index.js";

const { read, write } = repository;

export const kpiServices = {
    getByTenantId: async (requestQuery) => {
        const { tenant } = requestQuery;

        const [usersCount = 0, auditCount = 0] = await Promise.all([
            read.usersCount(tenant),
            read.auditCount(tenant),
        ]);

        const auditLogData = {
            tenant,
            action: "get_kpis",
        };

        await write.auditLog(auditLogData);

        io.emit("audit_count_updated", { usersCount, auditCount });

        return {
            status: "success",
            message: "KPIs fetched successfully",
            data: {
                usersCount,
                auditCount,
            },
        };
    },
};
