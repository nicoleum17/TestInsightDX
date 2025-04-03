const db = require("../util/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class PerteneceGrupo {
  constructor(mi_fechaZoomIndividual) {
    this.idGrupo = uuidv4();
    this.idUsuario = uuidv4();
    this.fechaZoomIndividual;
  }
  static fetchAll() {
    return db.execute("SELECT * FROM perteneceGrupo");
  }
  static fecthOne(idUsuario) {
    return db.execute(
      "SELECT idGrupo FROM perteneceGrupo WHERE idUsuario = ?",
      [idUsuario]
    );
  }
};
