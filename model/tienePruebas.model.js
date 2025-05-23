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
      "INSERT INTO tienepruebas (idGrupo, idPrueba, fechaLimitePrueba) VALUES (?, ?, ?)",
      [this.idGrupo, this.idPrueba, this.fechaLimitePrueba]
    );
  }
  static getFecha(idGrupo) {
    return db.execute("SELECT * FROM tienepruebas WHERE idGrupo = ?", [
      idGrupo,
    ]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM tienepruebas");
  }

  static updateGrupo(fechaLimitePrueba, idGrupo) {
    console.log("Update parameters", fechaLimitePrueba, idGrupo);
    return db.execute(
      "UPDATE tienepruebas SET fechaLimitePrueba = ? WHERE idGrupo = ?",
      [fechaLimitePrueba, idGrupo]
    );
  }

  static getFechaLimite(idUsuario) {
    return db.execute(
      "SELECT pg.idUsuario, tp.idPrueba, tp.fechaLimitePrueba FROM tienepruebas tp JOIN pertenecegrupo pg ON tp.idGrupo = pg.idGrupo WHERE idUsuario = ?",
      [idUsuario]
    );
  }
};
