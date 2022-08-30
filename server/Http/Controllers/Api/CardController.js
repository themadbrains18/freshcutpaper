import RouteController from "../RouteController";

// Models
import Card from "../../../Models/Cards";
import Shop from "../../../Models/Shop";
import Occasions from "../../../Models/Occasions";

import dotenv from "dotenv";

dotenv.config();

const { HOST, SCRIPT_PATH } = process.env;

class CardController extends RouteController {
  /**
   * Load Shop Cards
   * @param  {} ctx
   */
  async index(ctx) {
    try {
      const { page } = ctx.request.query;

      const { shop } = ctx.session;

      const shopId = await Shop.findIdByDomain(shop);
      const results = await Occasions.findOne({ shop: shopId });

      const { docs, total, limit, pages } = await Card.paginate(
        { shop: shopId },
        {
          page,
          limit: 20,
          sort:{title: 1}
          // sort: { createdAt: -1, product_id:null },
        }
      );

      let occassion=JSON.parse(results.occasions)
      
      ctx.body = {
        status: 200,
        payload: docs,
        meta: { total, limit, page, pages },
        occasion: occassion.occasions
      };
    } catch (error) {
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Load Single Shop Card
   * @param  {} ctx
   */
  async single(ctx) {
    try {
      const { id } = ctx.params;

      const cardModel = await Card.findById(id);

      ctx.body = {
        status: 200,
        payload: { card: cardModel },
      };
    } catch (error) {
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Create Card
   * @param  {} ctx
   */
  async create(ctx) {
    try {
      const { shop } = ctx.session;

      const card = ctx.request.body;

      const shopModel = await Shop.findByDomain(shop);
      /**
       * Create Card Design
       */
      const newCard = new Card({
        shop: shopModel,
        title: card.title,
        coupon_id: null,
        image_url: card.image_url,
        product_id: card.product_id,
        character_count: card.character_count,
        occasion: card.occasion,
      });

      const cardModel = await newCard.save();

      ctx.body = { status: 200, payload: cardModel };
    } catch (error) {
      console.log("Error at Card Create ", error);
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Edit Card
   * @param  {} ctx
   */
  async update(ctx) {
    try {
      const { id } = ctx.params;

      const card = ctx.request.body;

      /**
       * Update Card
       */
      const updatedCard = await Card.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            title: card.title,
            coupon_id: null,
            image_url: card.image_url,
            product_id: card.product_id,
            character_count: card.character_count,
            occasion: card.occasion,
          },
        },
        { new: true }
      ).exec();
      ctx.body = { status: 200, payload: updatedCard };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Remove card
   * @param  {} ctx
   */
  async remove(ctx) {
    try {
      const { id } = ctx.params;

      await Card.findByIdAndRemove(id);
      console.log('i am here to remove card');
      ctx.body = {
        status: 200,
        payload: null,
      };
    } catch (error) {
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }
}

module.exports = new CardController();
