const express = require("express");
const router = express.Router();

const testInsightController = require("../controllers/testInsight.controllers");

router.get("/", (request, response, next) => {
  response.render("login");
});



module.exports = router;
