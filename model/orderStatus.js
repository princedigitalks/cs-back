let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let OrderStatusSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

let ORDERSTATUS = mongoose.model("OrderStatus", OrderStatusSchema);
module.exports = ORDERSTATUS;
