const express = require("express");
const router = express.Router();

const psicologaController = require("../controllers/psicologa.controllers");
const isAuth = require("../util/is_auth");
const inicioPsicologa = require("../util/inicioPsicologa");
const consultarPruebas = require("../util/puedeConsultarPruebas");
const crearGrupo = require("../util/puedeCrearGrupo");
const consultarCalendario = require("../util/puedeConsultarCalendario");
const consultarFE = require("../util/puedeConsultarFormatoEntrevista");
const consultarAspirante = require("../util/puedeConsultarAspirante");
const consultarRespuestasAspirante = require("../util/puedeConsultarRespuestasAspirante");
const confirmarCrearGrupo = require("../util/puedeConfirmarCrearGrupo");

router.get(
  "/inicio",
  isAuth,
  inicioPsicologa,
  psicologaController.inicio_psicologa
);

router.get(
  "/notificaciones",
  isAuth,
  psicologaController.notificaciones_psicologa
);

router.get("/PsicologaAuth", isAuth, psicologaController.getOauthAuthenticator);

router.get("/redirect", isAuth, psicologaController.getRedirectOauth);

router.get(
  "/calendarios/calendario",
  isAuth,
  consultarCalendario,
  psicologaController.getCalendario
);

router.get(
  "/calendarios/eventos",
  isAuth,
  consultarCalendario,
  psicologaController.getEventoCalendario
);

router.get(
  "/consultaAspirante",
  isAuth,
  consultarAspirante,
  psicologaController.get_aspirantes
);

router.get(
  "/registrarAspirante",
  isAuth,
  psicologaController.registrarAspirante
);

router.post(
  "/registrarAspirante",
  isAuth,
  psicologaController.post_registrarAspirante
);

router.get(
  "/consultaRespuestasAspirante/:idusuario/:idprueba",
  isAuth,
  consultarRespuestasAspirante,
  psicologaController.get_respuestasA
);

router.get(
  "/consultaRespuestasGrupo",
  isAuth,
  psicologaController.get_respuestasG
);

router.get(
  "/pruebas",
  isAuth,
  consultarPruebas,
  psicologaController.get_prueba
);

router.get("/crearGrupo", isAuth, crearGrupo, psicologaController.crear_grupo);

router.get(
  "/grupo/confirmarCreacion",
  isAuth,
  confirmarCrearGrupo,
  psicologaController.confirmar_creacion_grupo
);

router.post(
  "/grupo/confirmarCreacion",
  isAuth,
  confirmarCrearGrupo,
  psicologaController.post_grupo
);

router.get("/grupo/elegir", isAuth, psicologaController.elegir_grupo);

router.get(
  "/grupo/registra_reporte/:id",
  isAuth,
  psicologaController.registra_reporte_grupo
);

router.get(
  "/grupo/registra_foda/:id",
  isAuth,
  psicologaController.registra_foda_grupo
);

router.post(
  "/grupo/registra_foda/:id",
  isAuth,
  psicologaController.post_registra_foda_grupo
);

router.get("/grupo/:id", isAuth, psicologaController.get_grupo);

router.post(
  "/grupo/:id",
  isAuth,
  psicologaController.post_registra_reporte_grupo
);

router.get(
  "/grupo/:id/modificar",
  isAuth,
  psicologaController.get_modificarGrupo
);

router.post(
  "/grupo/:id/modificar",
  isAuth,
  psicologaController.post_modificarGrupo
);

router.get(
  "/modificarAspirante/:idUsuario",
  isAuth,
  psicologaController.get_modificarAspirante
);

router.post(
  "/modificarAspirante/:idUsuario",
  isAuth,
  psicologaController.post_modificarAspirante
);

router.get(
  "/reporteAspirante/:idUsuario",
  isAuth,
  psicologaController.get_reporteAspirante
);

router.get(
  "/consultarDocumentosAspirante/:idUsuario",
  isAuth,
  psicologaController.get_consultarReporteAspirante
);

router.get("/pdf/:filename", psicologaController.getPdfFile);

router.get("/cerrar_sesion", psicologaController.get_logout);

router.get("/buscar/:valor", isAuth, psicologaController.get_buscar);

router.get("/buscar", isAuth, psicologaController.get_buscar);

router.get(
  "/grupo/confirmacion/:id",
  isAuth,
  psicologaController.getPreguntaSeguridad
);

router.post(
  "/grupo/confirmacion/:id",
  isAuth,
  psicologaController.postPreguntaSeguridad
);

router.get(
  "/pruebasActivas/:valor",
  isAuth,
  psicologaController.get_pruebasActivas
);

router.get(
  "/kostickActiva/:valor",
  isAuth,
  psicologaController.get_kostickActiva
);

router.get(
  "/registraReporte/:idUsuario",
  isAuth,
  psicologaController.registraReporte
);

router.post(
  "/registraReporte/:idUsuario",
  isAuth,
  psicologaController.post_registraReporte
);

router.get("/P16PFActiva/:valor", isAuth, psicologaController.get_P16PFActiva);

module.exports = router;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cuadernillo de respuestas de la prueba OTIS por aspirante
router.get(
  "/cuadernillo-otis/:idGrupo/:idUsuario/:idInstitucion",
  isAuth,
  psicologaController.getCuadernilloOtis
);

// Vista con el análisis de la prueba otis del aspirante
router.get(
  "/analisis-otis/:idGrupo/:idUsuario/:idInstitucion",
  isAuth,
  psicologaController.getAnalisisOtis
);

// Vista con el análisis de la prueba Colores del aspirante
router.get(
  "/analisis-colores/:idGrupo/:idUsuario/:idInstitucion",
  isAuth,
  psicologaController.getAnalisisColores
);
// CUADERNILLO COLORES
router.get(
  "/cuadernillo-colores/:idGrupo/:idUsuario/:idInstitucion",
  isAuth,
  psicologaController.getCuadernilloColores
);
