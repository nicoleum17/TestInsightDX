const db = require("../util/database");

module.exports = class TienePruebas {
  constructor(mi_idGrupo, mi_idPrueba, mi_fechaLimitePrueba) {
    this.idGrupo = mi_idGrupo;
    this.idPrueba = mi_idPrueba;
    this.fechaLimitePrueba = mi_fechaLimitePrueba;
  }

  //Este método servirá para guardar de manera persistente el nuevo objeto.
  save() {
    return db.execute(
      "INSERT INTO tienePruebas (idGrupo, idPrueba, fechaLimitePrueba) VALUES (?, ?, ?)",
      [this.idGrupo, this.idPrueba, this.fechaLimitePrueba]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM tienePruebas");
  }
};
