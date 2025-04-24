const db = require("../../util/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class RespondeKostick {
  constructor(
    mi_idPreguntaKostick,
    mi_idGrupo,
    mi_idUsuario,
    mi_idOpcionKostick,
    mi_tiempo
  ) {
    this.idRespuestaKostick = uuidv4();
    this.idPreguntaKostick = mi_idPreguntaKostick;
    this.idGrupo = mi_idGrupo;
    this.idUsuario = mi_idUsuario;
    this.idOpcionKostick = mi_idOpcionKostick;
    this.tiempo = mi_tiempo;
  }
  save() {
    return db
      .execute(
        "INSERT INTO respondekostick (idRespuestaKostick, idPreguntaKostick, idGrupo, idUsuario, idOpcionKostick, tiempo) VALUES (?,?,?,?,?,?)",
        [
          this.idRespuestaKostick,
          this.idPreguntaKostick,
          this.idGrupo,
          this.idUsuario,
          this.idOpcionKostick,
          this.tiempo,
        ]
      )
      .then(([result]) => {
        return this.idUsuario;
      });
  }

  static fetchRespuesta(idGrupo, idUsuario, numeroPreguntaKostick) {
    return db.execute(
      "SELECT opcionKostick FROM opcioneskostick WHERE idOpcionKostick = (SELECT idOpcionKostick FROM respondekostick WHERE idGrupo = ? AND idUsuario = ? AND idPreguntaKostick = (SELECT idPreguntaKostick FROM preguntaskostick WHERE numeroPreguntaKostick = ?))",
      [idGrupo, idUsuario, numeroPreguntaKostick]
    );
  }
};
