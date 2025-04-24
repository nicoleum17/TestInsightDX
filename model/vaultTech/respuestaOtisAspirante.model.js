const db = require("../util/database.js");

module.exports = class RespuestaOtisAspirante {
  constructor(
    idRespuestaOtis,
    idAspirante,
    idGrupo,
    idPreguntaOtis,
    idOpcionOtis,
    idPrueba,
    respuestaAbierta,
    tiempoRespuesta
  ) {
    this.idRespuestaOtis = idRespuestaOtis;
    this.idAspirante = idAspirante;
    this.idGrupo = idGrupo;
    this.idPreguntaOtis = idPreguntaOtis;
    this.idOpcionOtis = idOpcionOtis;
    this.idPrueba = idPrueba;
    this.respuestaAbierta = respuestaAbierta;
    this.tiempoRespuesta = tiempoRespuesta;
  }

  save() {
    const sql = `
            INSERT INTO respuestasotisaspirantes
            (idAspirante, idGrupo, idPreguntaOtis, idOpcionOtis, idPrueba, respuestaAbierta, tiempoRespuesta)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    return db.execute(sql, [
      this.idAspirante,
      this.idGrupo,
      this.idPreguntaOtis,
      this.idOpcionOtis,
      this.idPrueba,
      this.respuestaAbierta,
      this.tiempoRespuesta,
    ]);
  }
};
