const db = require("../util/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class Responde16PF {
  constructor(mi_idOpcion16PF, mi_tiempo) {
    this.idPregunta16PF = uuidv4();
    this.idGrupo = uuidv4();
    this.codigoIdentidad = uuidv4();
    this.idOpcion16PF = mi_idOpcion16PF;
    this.tiempo = mi_tiempo;
  }
  save() {
    return db
      .execute(
        "INSERT INTO responde16pf (idPregunta16PF, idGrupo, codigoIdentidad, idOpcion16PF, tiempo) VALUES (?,?,?,?,?)",
        [
          this.idPregunta16PF,
          this.idGrupo,
          this.codigoIdentidad,
          this.idOpcion16PF,
          this.tiempo,
        ]
      )
      .then(([result]) => {
        return {
          idPregunta16PF: this.idPregunta16PF,
          idGrupo: this.idGrupo,
          codigoIdentidad: this.codigoIdentidad,
        };
      });
  }
};
