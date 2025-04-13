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
};
