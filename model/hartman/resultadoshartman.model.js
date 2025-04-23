// src/models/pruebas/hartman/hartmanAnalysis.model.js
const db = require("../../util/database.js");

class hartmanAnalysisModel {
  constructor(idAspirante, idGrupo, resultadosAnalisis) {
    this.idAspirante = idAspirante;
    this.idGrupo = idGrupo;
    this.resultadosAnalisis = resultadosAnalisis;
  }

  /*
   * Una vez realizado el análisis de hartman
   * Lo almacenamos en la base de datos
   */

  async save() {
    try {
      const query = `
        INSERT INTO resultadoshartman (
        idAspirante, idGrupo, fraseDimI, fraseDimE, fraseDimS, fraseDif, fraseDimGeneral,
        fraseDimPorcentaje, fraseIntI, fraseIntE, fraseIntS, fraseIntGeneral, fraseIntPorcentaje,
        \`fraseDi\`, fraseDIS, fraseAiPorcentaje ,fraseVQ1, fraseVQ2, citaDimI, citaDimE, citaDimS, citaDif,
        citaDimGeneral, citaDimPorcentaje, citaIntI, citaIntE, citaIntS, citaIntGeneral,
        citaIntPorcentaje, \`citaDi\`, citaDIS, citaAiPorcentaje,citaSQ1, citaSQ2, BQr1, BQa1, BQr2, BQa2,
        CQ1, CQ2
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
        `;

      const values = [
        this.idAspirante,
        this.idGrupo,
        this.resultadosAnalisis.FraseDimI
          ? this.resultadosAnalisis.FraseDimI[0]
          : 0,
        this.resultadosAnalisis.FraseDimE
          ? this.resultadosAnalisis.FraseDimE[0]
          : 0,
        this.resultadosAnalisis.FraseDimS
          ? this.resultadosAnalisis.FraseDimS[0]
          : 0,
        this.resultadosAnalisis.FraseDif
          ? this.resultadosAnalisis.FraseDif[0]
          : 0,
        this.resultadosAnalisis.FraseDimGeneral
          ? this.resultadosAnalisis.FraseDimGeneral[0]
          : 0,
        this.resultadosAnalisis.FraseDimPorcentaje
          ? this.resultadosAnalisis.FraseDimPorcentaje[0]
          : 0,
        this.resultadosAnalisis.FraseIntI
          ? this.resultadosAnalisis.FraseIntI[0]
          : 0,
        this.resultadosAnalisis.FraseIntE
          ? this.resultadosAnalisis.FraseIntE[0]
          : 0,
        this.resultadosAnalisis.FraseIntS
          ? this.resultadosAnalisis.FraseIntS[0]
          : 0,
        this.resultadosAnalisis.FraseIntGeneral
          ? this.resultadosAnalisis.FraseIntGeneral[0]
          : 0,
        this.resultadosAnalisis.FraseIntPorcentaje
          ? this.resultadosAnalisis.FraseIntPorcentaje[0]
          : 0,
        this.resultadosAnalisis.FraseDi
          ? this.resultadosAnalisis.FraseDi[0]
          : 0,
        this.resultadosAnalisis.FraseDis
          ? this.resultadosAnalisis.FraseDis[0]
          : 0,
        this.resultadosAnalisis.FraseAiPorcentaje
          ? this.resultadosAnalisis.FraseAiPorcentaje[0]
          : 0,
        this.resultadosAnalisis.vq_1 ? this.resultadosAnalisis.vq_1 : 0,
        this.resultadosAnalisis.vq_2 ? this.resultadosAnalisis.vq_2 : 0,
        this.resultadosAnalisis.CitaDimI
          ? this.resultadosAnalisis.CitaDimI[0]
          : 0,
        this.resultadosAnalisis.CitaDimE
          ? this.resultadosAnalisis.CitaDimE[0]
          : 0,
        this.resultadosAnalisis.CitaDimS
          ? this.resultadosAnalisis.CitaDimS[0]
          : 0,
        this.resultadosAnalisis.CitaDif
          ? this.resultadosAnalisis.CitaDif[0]
          : 0,
        this.resultadosAnalisis.CitaDimGeneral
          ? this.resultadosAnalisis.CitaDimGeneral[0]
          : 0,
        this.resultadosAnalisis.CitaDimPorcentaje
          ? this.resultadosAnalisis.CitaDimPorcentaje[0]
          : 0,
        this.resultadosAnalisis.CitaIntI
          ? this.resultadosAnalisis.CitaIntI[0]
          : 0,
        this.resultadosAnalisis.CitaIntE
          ? this.resultadosAnalisis.CitaIntE[0]
          : 0,
        this.resultadosAnalisis.CitaIntS
          ? this.resultadosAnalisis.CitaIntS[0]
          : 0,
        this.resultadosAnalisis.CitaIntGeneral
          ? this.resultadosAnalisis.CitaIntGeneral[0]
          : 0,
        this.resultadosAnalisis.CitaIntPorcentaje
          ? this.resultadosAnalisis.CitaIntPorcentaje[0]
          : 0,
        this.resultadosAnalisis.CitaDi ? this.resultadosAnalisis.CitaDi[0] : 0,
        this.resultadosAnalisis.CitaDis
          ? this.resultadosAnalisis.CitaDis[0]
          : 0,
        this.resultadosAnalisis.CitaAiPorcentaje
          ? this.resultadosAnalisis.CitaAiPorcentaje[0]
          : 0,
        this.resultadosAnalisis.sq_1 ? this.resultadosAnalisis.sq_1 : 0,
        this.resultadosAnalisis.sq_2 ? this.resultadosAnalisis.sq_2 : 0,
        this.resultadosAnalisis.BQr1 ? this.resultadosAnalisis.BQr1 : 0,
        this.resultadosAnalisis.BQa1 ? this.resultadosAnalisis.BQa1 : 0,
        this.resultadosAnalisis.BQr2 ? this.resultadosAnalisis.BQr2 : 0,
        this.resultadosAnalisis.BQa2 ? this.resultadosAnalisis.BQa2 : 0,
        this.resultadosAnalisis.CQ1 ? this.resultadosAnalisis.CQ1 : 0,
        this.resultadosAnalisis.CQ2 ? this.resultadosAnalisis.CQ2 : 0,
      ];

      await db.execute(query, values);
    } catch (error) {
      console.error("Error al guardar el análisis de Hartman:", error);
      throw error;
    }
  }
}

module.exports = hartmanAnalysisModel;
