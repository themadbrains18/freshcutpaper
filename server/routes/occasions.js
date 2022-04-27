import Router from "koa-router";

import OccasionController from "../Http/Controllers/Api/OccasionController";

const occasionRouter = new Router({ prefix: "/api/occasions" });

occasionRouter.get("/", OccasionController.index);

occasionRouter.post( "/", OccasionController.create);

export default occasionRouter;
