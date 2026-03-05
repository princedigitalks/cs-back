let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

let CATEGORY = mongoose.model("Category", CategorySchema);
module.exports = CATEGORY;
