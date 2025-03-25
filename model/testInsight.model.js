const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class Usuario {
  constructor(mi_usuario, mi_contraseña) {
    this.usuario = mi_usuario;
    this.contraseña = mi_contraseña;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM usuarios");
  }

  static fetchOne(usuario) {
    return db.execute("SELECT * FROM usuario WHERE usuario = ?", [usuario]);
  }

  static fetch(usuario) {
    if (usuario) {
      return this.fetchOne(usuario);
    } else {
      return this.fetchAll();
    }
  }
};
