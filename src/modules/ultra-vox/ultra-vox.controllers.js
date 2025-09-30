import { commonUtils } from "#utils/index.js";
import { ultraVoxServices } from "./ultra-vox.services.js";

const { routesAsyncHandler } = commonUtils;

export const ultraVoxControllers = {
  test: routesAsyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await ultraVoxServices.test(requestQuery);
    response.status(200).json(responseBody);
  }),
};
