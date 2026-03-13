let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let LeadSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productName: {
      type: String,
    },
    qty: {
      type: Number,
    },
    leadStatus: {
      type: Schema.Types.ObjectId,
      ref: "LeadStatus",
    },
    price: {
      type: Number,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

let LEAD = mongoose.model("Lead", LeadSchema);
module.exports = LEAD;
