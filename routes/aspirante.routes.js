const express = require("express");
const router = express.Router();

const aspiranteController = require("../controllers/aspirante.controllers");
const isAuth = require("../util/is_auth");

router.get("/inicio", isAuth, aspiranteController.get_root);

router.get(
  "/notificaciones_aspirante",
  isAuth,
  aspiranteController.get_notificacionA
);

router.get(
  "/documentos_aspirante",
  isAuth,
  aspiranteController.get_documentosA
);

router.get(
  "/calendario_aspirante",
  isAuth,
  aspiranteController.get_calendarioA
);

router.get("/datos_aspirante", isAuth, aspiranteController.get_datosA);

router.get(
  "/instrucciones_prueba/:idPrueba",
  isAuth,
  aspiranteController.get_instrucciones
);

router.get(
  "/preguntas_prueba",
  isAuth,
  aspiranteController.get_preguntasPrueba
);

router.get(
  "/formato_entrevista",
  isAuth,
  aspiranteController.formato_entrevista
);

module.exports = router;
