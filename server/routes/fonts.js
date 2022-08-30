import Router from "koa-router";

import FontController from "../Http/Controllers/Api/FontController";

const fontRouter = new Router({ prefix: "/api/fonts" });

fontRouter.get("/", FontController.index);

fontRouter.post( "/", FontController.create);

export default fontRouter;
