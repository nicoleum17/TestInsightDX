const db = require("../../util/database");

module.exports = class Prueba {
  // Ya no leera archivos, que devolvera promesa vacia
  static fetchInstrucciones() {
    return Promise.resolve([[{ instrucciones: "" }], []]);
  }

  // Obtiene los datos personales de un aspirante según el grupo y la prueba OTIS.
  static getDatosPersonalesAspiranteOtis(idGrupo, idUsuario) {
    return db.execute(
      `SELECT nombre, apellidoPaterno, apellidoMaterno, puestoSolicitado, fecha 
            FROM datospersonales 
            WHERE idUsuario = ? 
            AND idPrueba = 5
            AND idGrupo = ?`,
      [idUsuario, idGrupo]
    );
  }

  // Obtiene los datos personales de un aspirante según el grupo y la prueba OTIS.
  static getDatosPersonalesAspiranteColores(idGrupo, idUsuario) {
    return db.execute(
      `SELECT nombre, apellidoPaterno, apellidoMaterno, puestoSolicitado, fecha 
            FROM datospersonales 
            WHERE idUsuario = ? 
            AND idPrueba = 6
            AND idGrupo = ?`,
      [idUsuario, idGrupo]
    );
  }

  static async saveDatosPersonales(
    idUsuario,
    idGrupo,
    idPrueba,
    datosPersonales
  ) {
    // Intentar actualizar primero
    const [result] = await db.execute(
      `
            UPDATE datospersonales 
            SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, 
                puestoSolicitado = ?, fecha = NOW()
            WHERE idGrupo = ? AND idPrueba = ? AND idUsuario = ?
        `,
      [
        datosPersonales.nombre,
        datosPersonales.apellidoPaterno,
        datosPersonales.apellidoMaterno,
        datosPersonales.puestoSolicitado,
        idGrupo,
        idPrueba,
        idUsuario,
      ]
    );

    // Si no se actualizó ningún registro, hacer INSERT
    if (result.affectedRows === 0) {
      return db.execute(
        `
                INSERT INTO datospersonales 
                (idDatosPersonales, idGrupo, idPrueba, idUsuario, nombre, 
                apellidoPaterno, apellidoMaterno, puestoSolicitado, fecha)
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW())
            `,
        [
          idGrupo,
          idPrueba,
          idUsuario,
          datosPersonales.nombre,
          datosPersonales.apellidoPaterno,
          datosPersonales.apellidoMaterno,
          datosPersonales.puestoSolicitado,
        ]
      );
    }

    return result;
  }

  static getAreaOtis() {
    return db.execute(`SELECT * FROM areasotis`);
  }

  static getPreguntasOtis() {
    return db.execute(`SELECT * FROM preguntasotis`);
  }

  static saveRespuestas = (idUsuario, idGrupo, idPrueba, respuestas) => {
    const promesas = [];

    for (let i = 0; i < respuestas.length; i++) {
      promesas.push(
        db
          .execute(
            `INSERT INTO respuestaotisaspirante 
                    (idRespuestaOtis, idUsuario, idGrupo, idPreguntaOtis, idOpcionOtis, idPrueba, tiempoRespuesta)
                    VALUES (?, ?, ?, ?, ?)`,
            [
              idPrueba,
              idUsuario,
              idGrupo,
              respuestas.idPregunta,
              respuestas.idOpcionOtis,
              respuestas.tiempoRespuesta,
            ]
          )
          .catch((error) => {
            console.error(`Error al insertar la respuesta ${i}:`, error);
            throw error;
          })
      );
    }
    return Promise.all(promesas);
  };

  static getPreguntas16PF() {}

  static getPreguntasHartman() {}

  static getPreguntasKostick() {}

  static getPreguntasTerman() {}

  static addRespuestaOtis() {}

  static addRespuesta16PF() {}

  static addRespuestaHartman() {}

  static addRespuestaKostick() {}

  static addRespuestaTerman() {}

  static fetchColores() {
    return db.execute("SELECT * FROM colores ORDER BY numeroColor");
  }

  static saveSeleccion(idUsuario, idGrupo, idPrueba, fase, seleccion) {
    const promesas = [];

    for (let i = 0; i < seleccion.length; i++) {
      promesas.push(
        db
          .execute(
            `INSERT INTO seleccionescolores 
                    (idSeleccionColores, idPrueba, idUsuario, idGrupo, idColor, posicion, fase) 
                    VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
            [idPrueba, idUsuario, idGrupo, seleccion[i].idColor, i, fase]
          )
          .catch((error) => {
            console.error(`Error al insertar la selección ${i}:`, error);
            throw error;
          })
      );
    }
    return Promise.all(promesas);
  }

  static getGrupoPrueba(idUsuario, idPrueba) {
    return db.execute(
      `
            SELECT idGrupo 
            FROM aspirantesgrupospruebas 
            WHERE idUsuario = ? AND idPrueba = ?
        `,
      [idUsuario, idPrueba]
    );
  }

  static getEstatusPrueba(idUsuario, idGrupo, idPrueba) {
    return db.execute(
      `SELECT idEstatus 
            FROM aspirantesgrupospruebas
            WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?`,
      [idUsuario, idGrupo, idPrueba]
    );
  }

  // Actualizar estado de prueba
  static updateEstatusPrueba(idUsuario, idGrupo, idPrueba, idEstatus = 1) {
    return db.execute(
      `UPDATE pruebasaspirante
            SET idEstatus = ? 
            WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?`,
      [idEstatus, idUsuario, idGrupo, idPrueba]
    );
  }

  static verificarExistencia(idUsuario, idGrupo, idPrueba) {
    return db.execute(
      `SELECT * FROM pruebasaspirante 
            WHERE idUsuario = ? AND idGrupo = ? AND idPrueba = ?`,
      [idUsuario, idGrupo, idPrueba]
    );
  }

  static getRespuestasOtis(idUsuario, idGrupo) {
    return db.execute(
      `
                SELECT u.nombreUsuario, u.apellidoPaterno, u.apellidoMaterno, 
                ao.idAreaOtis, ao.nombreAreaOtis,
                SUM(CASE WHEN o.esCorrecta = 1 THEN 1 ELSE 0 END) 
                AS respuestasCorrectas,
                SUM(CASE WHEN o.escorrecta = 0 THEN 1 ELSE 0 END) 
                AS respuestasIncorrectas,
                SUM(CASE WHEN o.esCorrecta IS NULL THEN 1 ELSE 0 END) 
                AS sinRespuesta,

                ROUND((SUM(CASE WHEN o.esCorrecta = 1 THEN 1 ELSE 0 END) 
                * 100.0) 
                /  
                NULLIF(SUM(CASE WHEN o.esCorrecta IS NOT NULL THEN 1 ELSE 0 
                END), 0), 2) AS porcentajeCorrectas  

                FROM aspirantes a  

                JOIN usuarios u ON a.idUsuario = u.idUsuario

                JOIN gruposaspirantes ga ON a.idUsuario = ga.idUsuario 
                AND ga.idGrupo = ?

                LEFT JOIN respuestaotisaspirante ra ON 
                a.idUsuario = ra.idUsuario

                LEFT JOIN opcionesotis o ON ra.idOpcionOtis = o.idOpcionOtis

                LEFT JOIN preguntasotis p ON 
                ra.idPreguntaOtis = p.idPreguntaOtis

                LEFT JOIN areasotis ao ON p.idAreaOtis = ao.idAreaOtis

                WHERE a.idUsuario = ?

                GROUP BY u.nombreUsuario, u.apellidoPaterno, u.apellidoMaterno,
                ao.idAreaOtis, ao.nombreAreaOtis
            `,
      [idGrupo, idUsuario]
    );
  }

  static getPuntajeBrutoOtis(idUsuario, idGrupo) {
    return db.execute(
      `
                SELECT COUNT(*) as puntajeBruto
                FROM respuestaotisaspirante, opcionesotis
                WHERE idUsuario = ?
                AND idGrupo = ?
                AND opcionesotis.idOpcionOtis = 
                respuestaotisaspirante.idOpcionOtis
                AND opcionesotis.esCorrecta = 1
                GROUP BY idUsuario
            `,
      [idUsuario, idGrupo]
    );
  }

  static getRespuestasColores(idUsuario, idGrupo) {
    return db.execute(
      `
            SELECT fase, idColor, posicion
            FROM seleccionescolores
            WHERE idUsuario = ? AND idGrupo = ?
            ORDER BY fase, posicion
        `,
      [idUsuario, idGrupo]
    );
  }

  static getSeleccionesColores(idGrupo, idUsuario) {
    return db.execute(
      `
            SELECT 
                SC.idSeleccionColores, 
                SC.idColor, 
                SC.posicion, 
                SC.fase,
                C.nombreColor, 
                C.numeroColor, 
                C.hexColor  
            FROM seleccionescolores SC
            JOIN colores C ON SC.idColor = C.idColor
            WHERE SC.idUsuario = ?
            AND SC.idGrupo = ?
            AND SC.idPrueba = 6
            ORDER BY SC.fase, SC.posicion
            `,
      [idUsuario, idGrupo]
    );
  }

  // Nombre aspirante analisis colores
  static getInformacionAspirante(idUsuario) {
    return db.execute(
      `
            SELECT a.nombres, a.apellidoPaterno, a.apellidoMaterno
            FROM aspirantes a
            WHERE a.idUsuario = ?
        `,
      [idUsuario]
    );
  }
};
