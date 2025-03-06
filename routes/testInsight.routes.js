const express = require("express");
const router = express.Router();

const testInsightController = require("../controllers/testInsight.controllers");

router.get("/", (request, response, next) => {
  response.render("login");
});

router.get("/inicio_aspirante", testInsightController.get_login);

router.get("/notificaciones_aspirante", testInsightController.get_notificacionA);

router.get("/documentos_aspirante", testInsightController.get_documentosA);

router.get("/calendario_aspirante", testInsightController.get_calendarioA);

router.get("/datos_aspirante", testInsightController.get_datosA);

router.get("/instrucciones_prueba", testInsightController.get_instrucciones);

router.get("/preguntas_prueba", testInsightController.get_preguntasPrueba);

router.get("/inicio_psicologa", testInsightController.inicio_psicologa);

router.get("/consulta_aspirante", testInsightController.get_aspirantes);

router.get(
  "/consulta_respuestas_aspirante",
  testInsightController.get_respuestasA
);

router.get("/consulta_grupo", testInsightController.get_grupo);

router.get("/consulta_respuestas_grupo", testInsightController.get_respuestasG);

router.get("/crear_grupo", testInsightController.crear_grupo);

router.get("/sesion_grupal", testInsightController.sesion_grupal);

router.get("/sesion_individual", testInsightController.sesion_individual);

router.get(
  "/confirmar_creacion_grupo",
  testInsightController.confirmar_creacion_grupo
);

router.get("/formato_entrevista", (request, response, next) => {
  response.render("formato_entrevista");
});

module.exports = router;
