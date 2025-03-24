const express = require("express");
const router = express.Router();

const psicologaController = require("../controllers/psicologa.controllers");

router.get("/inicio_psicologa", psicologaController.inicio_psicologa);

router.get("/consulta_aspirante", psicologaController.get_aspirantes);

router.get(
  "/consulta_respuestas_aspirante",
  psicologaController.get_respuestasA
);

router.get("/consulta_grupo", psicologaController.get_grupo);

router.get("/consulta_respuestas_grupo", psicologaController.get_respuestasG);

router.get("/crear_grupo", psicologaController.crear_grupo);

router.get(
  "/confirmar_creacion_grupo",
  psicologaController.confirmar_creacion_grupo
);

router.get("/formato_entrevista", psicologaController.formato_entrevista);

module.exports = router;