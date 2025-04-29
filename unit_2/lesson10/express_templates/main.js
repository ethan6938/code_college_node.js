const express = require("express");
const app = express();
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");

// Set the port and view engine
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Middleware
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});

// Routes
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact Form Submission:", { name, email, message });
  res.send("Thanks for contacting us!");
});

app.get("/items/:vegetable", homeController.sendReqParam);
app.post("/", homeController.sendPost);
app.get("/name/:Ethan", homeController.respondWithName);

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
