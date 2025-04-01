const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class Psicologa {
  constructor(
    mi_idPsicologa,
    mi_idUsuario,
    mi_nombrePsicologa,
    mi_fechaDisponibilidad,
  ) {
    this.idPsicologa = mi_idPsicologa;
    this.idUsuario = mi_idUsuario;
    this.nombres = mi_nombrePsicologa;
    this.fechaDisponibilidad = mi_fechaDisponibilidad;
  }

  static find(user_id, valor) {
    return db.execute(
        `SELECT a.nombres
        FROM aspirantes a
        WHERE a.nombres LIKE ?`,
        [user_id, '%' + valor + '%']);
  }
};
