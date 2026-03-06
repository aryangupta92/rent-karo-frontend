const express = require("express");
const router = express.Router();
const Rental = require("../models/Rental");
const protect = require("../middleware/authMiddleware");

// Create rental
router.post("/", protect, async (req, res) => {
  try {
    const { productName, price, deposit } = req.body;

    const rental = await Rental.create({
      user: req.user,
      productName,
      price,
      deposit,
    });

    res.status(201).json({
      message: "Product rented successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get rentals for logged user
router.get("/", protect, async (req, res) => {
  const rentals = await Rental.find({ user: req.user });
  res.json(rentals);
});

// Delete rental (return item)
router.delete("/:id", protect, async (req, res) => {
  try {

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    await rental.deleteOne();

    res.json({ message: "Rental returned successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;