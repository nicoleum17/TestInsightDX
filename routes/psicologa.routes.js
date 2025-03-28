const express = require("express");
const router = express.Router();

const psicologaController = require("../controllers/psicologa.controllers");
const isAuth = require("../util/is_auth");

router.get("/inicio", isAuth, psicologaController.inicio_psicologa);

router.get(
  "/notificaciones_psicologa",
  isAuth,
  psicologaController.notificaciones_psicologa
);

router.get(
  "/calendario_psicologa",
  isAuth,
  psicologaController.calendario_psicologa
);

router.get("/consulta_aspirante", isAuth, psicologaController.get_aspirantes);

router.get(
  "/consulta_respuestas_aspirante",
  isAuth,
  psicologaController.get_respuestasA
);

router.get(
  "/consulta_respuestas_grupo",
  isAuth,
  psicologaController.get_respuestasG
);

router.get("/sesion_grupal", isAuth, psicologaController.sesion_grupal);

router.get("/sesion_individual", isAuth, psicologaController.sesion_individual);

router.get("/pruebas", isAuth, psicologaController.get_prueba);

router.get("/crear_grupo", isAuth, psicologaController.crear_grupo);

router.get(
  "/confirmar_creacion_grupo",
  isAuth,
  psicologaController.confirmar_creacion_grupo
);

router.get("/grupo/elegir", isAuth, psicologaController.elegir_grupo);

router.get(
  "/grupo/registra_reporte",
  isAuth,
  psicologaController.registra_reporte_grupo
);

//router.get("/grupo", psicologaController.get_grupo);

router.get("/grupo/:id", isAuth, psicologaController.get_grupo);

module.exports = router;
