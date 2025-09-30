import appRouter from "#routes/index.js";
import { setupMiddleware } from "#middleware/index.js";
import { env, connectDatabase } from "#config/index.js";

const { PORT, BACKEND_URL } = env;

export const createBackendServer = async (server, app) => {
  await connectDatabase();

  setupMiddleware(app, appRouter);

  server.listen(PORT || 5000, () => {
    console.log(`[connected] Backend (url: ${BACKEND_URL})`);
  });
};