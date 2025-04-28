const db = require("../util/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class PerteneceGrupoParcial {
  constructor(mi_idGrupo, mi_idUsuario) {
    this.idGrupo = mi_idGrupo;
    this.idUsuario = mi_idUsuario;
  }

  saveParcial() {
    return db.execute(
      "INSERT INTO pertenecegrupo (idGrupo, idUsuario) VALUES (?, ?)",
      [this.idGrupo, this.idUsuario]
    );
  }
};
