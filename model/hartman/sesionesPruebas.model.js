const db = require("../../util/database");

// Define la clase SesionesPruebas para manejar operaciones sobre la tabla sesionesprueba
class SesionesPruebas {
  async updateSesionPrueba({ estatus, idUsuario, idGrupo, idPrueba }) {
    if (estatus === 1) {
      await db.execute(
        "UPDATE sesionesprueba SET estatus = ? WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?",
        ["Incompleto", idUsuario, idGrupo, idPrueba]
      );
    } else {
      await db.execute(
        "UPDATE sesionesprueba SET estatus = ? WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?",
        ["Completado", idUsuario, idGrupo, idPrueba]
      );
    }
  }

  async fetchById({ idUsuario, idGrupo, idPrueba }) {
    const [rows] = await db.execute(
      "SELECT estatus FROM sesionesprueba WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?",
      [idUsuario, idGrupo, idPrueba]
    );
    return rows;
  }
}

module.exports = SesionesPruebas;
