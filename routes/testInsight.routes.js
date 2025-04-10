const express = require("express");
const router = express.Router();

const testInsightController = require("../controllers/testInsight.controllers");

router.get("/login", testInsightController.get_login);
router.post("/login", testInsightController.post_login);
router.get("/", testInsightController.get_login);
router.post("/", testInsightController.post_login);

module.exports = router;
