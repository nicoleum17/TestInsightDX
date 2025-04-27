const db = require("../util/database.js");

module.exports = class RespuestasPreguntasFormato {
  static fetchOne(idUsuario) {
    return db.execute(
      `
            SELECT * FROM respuestaspreguntasformatos WHERE idUsuario = ?`,
      [idUsuario]
    );
  }
  static getPreguntas() {
    return db.execute(`
      SELECT * FROM pregunta`);
  }
};
