import { io } from "#server/socket.server.js";
import { repository } from "#repository/index.js";
import axios from "axios";

import { env } from "#config/index.js";

const { ULTRA_VOX_API_KEY } = env;
const { read, write } = repository;

export const ultraVoxServices = {
    test: async (requestQuery) => {
        const { tenant } = requestQuery;

        const response = await axios.get("https://api.ultravox.ai/api/tools", {
            headers: {
                "X-API-Key": ULTRA_VOX_API_KEY,
            },
        });

        const auditLogData = {
            tenant,
            action: "test_ultra_vox",
        };

        await write.auditLog(auditLogData);
        const [usersCount, auditCount] = await Promise.all([
            read.usersCount(tenant),
            read.auditCount(tenant),
        ]);

        io.emit("audit_count_updated", { usersCount, auditCount });

        return {
            status: "success",
            message: "Test ultra vox successfully",
            data: response.data.results,
        };
    },
};
