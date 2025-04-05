const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class RespondeKostick {
  constructor(
    mi_idPreguntaKostick,
    mi_idGrupo,
    mi_idUsuario,
    mi_idOpcionKostick,
    mi_tiempo
  ) {
    this.idPreguntaKostick = mi_idPreguntaKostick;
    this.idGrupo = mi_idGrupo;
    this.idUsuario = mi_idUsuario;
    this.idOpcionKostick = mi_idOpcionKostick;
    this.tiempo = mi_tiempo;
  }
  save() {
    return db
      .execute(
        "INSERT INTO respondeKostick (idPreguntaKostick, idGrupo, idUsuario, idOpcionKostick, tiempo) VALUES (?,?,?,?,?)",
        [
          this.idPreguntaKostick,
          this.idGrupo,
          this.idUsuario,
          this.idOpcionKostick,
          this.tiempo,
        ]
      )
      .then(([result]) => {
        return {
          idPreguntaKostick: this.idPreguntaKostick,
          idGrupo: this.idGrupo,
          idUsuario: this.idUsuario,
        };
      });
  }
};
