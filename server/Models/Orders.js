const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pagination = require("mongoose-paginate");

/**
 * User schema
*/
const OrdersSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  orderId: {type: String, required: false},
  orderItemId: {type: String, required: false},
  orderName: {type: String, required: false},
  firstName: {type: String, required: false},
  lastName: {type: String, required: false},
  deliverTo: { type: String, required: false },
  designId: { type: String, required: false },
  font: { type: String, required: false },
  message: { type: String, required: false },
  delivery: { type: String, required: false },
  arriveByDate: { type: String, required: false },
  status: { type: String, required: false },
  printPdf: { type: String, required: false },
  street: {type: String, required: false},
  apt: {type: String, required: false},
  city: {type: String, required: false},
  zip: {type: String, required: false},
  country: {type: String, required: false},
  state: {type: String, required: false},
}, { timestamps: true });

/**
 * Plugins
 */
 OrdersSchema.plugin(Pagination);

/**
 * Methods
 */
 OrdersSchema.method({});

/**
 * Statics
 */
 OrdersSchema.static({});



export default mongoose.model("Order", OrdersSchema);
