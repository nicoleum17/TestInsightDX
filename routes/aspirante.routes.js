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

/*router.post(
  "/preguntas_prueba/:idPrueba",
  isAuth,
  aspiranteController.post_empezarPrueba
);*/

router.post(
  "/siguientePregunta/:idPrueba",
  isAuth,
  aspiranteController.post_siguientePregunta
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

router.get("/formato_entrevista_DA", isAuth,
  aspiranteController.formato_entrevista_DA);

router.post("/formato_entrevista_DA", isAuth,
  aspiranteController.post_formato_entrevista_DA);

router.get("/formato_entrevista_preguntasDA", isAuth,
  aspiranteController.formato_entrevista_preguntasDA);

router.post("/formato_entrevista_preguntasDA", isAuth,
  aspiranteController.post_formato_entrevista_preguntasDA);

router.get("/formato_entrevista_DL", isAuth,
  aspiranteController.formato_entrevista_DL)

module.exports = router;
