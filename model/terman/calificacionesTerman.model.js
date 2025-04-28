const db = require("../../util/database");

class calificacionesSeriesTerman {
  constructor(idUsuario, idGrupo) {
    this.idUsuario = idUsuario;
    this.idGrupo = idGrupo;
    this.puntosTotales = 0;
    this.rango = "Sin determinar";
    this.coeficienteIntelectual = 0;
  }

  async save() {
    const [resultado] = await db.execute(
      "INSERT INTO calificacionesterman (idUsuario, idGrupo, puntosTotales, rango, coeficienteIntelectual) VALUES (?, ?, ?, ?, ?)",
      [
        this.idUsuario,
        this.idGrupo,
        this.puntosTotales,
        this.rango,
        this.coeficienteIntelectual,
      ]
    );
    return resultado;
  }

  async fetchCalificacionById(idUsuario, idGrupo) {
    const [calificacion] = await db.execute(
      "SELECT * FROM calificacionesterman WHERE idUsuario = ? AND idGrupo = ?",
      [idUsuario, idGrupo]
    );
    return calificacion;
  }

  async updateCalificacionById(
    nuevoTotal,
    nuevoRango,
    nuevoCoeficienteIntelectual,
    idCalificacionTerman
  ) {
    const [resultado] = await db.execute(
      "UPDATE calificacionesterman SET puntosTotales = ?, rango = ?, coeficienteIntelectual = ? WHERE idCalificacionTerman = ?",
      [
        nuevoTotal,
        nuevoRango,
        nuevoCoeficienteIntelectual,
        idCalificacionTerman,
      ]
    );
    return resultado;
  }
}

module.exports = calificacionesSeriesTerman;
