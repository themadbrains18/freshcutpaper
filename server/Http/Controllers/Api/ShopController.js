import RouteController from "../RouteController";
import Shopify, { ApiVersion } from "@shopify/shopify-api";

// Models
import Shop from "../../../Models/Shop";

import dotenv from "dotenv";

dotenv.config();

const { HOST, SCRIPT_PATH, SHOP} = process.env;

class ShopController extends RouteController {
  /**
   * Load Shop
   * @param  {} ctx
   */
   async index(ctx) {
    try {
      const shopModel = await Shop.findByDomain(SHOP);
      ctx.body = { status: 200, payload: shopModel };
    } catch (error) {
      ctx.body = { status: 500, payload: null, message: "Error at ShopController.index " + error.message };
    }
  }

}

module.exports = new ShopController();
