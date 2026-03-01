require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Debugging: Check if MONGO_URI is loaded
console.log("Attempting to connect to DB...");

// FALLBACK: If .env fails, use this hardcoded string (Replace <password> with real password)
const dbUri = process.env.MONGO_URI || "mongodb+srv://<username>:<password>@cluster0.0tqoifv.mongodb.net/rentals";

if (!dbUri) {
  console.error("FATAL ERROR: MONGO_URI is not defined");
  process.exit(1);
}

mongoose.connect(dbUri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('RentEase API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));