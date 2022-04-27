const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User schema
*/
const FontsSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  fonts: { type: String, required: true },
}, { timestamps: true });

/**
 * Methods
 */
 FontsSchema.method({});

/**
 * Statics
 */
 FontsSchema.static({});



export default mongoose.model("Font", FontsSchema);
