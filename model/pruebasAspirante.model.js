const db = require("../util/database");

module.exports = class PruebaAspirante {
  constructor(mi_idUsuario, mi_idGrupo, mi_idPrueba, mi_estatus) {
    (this.idUsuario = mi_idUsuario),
      (this.idGrupo = mi_idGrupo),
      (this.idPrueba = mi_idPrueba),
      (this.estatus = mi_estatus);
  }
  terminarPrueba() {
    console.log(
      "Params para query",
      this.idUsuario,
      this.idGrupo,
      this.idPrueba
    );
    return db.execute(
      "UPDATE pruebasAspirante SET estatus = ? WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?",
      ["Completada", this.idUsuario, this.idGrupo, this.idPrueba]
    );
  }
};
