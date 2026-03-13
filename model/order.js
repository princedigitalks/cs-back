let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let OrderSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    quotation: {
      type: Schema.Types.ObjectId,
      ref: "Quotation",
    },
    customerName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    productName: {
      type: String,
    },
    qty: {
      type: Number,
    },
    price: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    taxType: {
      type: String,
      enum: ["withoutGst", "withGst"],
    },
    gstType: {
      type: String,
      enum: ["igst", "cgst_sgst", "none"],
    },
    igstPercentage: {
      type: Number,
    },
    cgstPercentage: {
      type: Number,
    },
    sgstPercentage: {
      type: Number,
    },
    igst: {
      type: Number,
    },
    cgst: {
      type: Number,
    },
    sgst: {
      type: Number,
    },
    grandTotal: {
      type: String,
    },
    orderStatuses: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderStatus",
      },
    ],
  },
  { timestamps: true }
);

let ORDER = mongoose.model("Order", OrderSchema);
module.exports = ORDER;
