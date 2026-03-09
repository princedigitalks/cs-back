let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let QuotationSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    taxType: {
      type: String,
      enum: ["withoutGst", "withGst"],
      required: true,
    },
    gstType: {
      type: String,
      enum: ["igst", "cgst_sgst", "none"],
      default: "none",
    },
    igstPercentage: {
      type: Number,
      default: 0,
    },
    cgstPercentage: {
      type: Number,
      default: 0,
    },
    sgstPercentage: {
      type: Number,
      default: 0,
    },
    igst: {
      type: Number,
      default: 0,
    },
    cgst: {
      type: Number,
      default: 0,
    },
    sgst: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let QUOTATION = mongoose.model("Quotation", QuotationSchema);
module.exports = QUOTATION;
