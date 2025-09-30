import { io } from "#server/socket.server.js"
import { repository } from "#repository/index.js";

const { read, write } = repository;

export const kpiServices = {
    getByTenantId: async (requestQuery) => {
        const { tenantId } = requestQuery;

        const [usersCount = 0, auditCount = 0] = await Promise.all([
            read.usersCount(tenantId),
            read.auditCount(tenantId),
        ]);


        console.log("tenantId", tenantId);
        console.log("usersCount", usersCount);
        console.log("auditCount", auditCount);

        const auditLogData = {
            tenant: tenantId,
            action: "get_kpis",
        };

        await write.auditLog(auditLogData);

        io.emit("audit_count_updated");

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
