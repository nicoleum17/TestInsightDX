const db = require("../../util/database");

class resultadosSeriesTerman {
  constructor(
    idUsuario,
    idGrupo,
    idSerieTerman,
    idCalificacionTerman,
    categoria,
    puntuacion,
    rango
  ) {
    this.idUsuario = idUsuario;
    this.idGrupo = idGrupo;
    this.idSerieTerman = idSerieTerman;
    this.idCalificacionTerman = idCalificacionTerman;
    this.categoria = categoria;
    this.puntuacion = puntuacion;
    this.rango = rango;
  }

  async save() {
    const [resultado] = await db.execute(
      "INSERT INTO resultadosseriesterman (idUsuario, idGrupo, idSerieTerman, idCalificacionTerman, categoria, puntuacion, rango) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        this.idUsuario,
        this.idGrupo,
        this.idSerieTerman,
        this.idCalificacionTerman,
        this.categoria,
        this.puntuacion,
        this.rango,
      ]
    );
    return resultado;
  }
}

module.exports = resultadosSeriesTerman;
