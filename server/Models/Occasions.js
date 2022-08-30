const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User schema
*/
const OccasionsSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  occasions: { type: String, required: false },
}, { timestamps: true });

/**
 * Methods
 */
 OccasionsSchema.method({});

/**
 * Statics
 */
 OccasionsSchema.static({});



export default mongoose.model("Occasions", OccasionsSchema);
