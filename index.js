const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

require("dotenv").config();

//crear servidor de express
const app = express();

// Base de datos
dbConnection();

// Cors
app.use(cors());

// directorio publico
app.use(express.static("public"));

// lectura y parseo del body
app.use(express.json());

//rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));


// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log('Servidor correindo en el puerto' + process.env.PORT);
});
