const db = require("../util/database.js");

module.exports = class RespuestaOtisAspirante {
  constructor(
    idRespuestaOtis,
    idUsuario,
    idGrupo,
    idPreguntaOtis,
    idOpcionOtis,
    idPrueba,
    respuestaAbierta,
    tiempoRespuesta
  ) {
    this.idRespuestaOtis = idRespuestaOtis;
    this.idUsuario = idUsuario;
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
            (idUsuario, idGrupo, idPreguntaOtis, idOpcionOtis, idPrueba, respuestaAbierta, tiempoRespuesta)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    return db.execute(sql, [
      this.idUsuario,
      this.idGrupo,
      this.idPreguntaOtis,
      this.idOpcionOtis,
      this.idPrueba,
      this.respuestaAbierta,
      this.tiempoRespuesta,
    ]);
  }
};
