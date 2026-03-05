let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let LeadStatusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

let LEADSTATUS = mongoose.model("LeadStatus", LeadStatusSchema);
module.exports = LEADSTATUS;
