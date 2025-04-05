const express = require("express");
const router = express.Router();
const aspiranteController = require("../controllers/aspirante.controllers");
const isAuth = require("../util/is_auth");
const inicioAspirante = require("../util/inicioAspirante");
const consultarCalendario = require("../util/puedeConsultarCalendario");
const cargarDocumentos = require("../util/puedeCargarDocumentos");
const registrarRespuestasFE = require("../util/puedeRegistrarRespuestasFormatoEntrevista");
const consultarPrueba = require("../util/puedeConsultarPrueba");
const verificarDatosPersonales = require("../util/puedeVerificarDatosPersonales");

router.get("/inicio", isAuth, inicioAspirante, aspiranteController.get_root);

router.get(
  "/notificaciones_aspirante",
  isAuth,
  aspiranteController.get_notificacionA
);

router.get(
  "/documentos_aspirante",
  isAuth,
  cargarDocumentos,
  aspiranteController.get_documentosA
);

router.get(
  "/calendario_aspirante",
  isAuth,
  consultarCalendario,
  aspiranteController.get_calendarioA
);

router.get(
  "/datos_aspirante/:idPrueba",
  isAuth,
  verificarDatosPersonales,
  aspiranteController.get_datosA
);

router.get(
  "/instrucciones_prueba/:idPrueba",
  isAuth,
  consultarPrueba,
  aspiranteController.get_instrucciones
);

router.get(
  "/preguntas_prueba/:idPrueba",
  isAuth,
  aspiranteController.get_preguntasPrueba
);

router.get(
  "/siguiente_pregunta",
  isAuth,
  aspiranteController.post_siguiente_pregunta
);

router.get(
  "/siguiente_pregunta1",
  isAuth,
  aspiranteController.post_siguiente_pregunta1
);

router.get(
  "/formato_entrevista",
  isAuth,
  registrarRespuestasFE,
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
);

router.post(
  "/post_formato_entrevista_preguntasP",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasP
);

router.get("/cerrar_sesion", aspiranteController.get_logout);

router.get(
  "/formato_entrevista_DA",
  isAuth,
  aspiranteController.formato_entrevista_DA
);

router.post(
  "/formato_entrevista_DA",
  isAuth,
  aspiranteController.post_formato_entrevista_DA
);

router.get(
  "/formato_entrevista_preguntasDA",
  isAuth,
  aspiranteController.formato_entrevista_preguntasDA
);

router.post(
  "/formato_entrevista_preguntasDA",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasDA
);

router.get(
  "/formato_entrevista_DL",
  isAuth,
  aspiranteController.formato_entrevista_DL
);

router.post(
  "/formato_entrevista_DL",
  isAuth,
  aspiranteController.post_formato_entrevista_DL
);

router.get(
  "/formato_entrevista_preguntasDL",
  isAuth,
  aspiranteController.formato_entrevista_preguntasDL
);

router.post(
  "/formato_entrevista_preguntasDL",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasDL
);

router.get(
  "/formato_entrevista_familia",
  isAuth,
  aspiranteController.formato_entrevista_familia
);

router.post(
  "/formato_entrevista_familia",
  isAuth,
  aspiranteController.post_formato_entrevista_familia
);

router.get(
  "/formato_entrevista_familiar_abueloM",
  isAuth,
  aspiranteController.formato_entrevista_familiar_abueloM
);

router.post(
  "/formato_entrevista_familiar_abueloM",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_abueloM
);



module.exports = router;
