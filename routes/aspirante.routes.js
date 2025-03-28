const express = require("express");
const router = express.Router();

const aspiranteController = require("../controllers/aspirante.controllers");
const isAuth = require("../util/is_auth");

router.get("/inicio_aspirante", isAuth, aspiranteController.get_root);

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
  "/instrucciones_prueba",
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

router.post(
  "/formato_entrevista",
  isAuth,
  aspiranteController.post_formato_entrevista
);

router.get(
  "/formato_entrevista_preguntasP",
  isAuth,
  aspiranteController.formato_entrevista_preguntasP

)

router.post(
  "/post_formato_entrevista_preguntasP",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasP
)

module.exports = router;
