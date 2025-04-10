const db = require("../util/database");

module.exports = class OpcionKostick {
  constructor(
    mi_opcionKostick,
    mi_descripcionOpcionKostick,
    mi_idPreguntaKostick
  ) {
    this.idOpcionKostick = uuidv4();
    this.opcionKostick = mi_opcionKostick;
    this.descripcionOpcionKostick = mi_descripcionOpcionKostick;
    this.idPreguntaKostick = mi_idPreguntaKostick;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM opcionesKostick");
  }
  static fetchOne(idPreguntaKostick) {
    return db.execute(
      "SELECT * FROM opcionesKostick WHERE idPreguntaKostick = ?",
      [idPreguntaKostick]
    );
  }
  /*  static fetchByNumPregunta(idPreguntaKostick) {
    return db.execute(
      "SELECT * FROM opcionesKostick WHERE idPreguntaKostick = ?",
      [idPreguntaKostick]
    );
  }*/
};
