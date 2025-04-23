const db = require("../../util/database.js");

module.exports = class PreguntaKostick {
  constructor(mi_idPrueba, mi_numeroPreguntaKostick) {
    this.idPreguntaKostick = uuidv4();
    this.idPrueba = mi_idPrueba;
    this.numeroPreguntaKostick = mi_numeroPreguntaKostick;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM preguntaskostick");
  }

  static fetchOne(index) {
    return db.execute(
      "SELECT * FROM preguntaskostick WHERE numeroPreguntaKostick = ?",
      [index]
    );
  }

  static getOpciones(idPreguntaKostick) {
    return db.execute(
      "SELECT * FROM opcioneskostick WHERE idPreguntaKostick = ?",
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
