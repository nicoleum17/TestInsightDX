const db = require("../../util/database");

class RespuestasPrueba {
  constructor(idUsuario, idGrupo, idPrueba, respuestas) {
    this.idUsuario = idUsuario;
    this.idGrupo = idGrupo;
    this.idPrueba = idPrueba;
    this.respuestas = respuestas; // [{ idPregunta, opcion, tiempo }, ...]
  }

  save() {
    const promesas = this.respuestas.map((r) => {
      // r = { idPregunta, opcion, tiempo }
      console.log("Se manda llamar PruebasX", r);
      return db.execute(`CALL proInsertarRespuestasPruebaX(?, ?, ?, ?, ?, ?)`, [
        this.idUsuario,
        this.idGrupo,
        r.idPregunta,
        this.idPrueba,
        r.opcion,
        r.tiempo || 0,
      ]);
    });

    return Promise.all(promesas)
      .then(() => console.log("Respuestas guardadas."))
      .catch((err) => {
        console.error("Error al guardar respuestas:", err);
        throw err;
      });
  }
}

module.exports = RespuestasPrueba;
