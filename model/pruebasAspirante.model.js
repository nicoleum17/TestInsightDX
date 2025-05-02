const db = require("../util/database");

module.exports = class PruebaAspirante {
  constructor(mi_idUsuario, mi_idGrupo, mi_idPrueba, mi_estatus) {
    (this.idUsuario = mi_idUsuario),
      (this.idGrupo = mi_idGrupo),
      (this.idPrueba = mi_idPrueba),
      (this.estatus = mi_estatus);
  }
  terminarPrueba() {
    return db.execute(
      "UPDATE pruebasaspirante SET estatus = ? WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?",
      ["Completada", this.idUsuario, this.idGrupo, this.idPrueba]
    );
  }
  static fetchOne(idUsuario) {
    return db.execute("SELECT * FROM pruebasaspirante WHERE idUsuario = ?", [
      idUsuario,
    ]);
  }
  static fetchTerman(){
    
  }
};
