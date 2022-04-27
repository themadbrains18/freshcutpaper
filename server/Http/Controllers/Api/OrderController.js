import Shopify from "@shopify/shopify-api";

import RouteController from "../RouteController";

// Models
import Order from "../../../Models/Orders";
import Shop from "../../../Models/Shop";
import Settings from "../../../Models/Settings";
import ShopAccessToken from "../../../Models/ShopAccessToken";

import ShopifyApi from "../../../Services/api/Shopify";

import dotenv from "dotenv";

dotenv.config();
const mongoose = require("mongoose");

const { HOST, SCRIPT_PATH, SHOP } = process.env;

var fs = require("fs");
const path = require("path");
const Mustache = require("mustache");
var pdf = require('html-pdf'); 
var Promise = require("bluebird");

class OrderController extends RouteController {
  /**
   * Load Shop Orders
   * @param  {} ctx
   */
  async index(ctx) {
    try {
      const { page, sort } = ctx.request.query;

      const { shop } = ctx.session;

      const shopId = await Shop.findIdByDomain(shop);

      const accessToken = await ShopAccessToken.findOne({
        shop: mongoose.Types.ObjectId(shopId._id),
      });

      const options = {
        page: 1,
        limit: 10,
        collation: {
          locale: "en",
        },
      };

      let sortBy;

      if (sort == "latest") {
        sortBy = { status: "desc" };
      } else if (sort == "status_unfulfilled") {
        sortBy = { status: 1, createdAt: -1 };
      } else if (sort == "status_fulfilled") {
        sortBy = { status: -1, createdAt: -1 };
      }

      const { docs, total, limit, pages } = await Order.paginate(
        { shop: shopId },
        {
          page,
          limit: 20,
          sort: sortBy,
        }
      );

      let orderArray = [];

      // Replace order id with order name
      for (let i = 0; i < docs.length; i++) {
        let orderObject = {};
        let orderId = docs[i].orderId;

        orderObject._id = docs[i]["_id"];
        orderObject.orderName = docs[i].orderName;
        orderObject.orderId = docs[i].orderId;
        orderObject.firstName = docs[i]["firstName"];
        orderObject.lastName = docs[i]["lastName"];
        orderObject.deliverTo = docs[i]["deliverTo"];
        orderObject.delivery = docs[i]["delivery"];
        orderObject.status = docs[i]["status"];
        orderObject.orderUrl = docs[i]["orderUrl"];
        orderObject.message = docs[i]["message"];
        orderObject.font = docs[i]["font"];
        orderObject.design = docs[i]["designId"];
        orderObject.printPdf = docs[i]["printPdf"];


        let orderData = await ShopifyApi.getSingleOrder(
          orderId,
          shop,
          accessToken.access_token
        );
        if (orderData.statusCode == 200) {
          if (orderData.payload.order.customer) {
            let province = "";
            if (orderData.payload.order.customer.default_address) {
              if (
                orderObject.firstName == null ||
                orderObject.lastName == null
              ) {
                orderObject.firstName =
                  orderData.payload.order.customer.default_address.first_name;
                orderObject.lastName =
                  orderData.payload.order.customer.default_address.last_name;
              }

              if (
                orderData.payload.order.customer.default_address.province !=
                null
              ) {
                province =
                  orderData.payload.order.customer.default_address.province;
              }

              orderObject.deliverTo =
                orderData.payload.order.customer.default_address.address1 +
                " " +
                orderData.payload.order.customer.default_address.city +
                " " +
                orderData.payload.order.customer.default_address.country +
                " " +
                orderData.payload.order.customer.default_address.zip;
            }
          }
          orderObject.arriveByDate = orderData.payload.order.processed_at;
          orderObject.delivery = orderData.payload.order.processed_at;
        }

        orderArray.push(orderObject);
      }

      ctx.body = {
        status: 200,
        payload: orderArray,
        meta: { total, limit, page, pages },
      };
    } catch (error) {
      console.log("Error at Order Controller @ index ", error);
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

      const orderModel = await Order.findById(id);

      ctx.body = {
        status: 200,
        payload: { card: orderModel },
      };
    } catch (error) {
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

      const order = ctx.request.body;

      /**
       * Update quote
       */
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            message: order.message,
          },
        },
        { new: true }
      ).exec();
      ctx.body = { status: 200, payload: updatedOrder };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

  async printPackagingSlips(ctx) {
    const { orders } = ctx.request.query;
    const { shop } = ctx.session;

    // Get Access Tokken
    const shopID = await Shop.findIdByDomain(SHOP);
    const accessToken = await ShopAccessToken.findOne({
      shop: mongoose.Types.ObjectId(shopID._id),
    });

    // Create array with order ids
    const orderIds = orders.split(",");

    // Get order data
    let orderModel = await Order.find({
      _id: {
        $in: orderIds,
      },
    });

    //Get HTML card template
    var html = fs.readFileSync(__dirname + "/cardTemplates/slips.html", "utf8");

    // Create array to pass to mustache for rendering cards;
    let ordersData = [];
    for (let i = 0; i < orderModel.length; i++) {
      let orderId = orderModel[i].orderId.split("-")[0];
      const client = new Shopify.Clients.Rest(SHOP, accessToken.access_token);
      const data = await client.get({
        path: `orders/${orderId}`,
      });
      let orderObj = {
        delivery: orderModel[i].deliverTo,
        firstName: orderModel[i].firstName,
        lastName: orderModel[i].lastName,
        orderId: orderModel[i].orderId,
        order: data.body.order.line_items,
      };

      ordersData.push(orderObj);
    }
    orderModel.forEach((order) => {});

    // Use mustache js to fill out html template with variables
    // var renderedHtml = Mustache.render(html, {data: ordersData});

    //   // Option for creating PDF
      var options = {
        format: 'A4',
        type: "pdf",
        directory: `./public/widget/`,
        filename: `${orderModel._id}.pdf`
      };

      // Generate PDF file
      var createResult = pdf.create(renderedHtml, options);
      var pdfToFile = Promise.promisify(createResult.__proto__.toFile, { context: createResult });
      const pdfRes = await pdfToFile();

      // Move pdf file folder
      let dateUnix = Math.round(new Date().getTime() / 1000).toString();
      fs.rename(`./${orderModel._id}.pdf`, `./public/widget/generatedPdfs/slips-${dateUnix}.pdf`, function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!');
      })

    //Return message
    ctx.body = {
      status: 200,
      payload: { pdfOptions: "pdfRes", file: `slips-.pdf` },
    };
  }

  /**
   * Print cards for order
   * @param  {} ctx
   */
  async printCard(ctx) {
    const { orders } = ctx.request.query;

    
    let accessToken;
    let settingsModel;
    let orderModel;
    let pdfRes;
    let dateUnix = Math.round(new Date().getTime() / 1000).toString();

    // Get Access Tokken
    try {
      const shopID = await Shop.findIdByDomain(SHOP);
      accessToken = await ShopAccessToken.findOne({
        shop: mongoose.Types.ObjectId(shopID._id),
      });
    } catch (e) {
      console.log("Error @ Get Access Tokken", e);
    }

    const client = new Shopify.Clients.Rest(SHOP, accessToken.access_token);
    // Create array with order ids
    const orderIds = orders.split(",");
    
    // Get settings data
    try {
      settingsModel = await Settings.findOne();
    } catch (e) {
      console.log("Error @ Get settings data", e);
    }

    // Get order data
    try {
      orderModel = await Order.find({
        _id: {
          $in: orderIds,
        },
      });
    } catch (e) {
      console.log("Error @ Get order data", e);
    }


    try {
      //Get HTML card template
      var html = fs.readFileSync(
        __dirname + "/cardTemplates/card.html",
        "utf8"
      );
      // Create array to pass to mustache for rendering cards;
      let ordersData = [];

      for (let i = 0; i < orderModel.length; i++) {
        // Take order message and split it in mupltile lines after each "\n" character
        var messageSplit = orderModel[i].message.split("\n");
        var messageHtml = "";
        messageSplit.forEach((line) => {
          if (line) {
            messageHtml += `<p>${line}</p>`;
          }
        });
        console.log(html);

        let orderObj = {
          image: orderModel[i].designId,
          message: messageHtml,
          font: `<link href="https://fonts.googleapis.com/css2?family=${orderModel[
            i
          ].font.replace(" ", "+")}&display=swap" rel="stylesheet">`,
          fontFamiliy: `style="font-family:${orderModel[i].font}"`,
          couponCode: settingsModel.couponCode,
          orderId: orderModel[i].orderName,
          discountText: orderModel[i].discountText,
        };

        ordersData.push(orderObj);
      }

      // Use mustache js to fill out html template with variables
      var renderedHtml = Mustache.render(html, { data: ordersData });

      // Option for creating PDF
      var options = {
        width: "154mm",
        height: "108mm",
        border: "0",
        type: "pdf",
        paginationOffset: 1, // Override the initial pagination number
        header: {
          height: "1mm",
          contents: "",
        },
        footer: {
          height: "1mm",
          contents: "",
        },
        directory: `./public/widget/`,
        filename: `${orderModel._id}.pdf`,
      };

      // Remove prevoiusly generated PDF files
      const directory = "./public/widget/generatedPdfs";
      fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      });

      // Generate PDF file
      var createResult = pdf.create(renderedHtml, options);

      

      var pdfToFile = Promise.promisify(createResult.__proto__.toFile, {
        context: createResult,
      });
      pdfRes = await pdfToFile();

      // Move pdf file folder
      fs.rename(
        `./${orderModel._id}.pdf`,
        `./public/widget/generatedPdfs/batch-${dateUnix}.pdf`,
        function (err) {
          if (err) throw err;
          console.log("Successfully renamed - AKA moved!");
        }
      );

      let updateStatus = await Order.updateMany(
        {
          _id: {
            $in: orderIds,
          },
        },
        { $set: { status: "fulfilled" , printPdf : `/public/widget/generatedPdfs/batch-${dateUnix}.pdf` } }
      );

      //Return message
      ctx.body = {
        status: 200,
        payload: { pdfOptions: pdfRes, file: `batch-${dateUnix}.pdf` },
      };
    } catch (error) {
      console.log("Error @ generating card", error);
    }
  }
}

module.exports = new OrderController();
