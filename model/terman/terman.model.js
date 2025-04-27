const db = require("../../util/database");

class terman {
  async fetchSerieInfoById(idSerie) {
    const [info] = await db.execute(
      "SELECT * FROM seriesterman WHERE idSerieTerman = ?",
      [idSerie]
    );
    return info;
  }

  async fetchPreguntaSerieById(idSerie) {
    const [preguntas] = await db.execute(
      "SELECT idPreguntaTerman, numeroPregunta, preguntaTerman FROM preguntasterman WHERE idSerieTerman = ?",
      [idSerie]
    );
    return preguntas;
  }

  async fetchOpcionesSerieById(idSerie) {
    const [opciones] = await db.execute(
      "SELECT idPreguntaTerman, opcionTerman, descripcionTerman FROM opcionesterman WHERE idPreguntaTerman IN (SELECT idPreguntaTerman FROM preguntasTerman WHERE idSerieTerman = ?)",
      [idSerie]
    );
    return opciones;
  }

  async fetchOpcionesCorrectasById(idSerie) {
    const [opcionesCorrectas] = await db.execute(
      "SELECT OT.idPreguntaTerman, OT.opcionTerman, OT.descripcionTerman ,OT.esCorrecta FROM opcionesterman AS OT WHERE OT.esCorrecta = 1 AND OT.idPreguntaTerman IN (SELECT PT.idPreguntaTerman FROM preguntasterman AS PT WHERE PT.idSerieTerman = ?)",
      [idSerie]
    );
    return opcionesCorrectas;
  }
}

module.exports = terman;
