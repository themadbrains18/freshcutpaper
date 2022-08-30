import RouteController from "../RouteController";
import Order from "../../../Models/Orders";
import Shop from "../../../Models/Shop";
import ShopAccessToken from "../../../Models/ShopAccessToken";
import Settings from "../../../Models/Settings";
import Shopify from "@shopify/shopify-api";
import fs from "fs";
const imageToBase64 = require('image-to-base64');
const mongoose = require("mongoose");
const path = require("path");
const Mustache = require("mustache");
var pdf = require('html-pdf'); 
var Promise = require("bluebird");
const { PRODUCT_ID, SHOP,HOST } = process.env;

class WebhooksController extends RouteController {
  
  /**
   * Webhook on order created
   * @param  {} ctx
   */
   async orderCreated(ctx) {
    const webcontroller = new WebhooksController();
    const productId = PRODUCT_ID;
    ctx.body = { status: 200, payload: "Incoming order" };
    const {
      id,
      name,
      line_items,
    } = ctx.request.body;

    const { shop } = ctx.request.query;

    const countPersonalizedOrders = line_items.filter(function(item){
      if (parseInt(item.variant_id) === parseInt(productId)) {
        return true;
      } else {
        return false;
      }
    });

    console.log("countPersonalizedOrders.length", countPersonalizedOrders.length);

    let persCardCount = countPersonalizedOrders.length;
    let countSameOrder = 0;
    for  (let i = 0; i < line_items.length; i++) {
      let personalizedOrder = false;
      let properties = null;
      let propertiesObject = {};

      //Check if if personalized order product
      if(parseInt(line_items[i].variant_id) === parseInt(productId) ){
        properties = line_items[i].properties;
        personalizedOrder = true;
      }

      if(!personalizedOrder){
        if((line_items.length - 1) == i){
          ctx.body = { status: 200, payload: "This order doesn't contain personalized card" };
          return;
        }
      }

    if(properties === null){
      if((line_items.length - 1) == i){
        ctx.body = { status: 200, payload: "Line item properties are empty" };
        return;
      }
    }

    if( personalizedOrder == true){
      //map properties
      properties.forEach(element => {
      propertiesObject[element.name] = element.value;
    })

      try {
        const shopModel = await Shop.findByDomain(SHOP);
        /**
         * Create Quote Design
         */

        let orderName = name;
        if(countPersonalizedOrders.length > 1){
          orderName = name+"-"+persCardCount;
        }

          const newOrder = new Order({
            shop: shopModel,
            orderId: id,
            orderItemId : line_items[i].id,
            orderName: orderName,
            firstName: propertiesObject.FirstName,
            lastName: propertiesObject.LastName,
            street: propertiesObject._Street,
            apt: propertiesObject._Apt,
            city: propertiesObject._City,
            zip: propertiesObject._Zip,
            country: propertiesObject._Country,
            state: propertiesObject._State,
            deliverTo: propertiesObject.DeliverTo,
            designId: propertiesObject._Design,
            font: propertiesObject.Font,
            message: propertiesObject.Message,
            delivery: propertiesObject.Delivery,
            arriveByDate: propertiesObject.DeliveryDate,
          });

          const findOrder = await Order.find(
            { orderId: id,  message: propertiesObject.Message },
          )

          console.log('=======================');
          console.log(line_items);
          console.log('=======================');

          
          if(findOrder.length == 0){
            const orderModel = await newOrder.save();
           await webcontroller.printAbleCard(orderModel._id,'unfulfilled', line_items[i].quantity);
            // this.printAbleCard(orderModel._id);
          }
          

          persCardCount = persCardCount - 1;

          ctx.body = { status: 200, payload: "success" };
        } catch (error) {
          console.log("Error at checkoutCreate ",  error.message)
          ctx.body = { status: 500, payload: null, message: "Error at checkoutCreate " + error.message };
        }
      }

    };
    ctx.body = { status: 200 };
  }

   /**
   * Webhook on order created
   * @param  {} ctx
   */
    async appUninstalled(ctx) {
      console.log("appUninstalled webhook");
      try {

      } catch (error) {
        ctx.body = { status: 500, payload: null, message: "Error at checkoutCreate " + error.message };
      }
    }

    async printAbleCard(orderId,printStatus,qty){
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
      var orders = orderId;
      const orderIds = [orderId]; //orders.split(",");
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
      
      // console.log(orderModel)
  
      try {
        //Get HTML card template
        var html = fs.readFileSync(
          __dirname + "/cardTemplates/card.html",
          "utf8"
        );
  
        console.log('qty','======',qty);

        // Create array to pass to mustache for rendering cards;
        let ordersData = [];
        let printIdUnix;
        for (let i = 0; i < orderModel.length; i++) {
          // Take order message and split it in mupltile lines after each "\n" character
          var messageSplit = orderModel[i].message.split("\n");
          var messageHtml = "";
          messageSplit.forEach((line) => {
            if (line) {
              messageHtml += `<p>${line}</p>`;
            }
          });
          for(let j = 0;j < qty; j++){
            let base64image = await imageToBase64(orderModel[i].designId) // Path to the image
            .then(
                (response) => {
                    return response;// "cGF0aC90by9maWxlLmpwZw=="
                }
            )
            .catch(
                (error) => {
                    console.log(error); // Logs an error if there was one
                }
            )

            // console.log('base64image','=====',image);

            let orderObj = {
              image: "data:image/jpeg;base64," +base64image,
              message: messageHtml,
              font: `<link href="https://fonts.googleapis.com/css2?family=${orderModel[
                i
              ].font.replace(" ", "+")}&display=swap" rel="stylesheet">`,
              fontFamiliy: `style="font-family:${orderModel[i].font}"`,
              couponCode: settingsModel.couponCode,
              orderId: orderModel[i].orderName,
              discountText: orderModel[i].discountText,
              // freshLogo:'http://dcf1-124-253-60-105.ngrok.io/public/pankaj.jpg'
            };
            printIdUnix=orderModel[i].orderItemId;
            // console.log(orderObj);
  
            ordersData.push(orderObj);
          }
          
        }

        // Use mustache js to fill out html template with variables
        var renderedHtml = Mustache.render(html, { data: ordersData });
  
        // Option for creating PDF
        var options = {
          width: "154mm",
          height: "118mm",
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
          quality: "75",
        };
  
        // Remove prevoiusly generated PDF files
        const directory = "./public/widget/generatedPdfs";
        // fs.readdir(directory, (err, files) => {
        //   if (err) throw err;
        //   for (const file of files) {
        //     fs.unlink(path.join(directory, file), (err) => {
        //       if (err) throw err;
        //     });
        //   }
        // });
  
        // console.log('renderedHtml',renderedHtml);
        // Generate PDF file
        var createResult = pdf.create(renderedHtml, options);
  
        
  
        var pdfToFile = Promise.promisify(createResult.__proto__.toFile, {
          context: createResult,
        });
        pdfRes = await pdfToFile();
  
        // Move pdf file folder
        fs.rename(
          `./${orderModel._id}.pdf`,
          `./public/widget/generatedPdfs/batch-${printIdUnix}.pdf`,
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
          { $set: { status: printStatus , printPdf : `/public/widget/generatedPdfs/batch-${printIdUnix}.pdf` } }
        );

        // { $set: { status: "fulfilled" , printPdf : `/public/widget/generatedPdfs/batch-${dateUnix}.pdf` } }
  
        //Return message
        // ctx.body = {
        //   status: 200,
        //   payload: { pdfOptions: pdfRes, file: `batch-${dateUnix}.pdf` },
        // };
      } catch (error) {
        console.log("Error @ generating card", error);
      }
    }

    async orderFullfilled(ctx) {
      
      console.log('here order full filled');
      const webcontroller = new WebhooksController();
      const productId = PRODUCT_ID;
      ctx.body = { status: 200, payload: "Fullfill order" };
      const {
        id,
        name,
        line_items,
      } = ctx.request.body;
  
      try {
        let orderModel = await Order.find({
          orderId: {
            $in: id.toString(),
          },
        });
        
         for await (const order of orderModel){
          let lineItems = line_items.filter((item)=>{
            return item.id == parseInt(order.orderItemId)
          })

          console.log('lineItems','=========',lineItems[0].quantity);

          console.log('order._id','======',order._id)

          // return;

          await webcontroller.printAbleCard(order._id,'fulfilled',lineItems[0].quantity);
        }
        
        // orderModel.map(async(item)=>{
        //   console.log(item._id);
        //   await webcontroller.printAbleCard(item._id,'fulfilled');
        // })

        ctx.body = { status: 200, payload: "success" };
      } catch (e) {
        console.log("Error @ Get order data", e);
      }
      
      // ctx.body = { status: 200 };
    }

}

module.exports = new WebhooksController();
