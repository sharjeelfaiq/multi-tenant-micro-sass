import { commonUtils } from "#utils/index.js";
import { tenantServices } from "./tenant.services.js";

const { routesAsyncHandler } = commonUtils;

export const tenantControllers = {
  getById: routesAsyncHandler(async (request, response) => {
    const requestParams = request.params;
    const responseBody = await tenantServices.getById(requestParams);
    response.status(200).json(responseBody);
  }),

  updateById: routesAsyncHandler(async (request, response) => {
    const requestParams = request.params;
    const requestBody = request.body;
    const responseBody = await tenantServices.updateById(
      requestParams,
      requestBody,
    );
    response.status(200).json(responseBody);
  }),
};
