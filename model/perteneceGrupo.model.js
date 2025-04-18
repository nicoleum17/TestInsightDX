const db = require("../util/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class PerteneceGrupo {
  constructor(mi_idGrupo, mi_idUsuario, mi_fechaZoomIndividual, mi_enlaceZoom) {
    this.idGrupo = mi_idGrupo;
    this.idUsuario = mi_idUsuario;
    this.fechaZoomIndividual = mi_fechaZoomIndividual;
    this.enlaceZoom = mi_enlaceZoom;
  }

  save() {
    return db.execute(
      "INSERT INTO pertenecegrupo (idGrupo, idUsuario, fechaZoomIndividual, enlaceZoom) VALUES (?, ?, ?, ?)",
      [this.idGrupo, this.idUsuario, this.fechaZoomIndividual, this.enlaceZoom]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM pertenecegrupo");
  }
  static fetchOne(idUsuario) {
    return db.execute("SELECT * FROM pertenecegrupo WHERE idUsuario = ?", [
      idUsuario,
    ]);
  }

  static updatePerteneceGrupo() {
    return db.execute(
      "UPDATE pertenecegrupo SET fechaZoomIndividual = ?, enlaceZoom = ? WHERE idUsuario = ?",
      [fechaZoomIndividual, enlaceZoom, idUsuario]
    );
  }

  static consultarReporte(idUsuario) {
    return db.execute(
      "SELECT reporte FROM perteneceGrupo WHERE idUsuario = ?",
      [idUsuario]
    );
  }
};
