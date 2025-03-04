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

router.get("/documentos_aspirante", (request, response, next) => {
  response.render("documentos_aspirante");
});

router.get("/calendario_aspirante", (request, response, next) => {
  response.render("calendario_aspirante");
});

router.get("/datos_aspirante", (request, response, next) => {
  response.render("datos_aspirante");
});

router.get("/instrucciones_prueba", (request, response, next) => {
  response.render("instrucciones_prueba");
});

module.exports = router;
