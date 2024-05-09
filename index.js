const express = require("express");
const path = require("path");
const app = express();

const connectrDb = require("./db");
const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
connectrDb("mongodb://localhost:27017/blogapp");
const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);
app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  res.render("home");
});
app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
