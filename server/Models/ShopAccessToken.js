/*!
 * Module dependencies
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User schema
 */

const ShopAccessTokenSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  access_token: { type: String, default: "", unique: true }
}, { timestamps: true });

/**
 * Methods
 */

ShopAccessTokenSchema.method({});

/**
 * Statics
 */

ShopAccessTokenSchema.static({});

/**
 * Register
 */

export default mongoose.model("ShopAccessToken", ShopAccessTokenSchema);
