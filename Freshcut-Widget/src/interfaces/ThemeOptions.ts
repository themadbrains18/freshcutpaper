import Color = require("color");

export interface ThemeOptions {
  fontSize: Number,
  productID: Number,
  variantID: Number,
  textColor?: Color,
  lineIndex?: Number,
  backgroundColor?: Color
  buttonColor?: Color,
  buttonTextColor?: Color,
  postType: String,
  Qty :number,
  selectedKey :String,
  selectedParentKey: String
}
