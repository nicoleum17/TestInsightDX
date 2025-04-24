const db = require("../util/database");
module.exports = class Cuadernillo {
  // Obtiene las respuestas correctas que el aspirante tuvo en la prueba
  static getRespuestasCorrectas(idGrupo, idAspirante) {
    return db.execute(
      `SELECT COUNT(*) AS RespuestasCorrectas 
            FROM respuestaotisaspirante ROA JOIN opcionesotis OO ON ROA.idOpcionOtis = OO.idOpcionOtis 
            WHERE ROA.idAspirante = ? AND ROA.idPrueba = 5 AND ROA.idGrupo = ? AND OO.esCorrecta = TRUE
            `,
      [idAspirante, idGrupo]
    );
  }

  // Obtiene el timpo en que el aspirante respindio la prueba
  static getTiempoTotal(idGrupo, idAspirante) {
    return db.execute(
      `SELECT SUM(tiempoRespuesta) AS Tiempo 
            FROM respuestaotisaspirante 
            WHERE idAspirante = ? 
            AND idPrueba = 5 
            AND idGrupo = ?`,
      [idAspirante, idGrupo]
    );
  }

  // Obtiene las preguntas, opciones y la respuesta del aspirante
  static getRespuestasOtisAspirante(idGrupo, idAspirante) {
    return db.execute(
      `SELECT PO.idPreguntaOtis, PO.numeroPregunta, PO.preguntaOtis,
            OO.idOpcionOtis, OO.opcionOtis ,OO.descripcionOpcion, OO.esCorrecta,
            ROA.idOpcionOtis IS NOT NULL AS opcionSeleccionada, ROA.tiempoRespuesta 
            FROM preguntasotis PO 
            JOIN opcionesotis OO ON PO.idPreguntaOtis = OO.idPreguntaOtis
            LEFT JOIN respuestaotisaspirante ROA ON OO.idOpcionOtis = ROA.idOpcionOtis 
            AND ROA.idAspirante = ?
            AND ROA.idGrupo = ?
            AND ROA.idPrueba = 5`,
      [idAspirante, idGrupo]
    );
  }
};
