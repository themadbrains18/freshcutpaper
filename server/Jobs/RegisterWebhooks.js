import Job from "../Providers/Job";
import { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import * as handlers from "../handlers/index";
import { JOBS } from "../Constants/globals";

class RegisterWebhoooks extends Job {

  // /**
  //  * Job name
  //  */
  // name() {
  //   return JOBS.AUTH_REGISTER_WEBHOOKS;
  // }

  // /**
  //  * Handle function
  //  * @param {object} job agenda job object
  // */
  // async handle(job) {
  //   const { shop, accessToken, shopId } = job.attrs.data;

  //   await handlers.registerWebhooks(
  //     shop,
  //     accessToken,
  //     "ORDERS_CREATE",
  //     `/api/webhooks/order-created?shop=${shopId}`,
  //     ApiVersion.July19
  //   );

  //   await handlers.registerWebhooks(
  //     shop,
  //     accessToken,
  //     "APP_UNINSTALLED",
  //     `/api/webhooks/app-uninstalled?shop=${shopId}`,
  //     ApiVersion.July19
  //   );
  // }
}

export default RegisterWebhoooks;
