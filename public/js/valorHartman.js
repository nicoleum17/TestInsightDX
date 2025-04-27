// valorHartman.js

/**
 * Función para calcular los resultados del análisis de Hartman.
 *
 * @param {Array<number>} arregloFrase - El arreglo de respuestas de frase del usuario.
 * @param {Array<number>} arregloCita - El arreglo de respuestas de cita del usuario.
 * @returns {object} Un objeto que contiene todos los resultados del análisis.
 */
const calcularResultados = (arregloFrase, arregloCita) => {
  // Definir los arreglos iniciales (ESTOS SON ESTÁTICOS)
  const valorHartman = [
    6, 9, 10, 11, 13, 5, 17, 16, 12, 4, 1, 18, 2, 14, 8, 15, 3, 7,
  ];

  // Función interna para procesar un arreglo (ya sea frase o cita)
  const procesarArreglo = (arreglo) => {
    return arreglo.map((num, index) => {
      const hartman = valorHartman[index];
      const esUnDigitoHartman = hartman < 10;
      const dosDigitosHartman = hartman >= 10;

      let diferencia = 0; // Valor por defecto

      if (esUnDigitoHartman) {
        diferencia = hartman - num;
      } else if (dosDigitosHartman) {
        diferencia = num - hartman;
      }

      const tipoDiferencia = diferencia > 0 ? "POSITIVA (+)" : "NEGATIVA (-)";

      return { num, hartman, diferencia, tipoDiferencia };
    });
  };

  const resultadosFrase = procesarArreglo(arregloFrase);
  const resultadosCita = procesarArreglo(arregloCita);

  const calcularEstadisticas = (resultados, tipo) => {
    const diferenciaAbsolutaMenosDos = resultados.map((resultado) => ({
      ...resultado,
      diferenciaAbsolutaMenosDos: Math.max(
        0,
        Math.abs(resultado.diferencia) - 2
      ),
    }));

    const agrupadosPorLetras = {
      I: diferenciaAbsolutaMenosDos.filter((r) =>
        [5, 4, 1, 18, 14, 15].includes(r.hartman)
      ),
      E: diferenciaAbsolutaMenosDos.filter((r) =>
        [6, 11, 13, 17, 2, 8].includes(r.hartman)
      ),
      S: diferenciaAbsolutaMenosDos.filter((r) =>
        [9, 10, 16, 12, 3, 7].includes(r.hartman)
      ),
    };

    const sumaTotalesDim = {
      "DIM-I": agrupadosPorLetras.I.reduce(
        (acc, r) => acc + Math.abs(r.diferencia),
        0
      ),
      "DIM-E": agrupadosPorLetras.E.reduce(
        (acc, r) => acc + Math.abs(r.diferencia),
        0
      ),
      "DIM-S": agrupadosPorLetras.S.reduce(
        (acc, r) => acc + Math.abs(r.diferencia),
        0
      ),
    };

    const sumaTotalesInt = {
      "INT-I": agrupadosPorLetras.I.reduce(
        (acc, r) => acc + r.diferenciaAbsolutaMenosDos,
        0
      ),
      "INT-E": agrupadosPorLetras.E.reduce(
        (acc, r) => acc + r.diferenciaAbsolutaMenosDos,
        0
      ),
      "INT-S": agrupadosPorLetras.S.reduce(
        (acc, r) => acc + r.diferenciaAbsolutaMenosDos,
        0
      ),
    };

    const dif = Object.values(sumaTotalesDim).reduce(
      (acc, dim) => acc + dim,
      0
    );

    const dimConMayorPuntaje = Object.entries(sumaTotalesDim).sort(
      ([, a], [, b]) => b - a
    )[0][0];
    const mayorPuntaje = sumaTotalesDim[dimConMayorPuntaje];

    const intConMayorPuntaje = Object.entries(sumaTotalesInt).sort(
      ([, a], [, b]) => b - a
    )[0][0];
    const mayorPuntajes = sumaTotalesInt[intConMayorPuntaje];

    const dimGeneral = Object.entries(sumaTotalesDim)
      .filter(([letra]) => letra !== dimConMayorPuntaje)
      .reduce((acc, [, puntaje]) => acc + (mayorPuntaje - puntaje), 0);

    const intGeneral = Object.values(sumaTotalesInt).reduce(
      (acc, dim) => acc + dim,
      0
    );

    const di = Object.entries(sumaTotalesInt)
      .filter(([letra]) => letra !== intConMayorPuntaje)
      .reduce((acc, [, puntaje]) => acc + (mayorPuntajes - puntaje), 0);

    const dimPorcentaje = dif ? Math.round((dimGeneral / dif) * 100) : 0;
    const intPorcentaje = dif ? Math.round((intGeneral / dif) * 100) : 0;

    const dis = resultados.reduce(
      (contador, r) =>
        contador + (String(r.hartman).length !== String(r.num).length),
      0
    );

    const sumaPorGrupo = Object.fromEntries(
      Object.entries(agrupadosPorLetras).map(([letra, valores]) => [
        letra,
        {
          sumaPositivas: valores.reduce(
            (acc, r) => acc + (r.diferencia > 0 ? r.diferencia : 0),
            0
          ),
          sumaNegativas: valores.reduce(
            (acc, r) => acc + (r.diferencia < 0 ? r.diferencia : 0),
            0
          ),
        },
      ])
    );

    const totalSumaPositivas = Object.values(sumaPorGrupo).reduce(
      (acc, grupo) => acc + grupo.sumaPositivas,
      0
    );
    const totalSumaNegativas = Object.values(sumaPorGrupo).reduce(
      (acc, grupo) => acc + grupo.sumaNegativas,
      0
    );
    const mayorValorNumerico = Math.max(
      Math.abs(totalSumaPositivas),
      Math.abs(totalSumaNegativas)
    );
    const aiPorcentaje = dif ? Math.floor((mayorValorNumerico / dif) * 100) : 0;

    return {
      [`${tipo}DimI`]: [sumaTotalesDim["DIM-I"]] || 0,
      [`${tipo}DimE`]: [sumaTotalesDim["DIM-E"]] || 0,
      [`${tipo}DimS`]: [sumaTotalesDim["DIM-S"]] || 0,
      [`${tipo}Dif`]: [dif] || 0,
      [`${tipo}DimGeneral`]: [dimGeneral] || 0,
      [`${tipo}DimPorcentaje`]: [dimPorcentaje] || 0,
      [`${tipo}IntI`]: [sumaTotalesInt["INT-I"]] || 0,
      [`${tipo}IntE`]: [sumaTotalesInt["INT-E"]] || 0,
      [`${tipo}IntS`]: [sumaTotalesInt["INT-S"]] || 0,
      [`${tipo}IntGeneral`]: [intGeneral] || 0,
      [`${tipo}IntPorcentaje`]: [intPorcentaje] || 0,
      [`${tipo}Di`]: [di] || 0,
      [`${tipo}Dis`]: [dis] || 0,
      [`${tipo}AiPorcentaje`]: [aiPorcentaje] || 0,
    };
  };

  const resultadosFinalesFrase = calcularEstadisticas(resultadosFrase, "Frase");
  const resultadosFinalesCita = calcularEstadisticas(resultadosCita, "Cita");

  // Calcular SQ y VQ
  const sq_1 =
    resultadosFinalesCita.CitaDif[0] +
    resultadosFinalesCita.CitaDimGeneral[0] +
    resultadosFinalesCita.CitaIntGeneral[0] +
    resultadosFinalesCita.CitaDis[0];
  const sq_2 = sq_1 - resultadosFinalesCita.CitaDif[0];
  const potencialCita =
    resultadosFinalesCita.CitaIntGeneral[0] / resultadosFinalesCita.CitaDif[0]; // You might want to handle division by zero here

  const vq_1 =
    resultadosFinalesFrase.FraseDif[0] +
    resultadosFinalesFrase.FraseDimGeneral[0] +
    resultadosFinalesFrase.FraseIntGeneral[0] +
    resultadosFinalesFrase.FraseDis[0];
  const vq_2 = vq_1 - resultadosFinalesFrase.FraseDif[0];
  const potencialFrase =
    resultadosFinalesFrase.FraseIntGeneral[0] /
    resultadosFinalesFrase.FraseDif[0]; // And here

  // Calcular BR y QR
  const BQr1 = vq_1 !== 0 ? parseFloat((sq_1 / vq_1).toFixed(1)) || 0 : 0; // Handle division by zero
  const BQa1 = Math.round((sq_1 + vq_1) / 2) || 0;
  const BQr2 = vq_2 !== 0 ? parseFloat((sq_2 / vq_2).toFixed(1)) || 0 : 0; // Handle division by zero
  const BQa2 = Math.round((sq_2 + vq_2) / 2) || 0;

  const CQ1 = parseFloat((BQr1 * BQa1).toFixed(1)) || 0;
  const CQ2 = parseFloat((BQr2 * BQa2).toFixed(1)) || 0;

  return {
    ...resultadosFinalesFrase,
    ...resultadosFinalesCita,
    BQr1,
    BQa1,
    BQr2,
    BQa2,
    CQ1,
    CQ2,
    sq_1,
    sq_2,
    vq_1,
    vq_2,
  };
};

// Exportar utilizando la sintaxis de CommonJS
module.exports = {
  calcularResultados,
};
