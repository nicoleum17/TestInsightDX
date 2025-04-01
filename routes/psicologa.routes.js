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
  "/consulta_aspirante",
  isAuth,
  consultarAspirante,
  psicologaController.get_aspirantes
);

router.get(
  "/consulta_respuestas_aspirante",
  isAuth,
  consultarRespuestasAspirante,
  psicologaController.get_respuestasA
);

router.get(
  "/consulta_respuestas_grupo",
  isAuth,
  psicologaController.get_respuestasG
);

router.get("/sesion_grupal", isAuth, psicologaController.sesion_grupal);

router.get("/sesion_individual", isAuth, psicologaController.sesion_individual);

router.get(
  "/pruebas",
  isAuth,
  consultarPruebas,
  psicologaController.get_prueba
);

router.get("/crear_grupo", isAuth, crearGrupo, psicologaController.crear_grupo);

router.get(
  "/confirmar_creacion_grupo",
  isAuth,
  confirmarCrearGrupo,
  psicologaController.confirmar_creacion_grupo
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

module.exports = router;
