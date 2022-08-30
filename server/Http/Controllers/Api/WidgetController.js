import Shopify, { DataType } from "@shopify/shopify-api";

import RouteController from "../RouteController";
// Models
import Quote from "../../../Models/Quote";
import Cards from "../../../Models/Cards";
import Font from "../../../Models/Fonts";
import Shop from "../../../Models/Shop";
import Occasions from "../../../Models/Occasions";
import Settings from "../../../Models/Settings";
import ShopAccessToken from "../../../Models/ShopAccessToken";
import Order from "../../../Models/Orders";

import ShopifyApi from "../../../Services/api/Shopify";

import dotenv from "dotenv";
const mongoose = require("mongoose");
dotenv.config();

const { HOST, SCRIPT_PATH, APP_ENV, SHOP } = process.env;

class WidgetController extends RouteController {
  /**
   * Get widget options
   * @param  {} ctx
   */
  async index(ctx) {
    try {
      const { shop } = ctx.request.query;
      const shopId = await Shop.findIdByDomain(SHOP);
      const cardModel = await Cards.find({ shop: shopId }).sort({product_id:null}).select(
        "_id title image_url product_id character_count occasion"
      );
      const quoteModel = await Quote.find({ shop: shopId }).select(
        "_id title quote occasion"
      );
      const fontModel = await Font.findOne({ shop: shopId }).select("fonts");
      const occasionModel = await Occasions.findOne({ shop: shopId });
      const occasion = JSON.parse(occasionModel.occasions)
      let settingsModel = await Settings.findOne({ shop: shopId });

      let dev = false;
      if (APP_ENV == "local") {
        dev = "true";
      }

      const data = {
        cards: cardModel,
        quotes: quoteModel,
        fonts: JSON.parse(fontModel.fonts),
        occasions: occasion,
        settings: settingsModel,
        enviroment: dev,
      };

      ctx.body = { status: 200, payload: data };
    } catch (error) {
      ctx.body = {
        status: 500,
        payload: null,
        message: "Error at WidgetController.index " + error.message,
      };
    }
  }

  async updateOrder(ctx) {
    const { id,orderitemid } = ctx.params;
    const order = ctx.request.body;
    let orderNotes = [];
    // Get Access Tokken
    const shopID = await Shop.findIdByDomain(SHOP);
    const accessToken = await ShopAccessToken.findOne({
      shop: mongoose.Types.ObjectId(shopID._id),
    });

    const client = new Shopify.Clients.Rest(SHOP, accessToken.access_token);

    console.log(id, orderitemid);
    console.log('order', order);
    try {
      const orderData = await client.get({
        path: `orders/${id}`,
      });
      orderNotes = orderData.body.order.note_attributes;
      orderNotes.forEach((element) => {
        if (element.name == `${order.lineItemID}-message`) {
          element.value = order.Message;
        }
        if (element.name == `${order.lineItemID}-font`) {
          element.value = order.Font;
        }
        if (element.name == `${order.lineItemID}-design`) {
          element.value = order._Design;
        }
      });

      // check if message exists for line item
      const messageFound = orderNotes.find(
        (element) => element.name == `${order.lineItemID}-message`
      );
      if (!messageFound) {
        orderNotes.push({
          name: `${order.lineItemID}-message`,
          value: order.Message,
        });
      }
      // check if message exists for line item
      const fontFound = orderNotes.find(
        (element) => element.name == `${order.lineItemID}-font`
      );
      if (!messageFound) {
        orderNotes.push({
          name: `${order.lineItemID}-font`,
          value: order.Font,
        });
      }
      // check if message exists for line item
      const designFound = orderNotes.find(
        (element) => element.name == `${order.lineItemID}-design`
      );
      if (!messageFound) {
        orderNotes.push({
          name: `${order.lineItemID}-design`,
          value: order._Design,
        });
      }

      const data = await client.put({
        path: `orders/${id}`,
        data: {
          order: {
            id: id,
            note_attributes: orderNotes,
          },
        },
        type: DataType.JSON,
      });

      const updatedOrder = await Order.findOneAndUpdate(
        { orderItemId: orderitemid },
        {
          $set: {
            firstName: order.FirstName,
            lastName: order.LastName,
            deliverTo: order.DeliverTo,
            designId: order._Design,
            font: order.Font,
            message: order.Message,
            delivery: order.Delivery,
            arriveByDate: order.DeliveryDate,
          },
        },
        { new: false }
      ).exec();
      ctx.body = { status: 200, payload: data };
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: 500,
        payload: null,
        message: "Error at WidgetController.updateOrder " + error,
      };
    }
  }

  async getOrderByName(ctx) {
    const { orderName } = ctx.params;

    // Get Access Tokken
    const shopID = await Shop.findIdByDomain(SHOP);
    const accessToken = await ShopAccessToken.findOne({
      shop: mongoose.Types.ObjectId(shopID._id),
    });

    console.log("orderName", orderName);

    try {
      let queryString = `{
        orders (first: 1, query:"name:#${orderName}") {
          edges {
            node {
              id
            }
          }
        }
      }`;
      let client = new Shopify.Clients.Graphql(SHOP, accessToken.access_token);
      let data = await client.query({
        data: queryString,
      });

      console.log(data.body.data.orders);
      //There Should be only one match for the order, get that ID
      const firstOrderID = data.body.data.orders.edges[0].node.id.replace(
        "gid://shopify/Order/",
        ""
      );
      const getOrder = await Order.find({
        orderId: { $regex: ".*" + firstOrderID + ".*" },
      }).exec();
      ctx.body = { status: 200, payload: getOrder, orderId: firstOrderID };
      return;
    } catch (error) {
      ctx.body = {
        status: 500,
        payload: null,
        message: "Error at WidgetController.getOrderByName " + error.message,
      };
    }

    //Get orders matching order_name
    try {
      let queryString = `{
        orders (first: 1, query:"name:#${orderName}") {
          edges {
            node {
              id
            }
          }
        }
      }`;
      let client = new Shopify.Clients.Graphql(SHOP, accessToken.access_token);
      let data = await client.query({
        data: queryString,
      });

      //Get single order and it's line items. This seems imposible to combine with query above
      let queryString2 = `{
        node(id: "${firstOrderID}") {
          id
          ...on Order {
            name
            lineItems(first: 10){
              edges{
                node{
                  name
                  customAttributes{
                    key
                    value
                  }
                }
              }
            }
          }
        }
      }`;
      let client2 = new Shopify.Clients.Graphql(SHOP, accessToken.access_token);
      let data2 = await client2.query({
        data: queryString2,
      });

      const lineItems = data2.body.data.node.lineItems.edges;

      let cardItem = lineItems.filter(function (e) {
        return e.node.name == "Personalized gift card";
      });

      let customAttributes = {};
      cardItem[0].node.customAttributes.forEach((el) => {
        customAttributes[el.key] = el.value;
      });

      ctx.body = {
        status: 200,
        payload: customAttributes,
        orderId: data2.body.data.node.id,
      };
    } catch (error) {
      console.log("Error at WidgetController.getOrderByName ", error);
      ctx.body = {
        status: 500,
        payload: null,
        message: "Error at WidgetController.getOrderByName " + error.message,
      };
    }
  }
}

module.exports = new WidgetController();
