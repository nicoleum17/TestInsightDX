const db = require("../util/database");
/* modelo de las opciones de respuesta de la prueba Kostick */

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
    return db.execute("SELECT * FROM opcioneskostick");
  }

  /* query que obtiene las opciones que pretencen a cierta pregunta mediante el id de la pregunta */

  static fetchOne(idPreguntaKostick) {
    return db.execute(
      "SELECT * FROM opcionesKostick WHERE idPreguntakostick = ?",
      [idPreguntaKostick]
    );
  }
};
