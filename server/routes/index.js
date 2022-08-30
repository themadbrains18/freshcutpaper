import Router from "koa-router";
import shopRouter from "./shop";
import cardRouter from "./cards";
import quotesRouter from "./quotes";
import widgetRouter from "./widget";
import ordersRouter from "./orders";
import fontRouter from "./fonts";
import occasionRouter from "./occasions";
import settingsRouter from "./settings";
import webhooks from "./webhooks";
import ordersDetailRouter from "./orderdetail";

const apiRouter = new Router();

const nestedRoutes = [
  shopRouter,
  cardRouter,
  quotesRouter,
  widgetRouter,
  fontRouter,
  ordersRouter,
  webhooks,
  occasionRouter,
  settingsRouter,
  ordersDetailRouter
];

for (let router of nestedRoutes) {
  apiRouter.use(router.routes(), router.allowedMethods());
}

export default apiRouter;
