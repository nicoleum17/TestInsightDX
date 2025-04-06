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
  "/notificacionesAspirante",
  isAuth,
  aspiranteController.get_notificacionA
);

router.get(
  "/documentosAspirante",
  isAuth,
  cargarDocumentos,
  aspiranteController.get_documentosA
);

router.get(
  "/calendarioAspirante",
  isAuth,
  consultarCalendario,
  aspiranteController.get_calendarioA
);

router.get(
  "/datosAspirante/:idPrueba",
  isAuth,
  verificarDatosPersonales,
  aspiranteController.get_datosA
);

router.get(
  "/instruccionesPrueba/:idPrueba",
  isAuth,
  consultarPrueba,
  aspiranteController.get_instrucciones
);

router.get(
  "/preguntasPrueba/:idPrueba",
  isAuth,
  aspiranteController.get_preguntasPrueba
);

router.post(
  "/siguiente_pregunta",
  isAuth,
  aspiranteController.post_siguiente_pregunta
);

router.post("/pruebaCompletada", isAuth, aspiranteController.pruebaCompletada);

router.get(
  "/pruebaCompletada",
  isAuth,
  aspiranteController.get_pruebaCompletada
);

router.post(
  "/siguiente_pregunta1",
  isAuth,
  aspiranteController.post_siguiente_pregunta1
);

router.post(
  "/pruebaCompletada1",
  isAuth,
  aspiranteController.pruebaCompletada1
);

router.get(
  "/formatoEntrevista",
  isAuth,
  registrarRespuestasFE,
  aspiranteController.formato_entrevista
);

router.post(
  "/formatoEntrevista",
  isAuth,
  aspiranteController.post_formato_entrevista
);

router.get(
  "/formatoEntrevistaPreguntasP",
  isAuth,
  aspiranteController.formato_entrevista_preguntasP
);

router.post(
  "/post_formatoEntrevistaPreguntasP",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasP
);

router.get("/cerrar_sesion", aspiranteController.get_logout);

router.get(
  "/formatoEntrevistaDA",
  isAuth,
  aspiranteController.formato_entrevista_DA
);

router.post(
  "/formatoEntrevistaDA",
  isAuth,
  aspiranteController.post_formato_entrevista_DA
);

router.get(
  "/formatoEntrevistaPreguntasDA",
  isAuth,
  aspiranteController.formato_entrevista_preguntasDA
);

router.post(
  "/formatoEntrevistaPreguntasDA",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasDA
);

router.get(
  "/formatoEntrevistaDL",
  isAuth,
  aspiranteController.formato_entrevista_DL
);

router.post(
  "/formatoEntrevistaDL",
  isAuth,
  aspiranteController.post_formato_entrevista_DL
);

router.get(
  "/formatoEntrevistaPreguntasDL",
  isAuth,
  aspiranteController.formato_entrevista_preguntasDL
);

router.post(
  "/formatoEntrevistaPreguntasDL",
  isAuth,
  aspiranteController.post_formato_entrevista_preguntasDL
);

router.get(
  "/formatoEntrevistaFamilia",
  isAuth,
  aspiranteController.formato_entrevista_familia
);

router.post(
  "/formatoEntrevistaFamilia",
  isAuth,
  aspiranteController.post_formato_entrevista_familia
);

router.get(
  "/formatoEntrevista/Familiar/AbueloM",
  isAuth,
  aspiranteController.formato_entrevista_familiar_abueloM
);

router.get(
  "/formatoEntrevista/Familiar/AbueloP",
  isAuth,
  aspiranteController.formato_entrevista_familiar_abueloP
);

router.get(
  "/formatoEntrevista/Familiar/TioM",
  isAuth,
  aspiranteController.formato_entrevista_familiar_TioM
);

router.get(
  "/formatoEntrevista/Familiar/TioP",
  isAuth,
  aspiranteController.formato_entrevista_familiar_TioP
);

router.get(
  "/formatoEntrevista/Familiar/Padres",
  isAuth,
  aspiranteController.formato_entrevista_familiar_Padres
);

router.get(
  "/formatoEntrevista/Familiar/Pareja",
  isAuth,
  aspiranteController.formato_entrevista_familiar_Pareja
);

router.get(
  "/formatoEntrevista/Familiar/Hijos",
  isAuth,
  aspiranteController.formato_entrevista_familiar_Hijos
);

router.post(
  "/formatoEntrevista/Familiar/AbueloM",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_abueloM
);

router.post(
  "/formatoEntrevista/Familiar/AbueloP",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_abueloP
);

router.post(
  "/formatoEntrevista/Familiar/TioM",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_TioM
);

router.post(
  "/formatoEntrevista/Familiar/TioP",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_TioP
);

router.post(
  "/formatoEntrevista/Familiar/Padres",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_Padres
);

router.post(
  "/formatoEntrevista/Familiar/Pareja",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_Pareja
);

router.post(
  "/formatoEntrevista/Familiar/Hijos",
  isAuth,
  aspiranteController.post_formato_entrevista_familiar_Hijos
);
module.exports = router;
