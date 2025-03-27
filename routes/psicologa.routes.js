const express = require("express");
const router = express.Router();

const psicologaController = require("../controllers/psicologa.controllers");

router.get("/inicio_psicologa", psicologaController.inicio_psicologa);

router.get(
  "/notificaciones_psicologa",
  psicologaController.notificaciones_psicologa
);

router.get("/calendario_psicologa", psicologaController.calendario_psicologa);

router.get("/consulta_aspirante", psicologaController.get_aspirantes);

router.get(
  "/consulta_respuestas_aspirante",
  psicologaController.get_respuestasA
);

router.get("/consulta_respuestas_grupo", psicologaController.get_respuestasG);

router.get("/sesion_grupal", psicologaController.sesion_grupal);

router.get("/sesion_individual", psicologaController.sesion_individual);

router.get("/consulta_prueba", psicologaController.get_prueba);

router.get("/crear_grupo", psicologaController.crear_grupo);

router.get(
  "/confirmar_creacion_grupo",
  psicologaController.confirmar_creacion_grupo
);

router.get("/elegir_grupo", psicologaController.elegir_grupo);

router.get("/consulta_grupo", psicologaController.get_grupo);

router.get(
  "/registra_reporte_grupo",
  psicologaController.registra_reporte_grupo
);

module.exports = router;
