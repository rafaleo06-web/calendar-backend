const express = require("express");
const { dbConnection } = require("./database/config");

const path = require("path");
var cors = require("cors");

//todo: Carga las variables de entorno desde un archivo '.env'
require("dotenv").config();

const app = express();

dbConnection();

app.use(cors());

app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});

//public directory
app.use(express.static("public"));

//reading y parsing
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

// Maneja todas las rutas que no sean definidas explícitamente
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//LISTEN REQUESTS
app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo ${process.env.PORT}`);
});
