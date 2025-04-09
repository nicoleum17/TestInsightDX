const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = class Aspirante {
  constructor(
    mi_codigoIdentidad,
    mi_nombres,
    mi_apellidoPaterno,
    mi_apellidoMaterno,
    mi_numTelefono,
    mi_lugarOrigen,
    mi_correo,
    mi_universidadOrigen
  ) {
    this.codigoIdentidad = mi_codigoIdentidad;
    this.idUsuario = uuidv4();
    this.nombres = mi_nombres;
    this.apellidoPaterno = mi_apellidoPaterno;
    this.apellidoMaterno = mi_apellidoMaterno;
    this.numTelefono = mi_numTelefono;
    this.lugarOrigen = mi_lugarOrigen;
    this.correo = mi_correo;
    this.universidadOrigen = mi_universidadOrigen;
  }
  save() {
    return db.execute(
      "INSERT INTO aspirantes (codigoIdentidad, idUsuario, nombres, apellidoPaterno, apellidoMaterno, numTelefono, lugarOrigen, correo, universidadOrigen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        this.codigoIdentidad,
        this.idUsuario,
        this.nombres,
        this.apellidoPaterno,
        this.apellidoMaterno,
        this.numTelefono,
        this.lugarOrigen,
        this.correo,
        this.universidadOrigen,
      ]
    );
  }

  static updateAspirante() {
    return db
      .execute(
        "UPDATE aspirantes SET puestoSolicitado = ? WHERE idUsuario = ?",
        [this.puestoSolicitado, this.idUsuario]
      )
      .then(([result]) => {
        return this.idUsuario;
      });
  }
  static fetchAll() {
    return db.execute("SELECT * FROM aspirantes");
  }

  static fetchOne(idUsuario) {
    return db.execute("SELECT * FROM aspirantes WHERE idUsuario = ?", [
      idUsuario,
    ]);
  }

  static find(valor) {
    return db.execute(
      `SELECT *
        FROM aspirantes a`
    );
  }
};
