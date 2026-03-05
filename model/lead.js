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
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    leadStatus: {
      type: Schema.Types.ObjectId,
      ref: "LeadStatus",
      required: true,
    },
  },
  { timestamps: true }
);

let LEAD = mongoose.model("Lead", LeadSchema);
module.exports = LEAD;
