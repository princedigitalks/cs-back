let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let VendorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    labelId: {
      type: Schema.Types.ObjectId,
      ref: "VendorLabel",
      required: true,
    },
  },
  { timestamps: true }
);

let VENDOR = mongoose.model("Vendor", VendorSchema);
module.exports = VENDOR;
