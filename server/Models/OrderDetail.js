const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pagination = require("mongoose-paginate");

/**
 * User schema
*/
const OrdersDetailSchema = new Schema({
  orderId: {type: Number, required:true},
  orderName: {type: String, required: false},
  
}, { timestamps: true });

/**
 * Plugins
 */
 OrdersDetailSchema.plugin(Pagination);

/**
 * Methods
 */
 OrdersDetailSchema.method({});

/**
 * Statics
 */
 OrdersDetailSchema.static({});



export default mongoose.model("Orders2", OrdersDetailSchema);
