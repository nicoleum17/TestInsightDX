const db = require("../../util/database.js");

module.exports = class Pregunta16PF {
  constructor(mi_pregunta16PF, mi_idPrueba, mi_numeroPregunta16PF) {
    this.idPregunta16PF = uuidv4();
    this.pregunta16PF = mi_pregunta16PF;
    this.idPrueba = mi_idPrueba;
    this.numeroPregunta16PF = mi_numeroPregunta16PF;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM preguntas16pf");
  }

  static fetchOne(index) {
    return db.execute(
      "SELECT * FROM preguntas16pf WHERE numeroPregunta16PF = ?",
      [index]
    );
  }

  static getOpciones(idPregunta16PF) {
    return db.execute("SELECT * FROM opciones16pf WHERE idPregunta16PF = ?", [
      idPregunta16PF,
    ]);
  }
};
