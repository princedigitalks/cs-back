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
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let ORDER = mongoose.model("Order", OrderSchema);
module.exports = ORDER;
