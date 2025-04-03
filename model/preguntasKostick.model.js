const db = require("../util/database");

module.exports = class PreguntaKostick {
  constructor(mi_preguntaKostick, mi_idPrueba, mi_numeroPreguntaKostick) {
    this.idPreguntaKostick = uuidv4();
    this.preguntaKostick = mi_preguntaKostick;
    this.idPrueba = mi_idPrueba;
    this.numeroPreguntaKostick = mi_numeroPreguntaKostick;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM preguntasKostick");
  }

  static fetchOne(index) {
    return db.execute(
      "SELECT * FROM preguntasKostick WHERE numeroPreguntaKostick = ?",
      [index]
    );
  }

  static getOpciones(idPreguntaKostick) {
    return db.execute(
      "SELECT * FROM opcionesKostick WHERE idPreguntaKostick = ?",
      [idPreguntaKostick]
    );
  }

  /*static fetchOne(idPreguntaKostick) {
    return db.execute(
      "SELECT * FROM preguntasKostick WHERE idPreguntaKostick = ?",
      [idPreguntaKostick]
    );
  }

  static fetchOneByNumber(numeroPreguntaKostick) {
    return db.execute(
      "SELECT * FROM preguntasKostick WHERE numeroPreguntaKostick = ?",
      [numeroPreguntaKostick]
    );
  }*/
};
