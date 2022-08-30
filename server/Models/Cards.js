const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pagination = require("mongoose-paginate");

/**
 * User schema
 */

const CardsSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    title: { type: String, required: true },
    image_url: { type: String, required: false },
    coupon_id: { type: String, required: false },
    product_id: { type: String, required: false },
    character_count: { type: Number, default: 5 },
    occasion: { type: String, required: false },
  },
  { timestamps: true }
);

/**
 * Plugins
 */
CardsSchema.plugin(Pagination);

/**
 * Methods
 */
CardsSchema.method({});

/**
 * Statics
 */
CardsSchema.static({});

export default mongoose.model("Card", CardsSchema);
