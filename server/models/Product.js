const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  price: {
    type: String,
    required: true
  },

  deposit: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  category: {
    type: String,
    default: "General"
  },

  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

},{ timestamps:true });

module.exports = mongoose.model("Product", productSchema);