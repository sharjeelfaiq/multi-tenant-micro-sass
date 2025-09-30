import { commonUtils } from "#utils/index.js";
import { authServices } from "./auth.services.js";

const { routesAsyncHandler } = commonUtils;

export const authControllers = {
  signUp: routesAsyncHandler(async (request, response) => {
    const tenantSubdomain = request.tenantSubdomain;
    const requestBody = request.body;
    const responseBody = await authServices.signUp(requestBody, tenantSubdomain);
    response.status(201).json(responseBody);
  }),

  signIn: routesAsyncHandler(async (request, response) => {
    const tenantSubdomain = request.tenantSubdomain;
    const requestBody = request.body;
    const responseBody = await authServices.signIn(requestBody, tenantSubdomain);
    response.status(200).json(responseBody);
  }),
};
