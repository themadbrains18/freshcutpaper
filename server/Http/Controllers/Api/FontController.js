import RouteController from "../RouteController";

// Models
import Font from "../../../Models/Fonts";
import Shop from "../../../Models/Shop";

import dotenv from "dotenv";

dotenv.config();

const { HOST, SCRIPT_PATH} = process.env;

class FontController extends RouteController {
   /**
   * Load Fonts
   * @param  {} ctx
   */
  async index(ctx) {
    try {
    const { shop } = ctx.session;
    const shopId = await Shop.findIdByDomain(shop);
    const results = await Font.findOne({ shop: shopId });
    ctx.body = {
      status: 200,
      payload: JSON.parse(results.fonts),
    };
    }catch(error){
      ctx.body = { status: 500, payload: null, message: error.message };
    }

  }

  /**
   * Update Fonts
   * @param  {} ctx
   */
  async create(ctx) {
    try{
      const { id } = ctx.params;
      const { shop } = ctx.session;
      const fonts = ctx.request.body;
      const shopId = await Shop.findIdByDomain(shop);
      /**
       * Update Fonts
       */
        const updatedFonts = await Font.update(
          { shop: shopId },
          {
            $set: {
              fonts: JSON.stringify(fonts),
            },
          },
          { upsert: true }
        ).exec();
        ctx.body = { status: 200, payload: updatedFonts };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }
}

module.exports = new FontController();
