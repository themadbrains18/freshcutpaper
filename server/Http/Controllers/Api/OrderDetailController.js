import RouteController from "../RouteController";
import dotenv from "dotenv";
const fetch = require('node-fetch');
const date = require('date-and-time')

const now  =  new Date();
const dataFormat = date.format(now,'YYYY-MM');

dotenv.config();

import OrderDetail from "../../../Models/OrderDetail";
import Order from "../../../Models/Orders";


class OderDetailController extends RouteController {

  async single(ctx) {

    // try {
      const { id } = ctx.params;

      var myHeaders = new Headers();
      myHeaders.append("X-Shopify-Access-Token", "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");
      myHeaders.append("Cookie", "_secure_admin_session_id=cd373ae50ebb1384cd48b96231134f89; _secure_admin_session_id_csrf=cd373ae50ebb1384cd48b96231134f89");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      var shopifyRequestUrl = "https://fresh-cust-paper.myshopify.com/admin/api/2021-4/orders/"+id+".json";
      console.log(shopifyRequestUrl);
      var dataa = await fetch(shopifyRequestUrl, requestOptions)
        .then(response => 
          response.json()
        )
        .then((result) =>  { 
         
          return result;
        })
        .catch(error => console.log('error', error));

        var newLineItem = [];
        for(let item of dataa.order.line_items){

            if(item.variant_id == process.env.PRODUCT_ID){
                var itemsId = item.id;
                const orderModel = await Order.findOne({orderItemId:itemsId.toString() });
                // newLineItem = item;
                item['printPdf'] = process.env.HOST+orderModel.printPdf;
                newLineItem.push(item);
            }else{
                 newLineItem.push(item);
            }
        }

        //process.env.NODE_PORT
        
        dataa.order.line_items = newLineItem;

      ctx.body = dataa;





    // } catch (error) {
    //   ctx.body = { status: 500, payload: null, message: error.message };
    // }
  }

  /**
 * Save Order Detail
 * @param  {} ctx
 */
  async create(ctx) {

    try {
      const order = ctx.request.body;

      /**
       * Create Order Design
       */
      const newOrder = new OrderDetail({
        orderId: order.orderId,
        orderName: order.orderName
      });

      const orderModel = await newOrder.save();

      ctx.body = { status: 200, payload: orderModel };
    } catch (error) {
      console.log("Error at Quote Create ", error);
      ctx.body = { status: 500, payload: null, message: error.message };
    }
  }

}

module.exports = new OderDetailController();