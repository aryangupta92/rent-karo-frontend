const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// Get all products
router.get("/", async (req,res)=>{

  const products = await Product.find();

  res.json(products);

});


// Add product
router.post("/", async (req,res)=>{

  try{

    const product = await Product.create({
  ...req.body,
  owner: req.user
});

    res.status(201).json(product);

  }catch(error){

    res.status(500).json({message:"Server error"});

  }

});


// Delete product
router.delete("/:id", async (req,res)=>{

  await Product.findByIdAndDelete(req.params.id);

  res.json({message:"Product deleted"});

});

// Get single product
// Get single product
router.get("/:id", async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {

    console.log(error);   // 👈 important

    res.status(500).json({ message: "Server error" });
  }

});
module.exports = router;