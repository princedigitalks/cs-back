let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let VendorLabelSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let VendorLabel = mongoose.model("VendorLabel", VendorLabelSchema);
module.exports = VendorLabel;
