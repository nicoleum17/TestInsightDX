const express = require("express");
const router = express.Router();

router.get("/", (request, response, next) => {
  response.render("login");
});

router.get("/inicio_aspirante", (request, response, next) => {
  response.render("inicio_aspirante");
});

router.get("/notificaciones_aspirante", (request, response, next) => {
  response.render("notificaciones_aspirante");
});

router.get("/menu_aspirante", (request, response, next) => {
  response.render("menu_aspirante");
});

router.get("/instrucciones_prueba", (request, response, next) => {
  response.render("instrucciones_prueba");
});

module.exports = router;
