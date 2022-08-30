import Router from "koa-router";

import OrderDetailController from "../Http/Controllers/Api/OrderDetailController";

const ordersDetailRouter = new Router({ prefix: "/api/order" });

ordersDetailRouter.get("/:id", OrderDetailController.single);

ordersDetailRouter.post("/save", OrderDetailController.create);




export default ordersDetailRouter;
