import { commonUtils } from "#utils/index.js";
import { tenantServices } from "./tenant.services.js";

const { routesAsyncHandler } = commonUtils;

export const tenantControllers = {
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
