import RouteController from "../RouteController";

// Models
import Occasions from "../../../Models/Occasions";
import Shop from "../../../Models/Shop";

import dotenv from "dotenv";

dotenv.config();

const { HOST, SCRIPT_PATH} = process.env;

class OccasionController extends RouteController {
   /**
   * Load Shop Cards
   * @param  {} ctx
   */
  async index(ctx) {
    try {
    const { shop } = ctx.session;
    const shopId = await Shop.findIdByDomain(shop);
    const results = await Occasions.findOne({ shop: shopId });
    
    ctx.body = {
      status: 200,
      payload: JSON.parse(results.occasions),
    };
    }catch(error){
      console.log("Error at getting all Occasions - ",error);
      ctx.body = { status: 500, payload: null, message: error.message };
    }

  }

  /**
   * Update Occasions
   * @param  {} ctx
   */
  async create(ctx) {
    try{
      const { id } = ctx.params;
      const { shop } = ctx.session;
      const occasions = ctx.request.body;
      /**
       * Update Occasions
       */
       const shopId = await Shop.findIdByDomain(shop);
        const updatedOccasions = await Occasions.update(
          { shop: shopId },
          {
            $set: {
              occasions: JSON.stringify(occasions),
            },
          },
          { upsert: true }
        ).exec();
        ctx.body = { status: 200, payload: updatedOccasions };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }
}

module.exports = new OccasionController();
