import Router from "koa-router";

import CardController from "../Http/Controllers/Api/CardController";

const cardsRouter = new Router({ prefix: "/api/cards" });

cardsRouter.get("/", CardController.index);

cardsRouter.get("/:id", CardController.single);

cardsRouter.patch("/:id", CardController.update);

cardsRouter.post( "/", CardController.create);

cardsRouter.delete("/:id", CardController.remove);

export default cardsRouter;
