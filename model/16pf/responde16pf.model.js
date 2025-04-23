const db = require("../../util/database");
const { v4: uuidv4 } = require("uuid");

module.exports = class Responde16PF {
  constructor(
    mi_idPregunta16PF,
    mi_idGrupo,
    mi_idUsuario,
    mi_idOpcion16PF,
    mi_tiempo
  ) {
    this.idRespuesta16PF = uuidv4();
    this.idPregunta16PF = mi_idPregunta16PF;
    this.idGrupo = mi_idGrupo;
    this.idUsuario = mi_idUsuario;
    this.idOpcion16PF = mi_idOpcion16PF;
    this.tiempo = mi_tiempo;
  }
  save() {
    return db
      .execute(
        "INSERT INTO responde16pf (idRespuesta16PF, idPregunta16PF, idGrupo, idUsuario, idOpcion16PF, tiempo) VALUES (?,?,?,?,?,?)",
        [
          this.idRespuesta16PF,
          this.idPregunta16PF,
          this.idGrupo,
          this.idUsuario,
          this.idOpcion16PF,
          this.tiempo,
        ]
      )
      .then(([result]) => {
        return {
          idPregunta16PF: this.idPregunta16PF,
          idGrupo: this.idGrupo,
          idUsuario: this.idUsuario,
        };
      });
  }
};
