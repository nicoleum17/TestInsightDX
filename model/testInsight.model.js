const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class Usuario {
  constructor(mi_usuario, mi_contraseña, mi_Rol) {
    this.usuario = uuidv4();
    this.contraseña = mi_contraseña;
    this.idRol = mi_Rol;
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
