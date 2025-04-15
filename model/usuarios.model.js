const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = class Usuario {
  constructor(mi_idUsuario, mi_usuario, mi_contraseña, mi_idRol) {
    this.idUsuario = mi_idUsuario;
    this.usuario = mi_usuario;
    this.contraseña = mi_contraseña;
    this.idRol = mi_idRol;
  }

  save() {
    return bcrypt
      .hash(this.contraseña, 12)
      .then((contraseña_cifrada) => {
        return db.execute(
          "INSERT INTO usuarios (idUsuario, usuario, contraseña, idRol) VALUES (?, ?, ?, ?)",
          [this.idUsuario, this.usuario, contraseña_cifrada, this.idRol]
        );
      })
      .catch((error) => {
        console.log("Error al guardar un nuevo usuario", error);
      });
  }

  static forCorreo() {
    return this.contraseña;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM usuarios");
  }

  static fetchOne(usuario) {
    return db.execute("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);
  }

  static fetch(usuario) {
    if (usuario) {
      return this.fetchOne(usuario);
    } else {
      return this.fetchAll();
    }
  }

  static getPrivilegios(usuario) {
    return db.execute(
      `
      SELECT DISTINCT p.permiso
      FROM permisos p, tienepermiso tp, roles r, usuarios u
      WHERE p.idPermiso = tp.idPermiso AND tp.idRol = r.idRol AND r.idRol = u.idRol AND u.usuario=?
      `,
      [usuario]
    );
  }

  static getGrupo(idUsuario) {
    return db.execute(
      "SELECT idGrupo FROM perteneceGrupo WHERE idUsuario = ?",
      [idUsuario]
    );
  }
};
