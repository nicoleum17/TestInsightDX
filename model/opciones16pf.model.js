const db = require("../util/database");
/* modelo de las opciones de respuesta de la prueba 16pf */
module.exports = class Opcion16PF {
  constructor(mi_opcion16PF, mi_descripcionOpcion16PF, mi_idPregunta16PF) {
    this.idOpcion16PF = uuidv4();
    this.opcion16PF = mi_opcion16PF;
    this.descripcionOpcion16PF = mi_descripcionOpcion16PF;
    this.idPregunta16PF = mi_idPregunta16PF;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM opciones16pf");
  }

  /* query que obtiene las opciones que pretencen a cierta pregunta mediante el id de la pregunta */
  static fetchOne(idPregunta16PF) {
    return db.execute("SELECT * FROM opciones16pf WHERE idPregunta16PF = ?", [
      idPregunta16PF,
    ]);
  }
};
