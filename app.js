const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((request, response, next) => {
  next();
});

const testInsightRoutes = require("./routes/testInsight.routes");

app.use("/", testInsightRoutes);

app.use((request, response, next) => {
  response.statusCode = 404;
  response.send("No se encuentra el recurso que estás buscando");
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3001);
