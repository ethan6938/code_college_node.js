const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const express = require("express");
const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://0.0.0.0:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Added for newer versions of MongoDB
});

const db = mongoose.connection;

// Event listener for successful connection
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Example GET route to test
app.get("/", (req, res) => {
  res.send("Hello, MongoDB!");
});

// Example POST route to create a new subscriber
app.post("/subscribers", async (req, res) => {
  try {
    const newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
    });
    await newSubscriber.save();
    console.log("New subscriber added:", newSubscriber);
    res.status(201).send(newSubscriber);
  } catch (error) {
    console.error("Error adding subscriber:", error);
    res.status(400).send("Error adding subscriber.");
  }
});

// Example route to fetch all subscribers
app.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    console.log("Fetched subscribers:", subscribers);
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).send("Error fetching subscribers.");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
