let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CustomerSchema = new Schema(
  {
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

let CUSTOMER = mongoose.model("Customer", CustomerSchema);
module.exports = CUSTOMER;
