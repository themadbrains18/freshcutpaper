import Router from "koa-router";

import SettingsController from "../Http/Controllers/Api/SettingsController";

const settingsRouter = new Router({ prefix: "/api/settings" });

settingsRouter.get("/", SettingsController.index);

settingsRouter.post( "/", SettingsController.create);

export default settingsRouter;
