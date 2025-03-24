const express = require("express");
const router = express.Router();

const testInsightController = require("../controllers/testInsight.controllers");

router.get("/", (request, response, next) => {
  response.render("login");
});

router.get("/sesion_grupal", testInsightController.sesion_grupal);

router.get("/sesion_individual", testInsightController.sesion_individual);


module.exports = router;
