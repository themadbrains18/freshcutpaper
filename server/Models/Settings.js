const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User schema
 */
const SettingsSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  couponCode: { type: String, required: false },
  deliveryText: { type: String, required: false },
  deliveryHeading: { type: String, required: false },
  minDate: { type: String, required: false },
  discountText: { type: String, required: false },
  futureDateActive: { type: Boolean, default: true, required: false },
  appEnabled: { type: Boolean, default: true, required: false },
});

/**
 * Methods
 */
SettingsSchema.method({});

/**
 * Statics
 */
SettingsSchema.static({});

export default mongoose.model("Settings", SettingsSchema);
