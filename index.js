const express = require("express");
const { dbConnection } = require("./database/config");
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

//El carácter "*" indica que este manejador debe aplicarse a todas las rutas que no hayan sido previamente definidas por otros manejadores get
app.get("*", (req, res) => {
  //__dirname: directorio del script actual
  //todo: indica que se enviará el archivo index.html al directorio del script.
  res.sendFile(__dirname, "/public/index.html");
});

//LISTEN REQUESTS
app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo ${process.env.PORT}`);
});
