import Router from "koa-router";

import OrderController from "../Http/Controllers/Api/OrderController";

const ordersRouter = new Router({ prefix: "/api/orders" });

ordersRouter.get("/", OrderController.index);

ordersRouter.get("/print", OrderController.printCard);

ordersRouter.get("/print-slips", OrderController.printPackagingSlips);

ordersRouter.get("/:id", OrderController.single);

// ordersRouter.get("/print-pdf", OrderController.printCardSecond);

ordersRouter.patch("/:id", OrderController.update);




export default ordersRouter;
