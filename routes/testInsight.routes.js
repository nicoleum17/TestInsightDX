const express = require("express");
const router = express.Router();

const testInsightController = require("../controllers/testInsight.controllers");

router.get("/login", testInsightController.get_login);
router.get("/login", testInsightController.post_login);

module.exports = router;
