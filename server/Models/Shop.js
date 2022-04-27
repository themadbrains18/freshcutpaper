import ShopAccessToken from "./ShopAccessToken";
import Settings from "./Settings";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User schema
 */

const ShopSchema = new Schema({
  shop: { type: String, required: true, unique: true },
  access_token: { type: Schema.Types.ObjectId, ref: "ShopAccessToken" },
  store_info: { type: Object, required: false },
  settings: { type: Schema.Types.ObjectId, ref: "Settigns" },
});

/**
 * Statics
 */
 ShopSchema.statics.findByDomain = function (shop) {
  return this.findOne({ shop });
};

ShopSchema.statics.findByKeyword = function (keyword) {
  return this.findOne({ keyword });
};

ShopSchema.statics.findIdByDomain = function (domain) {
  return this.findOne({ shop: domain }).select("_id");
};

ShopSchema.statics.findAccessToken = function (domain) {
 const _id = this.findOne({ shop: domain }).select("_id");
 return ShopAccessToken.findOne({"shop": mongoose.Types.ObjectId(_id)})
};

export default mongoose.model("Shop", ShopSchema);
