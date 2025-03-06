const express = require("express");
const router = express.Router();

const testInsightController = require("../controllers/testInsight.controllers");

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

router.get("/preguntas_prueba", (request, response, next) => {
  response.render("preguntas_prueba");
});

router.get("/inicio_psicologa", testInsightController.inicio_psicologa);

router.get("/consulta_aspirante", testInsightController.get_aspirantes);

router.get(
  "/consulta_respuestas_aspirante",
  testInsightController.get_respuestasA
);

router.get("/consulta_grupo", testInsightController.get_grupo);

router.get("/consulta_respuestas_grupo", testInsightController.get_respuestasG);

module.exports = router;
