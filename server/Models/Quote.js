const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pagination = require("mongoose-paginate");

/**
 * User schema
 */

const QuotesSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  title: { type: String, required: true },
  quote: { type: String, required: true },
  occasion: { type: String, required: false },
}, { timestamps: true });

/**
 * Plugins
 */
 QuotesSchema.plugin(Pagination);

/**
 * Methods
 */
 QuotesSchema.method({});

/**
 * Statics
 */
 QuotesSchema.static({});



export default mongoose.model("Quote", QuotesSchema);
