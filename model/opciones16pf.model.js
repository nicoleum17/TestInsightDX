const db = require("../util/database");

module.exports = class Opcion16PF {
  constructor(mi_opcion16PF, mi_descripcionOpcion16PF, mi_idPregunta16PF) {
    this.idOpcion16PF = uuidv4();
    this.opcion16PF = mi_opcion16PF;
    this.descripcionOpcion16PF = mi_descripcionOpcion16PF;
    this.idPregunta16PF = mi_idPregunta16PF;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM opciones16PF");
  }
  static fetchOne(idOpcion16PF) {
    return db.execute("SELECT * FROM opciones16PF WHERE idOpcion16PF = ?", [
      idOpcion16PF,
    ]);
  }
};
