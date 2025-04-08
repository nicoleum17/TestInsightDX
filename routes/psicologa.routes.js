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

router.get(
  "/calendario",
  isAuth,
  consultarCalendario,
  psicologaController.calendario_psicologa
);

router.get(
  "/consultaAspirante",
  isAuth,
  consultarAspirante,
  psicologaController.get_aspirantes
);

router.get(
  "/consultaRespuestasAspirante",
  isAuth,
  consultarRespuestasAspirante,
  psicologaController.get_respuestasA
);

router.get(
  "/consultaRespuestasGrupo",
  isAuth,
  psicologaController.get_respuestasG
);

router.get("/sesionGrupal", isAuth, psicologaController.sesion_grupal);

router.get("/sesionIndividual", isAuth, psicologaController.sesion_individual);

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

router.get("/cerrar_sesion", psicologaController.get_logout);

router.get("/buscar/:valor", isAuth, psicologaController.get_buscar);

router.get("/buscar", isAuth, psicologaController.get_buscar);

router.get("/grupo/confirmacion/:id", isAuth, psicologaController.getPreguntaSeguridad);

router.post("/grupo/confirmacion/:id", isAuth, psicologaController.postPreguntaSeguridad);

module.exports = router;
