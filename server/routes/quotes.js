import Router from "koa-router";

import QuoteController from "../Http/Controllers/Api/QuoteController";

const quotesRouter = new Router({ prefix: "/api/quotes" });

quotesRouter.get("/", QuoteController.index);

quotesRouter.get("/:id", QuoteController.single);

quotesRouter.patch("/:id", QuoteController.update);

quotesRouter.post( "/", QuoteController.create);

quotesRouter.delete("/:id", QuoteController.remove);

export default quotesRouter;