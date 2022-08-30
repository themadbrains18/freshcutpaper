import Router from "koa-router";

import WidgetController from "../Http/Controllers/Api/WidgetController";

const widgetRouter = new Router({ prefix: "/api/widget" });

widgetRouter.get("/", WidgetController.index);

widgetRouter.get("/:orderName", WidgetController.getOrderByName);

widgetRouter.post("/update-order/:id/:orderitemid", WidgetController.updateOrder);

export default widgetRouter;
