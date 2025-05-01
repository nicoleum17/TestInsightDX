const db = require("../../util/database");

module.exports = class consultaResultados {
  static fetchHartmanAspirante(idUsuario, idGrupo) {
    return db.execute(
      "SELECT a.idUsuario AS idUsuario, a.nombres AS nombreAspirante, a.apellidoPaterno AS apellidoPaternoAspirante, a.apellidoMaterno AS apellidoMaternoAspirante, r.* FROM aspirantes a, resultadoshartman r WHERE r.idGrupo = ? AND r.idUsuario = a.idUsuario AND a.idUsuario = ?",
      [idGrupo, idUsuario]
    );
  }

  static fetchCalificacionTerman(idUsuario, idGrupo) {
    return db.execute(
      "SELECT u.idUsuario AS idUsuario, u.nombre AS nombreAspirante, u.apellidoPaterno AS apellidoPaternoAspirante, u.apellidoMaterno AS apellidoMaternoAspirante, c.idCalificacionTerman, c.puntosTotales, c.rango, c.coeficienteIntelectual FROM usuarios u, calificacionesterman c WHERE c.idGrupo = ? AND c.idUsuario = u.idUsuario AND u.idUsuario = ?",
      [idGrupo, idUsuario]
    );
  }

  static fetchResultadosSerieTerman(
    idUsuario,
    idGrupo,
    idSerie,
    idCalificacion
  ) {
    return db.execute(
      "SELECT puntuacion, rango FROM resultadosseriesterman WHERE idUsuario = ? AND idGrupo = ? AND idSerieTerman = ? AND idCalificacionTerman = ?",
      [idUsuario, idGrupo, idSerie, idCalificacion]
    );
  }
};
