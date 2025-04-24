const db = require("../../util/database.js");

module.exports = class OpcionOtis {
  constructor(
    idOpcionOtis,
    idPreguntaOtis,
    opcionOtis,
    descripcionOpcion,
    esCorrecta
  ) {
    this.idOpcionOtis = idOpcionOtis;
    this.idPreguntaOtis = idPreguntaOtis;
    this.opcionOtis = opcionOtis;
    this.descripcionOpcion = descripcionOpcion;
    this.esCorrecta = esCorrecta;
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM opcionesotis`);
  }
};
