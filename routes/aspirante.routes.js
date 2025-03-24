const express = require("express");
const router = express.Router();

const aspiranteController = require("../controllers/aspirante.controllers");

router.get("/inicio_aspirante", aspiranteController.get_login);

router.get("/notificaciones_aspirante", aspiranteController.get_notificacionA);

router.get("/documentos_aspirante", aspiranteController.get_documentosA);

router.get("/calendario_aspirante", aspiranteController.get_calendarioA);

router.get("/datos_aspirante", aspiranteController.get_datosA);

router.get("/instrucciones_prueba", aspiranteController.get_instrucciones);

router.get("/preguntas_prueba", aspiranteController.get_preguntasPrueba);

module.exports = router;