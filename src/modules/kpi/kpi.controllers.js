import { commonUtils } from "#utils/index.js";
import { kpiServices } from "./kpi.services.js";

const { routesAsyncHandler } = commonUtils;

export const kpiControllers = {
  getByTenantId: routesAsyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await kpiServices.getByTenantId(requestQuery);
    response.status(200).json(responseBody);
  }),
};
