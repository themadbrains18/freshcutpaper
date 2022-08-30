import RouteController from "../RouteController";

// Models
import Settings from "../../../Models/Settings";
import Shop from "../../../Models/Shop";

import dotenv from "dotenv";

dotenv.config();

const { HOST, SCRIPT_PATH ,SHOP} = process.env;

class SettingsController extends RouteController {
  /**
   * Load Settings
   * @param  {} ctx
   */
  async index(ctx) {
    try {
      const { shop } = ctx.session;
      const shopId = await Shop.findIdByDomain(shop);

      const results = await Settings.findOne({ shop: shopId });
      ctx.body = {
        status: 200,
        payload: results,
      };
    } catch (error) {
      console.log("Error at getting all settings - ", error);
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
      const shopId = await Shop.findIdByDomain(SHOP);
      const settings = ctx.request.body;
      console.log('shopId','====',shopId);
      console.log('settings','====',settings);
      /**
       * Update Fonts
       */
      const updatedSettings = await Settings.updateOne(
        { shop: shopId },
        {
          $set: {
            couponCode: settings.couponCode,
            deliveryText: settings.deliveryText,
            deliveryHeading: settings.deliveryHeading,
            minDate: settings.minDate,
            discountText: settings.discountText,
            futureDateActive: settings.futureDateActive,
            appEnabled: settings.appEnabled,
          },
        },
        { upsert: true }
      ).exec();
      ctx.body = { status: 200, payload: updatedSettings };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }
}

module.exports = new SettingsController();
