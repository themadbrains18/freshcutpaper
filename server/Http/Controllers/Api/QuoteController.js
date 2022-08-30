import RouteController from "../RouteController";

// Models
import Quote from "../../../Models/Quote";
import Shop from "../../../Models/Shop";
import Occasions from "../../../Models/Occasions";

import dotenv from "dotenv";

dotenv.config();

const { HOST, SCRIPT_PATH } = process.env;

class QuoteController extends RouteController {
  /**
   * Load Shop Quote
   * @param  {} ctx
   */
  async index(ctx) {
    try {
      const { page } = ctx.request.query;

      const { shop } = ctx.session;

      const shopId = await Shop.findIdByDomain(shop);
      const results = await Occasions.findOne({ shop: shopId });
      let occassion=JSON.parse(results.occasions)

      const { docs, total, limit, pages } = await Quote.paginate(
        { shop: shopId },
        {
          page,
          limit: 100,
          sort: { occasion: 1 },
        }
      );

      ctx.body = {
        status: 200,
        payload: docs,
        meta: { total, limit, page, pages },
        occasion: occassion.occasions
      };
    } catch (error) {
      ctx.body = { status: 500, payload: [], message: error.message };
    }
  }

  /**
   * Load Single Shop Quote
   * @param  {} ctx
   */
  async single(ctx) {
    try {
      const { id } = ctx.params;

      const quoteModel = await Quote.findById(id);

      ctx.body = {
        status: 200,
        payload: { quote: quoteModel },
      };
    } catch (error) {
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Create Quote
   * @param  {} ctx
   */
  async create(ctx) {
    try {
      const { shop } = ctx.session;

      const quote = ctx.request.body;

      const shopModel = await Shop.findByDomain(shop);

      /**
       * Create Quote Design
       */
      const newQuote = new Quote({
        shop: shopModel,
        title: quote.title,
        quote: quote.quote,
        occasion: quote.occasion,
      });

      const quoteModel = await newQuote.save();

      ctx.body = { status: 200, payload: quoteModel };
    } catch (error) {
      console.log("Error at Quote Create ", error);
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Edit Quote
   * @param  {} ctx
   */
  async update(ctx) {
    try {
      const { id } = ctx.params;

      const quote = ctx.request.body;

      /**
       * Update quote
       */
      const updatedQuote = await Quote.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            title: quote.title,
            quote: quote.quote,
            occasion: quote.occasion,
          },
        },
        { new: true }
      ).exec();
      ctx.body = { status: 200, payload: updatedQuote };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  /**
   * Remove Quote
   * @param  {} ctx
   */
  async remove(ctx) {
    try {
      const { id } = ctx.params;

      await Quote.findByIdAndRemove(id);

      ctx.body = {
        status: 200,
        payload: null,
      };
    } catch (error) {
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }
}

module.exports = new QuoteController();
