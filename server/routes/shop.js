import Router from "koa-router";

import ShopController from "../Http/Controllers/Api/ShopController";

const shopRouter = new Router({ prefix: "/api/shop" });

shopRouter.get("/", ShopController.index);

export default shopRouter;
