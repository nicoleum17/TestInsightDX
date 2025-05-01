const db = require("../util/database.js");

module.exports = class Prueba {
  //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
  constructor(mi_idPrueba, mi_duracion, mis_instrucciones, mi_nombre) {
    this.idPrueba = mi_idPrueba;
    this.duracion = mi_duracion;
    this.instrucciones = mis_instrucciones;
    this.nombre = mi_nombre;
  }

  //Este método servirá para guardar de manera persistente el nuevo objeto.
  save() {
    return db.execute(
      "INSERT INTO pruebas(idPrueba, duracion, instrucciones, nombre) VALUES (?, ?, ?, ?)",
      [this.idPrueba, this.duracion, this.instrucciones, this.nombre]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM pruebas");
  }

  //Este método servirá para devolver los objetos del almacenamiento persistente.
  static fetchOne(idPrueba) {
    return db.execute("SELECT * FROM pruebas WHERE idPrueba = ?", [idPrueba]);
  }

  static fetchOneNombre(nombre) {
    return db.execute("SELECT idPrueba FROM pruebas WHERE nombre = ?", [
      nombre,
    ]);
  }

  static pruebasPorAspirante(idUsuario) {
    return db.execute(
      "SELECT pg.idUsuario, tp.idPrueba, p.instrucciones, p.nombre FROM pertenecegrupo pg JOIN tienepruebas tp ON pg.idGrupo = tp.idGrupo JOIN pruebas p ON p.idPrueba = tp.idPrueba WHERE pg.idUsuario = ?",
      [idUsuario]
    );
  }

  static pruebasActivas(idUsuario) {
    return db.execute(
      `SELECT pa.idPrueba as idPrueba, DATE_FORMAT(fechaLimitePrueba, '%Y-%m-%d %H:%i:%s') as fecha, pa.estatus as estatus
        FROM pruebasaspirante pa
        JOIN tienepruebas tp ON pa.idGrupo = tp.idGrupo AND pa.idPrueba = tp.idPrueba
        WHERE pa.idUsuario = ?`,
      [idUsuario]
    );
  }

  static kostickActiva(idUsuario) {
    return db.execute(
      `SELECT SEC_TO_TIME(FLOOR(MAX(tiempo))) as tiempo
      FROM respondekostick
      WHERE idUsuario = ?;`,
      [idUsuario]
    );
  }

  static P16PFActiva(idUsuario) {
    return db.execute(
      `SELECT SEC_TO_TIME(FLOOR(MAX(tiempo))) as tiempo
      FROM responde16pf
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }

  static hartmanActiva(idUsuario){
    return db.execute(
      `SELECT SEC_TO_TIME(SUM(tiempoRespuesta)) as tiempo
      FROM respuestashartman
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }

  static termanActiva(idUsuario){
    return db.execute(
      `SELECT SEC_TO_TIME(SUM(tiempoRespuesta)) as tiempo
      FROM respuestashartman
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }

  static otisActiva(idUsuario){
    return db.execute(
      `SELECT SEC_TO_TIME(SUM(tiempoRespuesta)) as tiempo
      FROM respuestaotisaspirante
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }

  //Otras Pruebas

  //~ OTIS

  static getAreaOtis() {
    return db.execute(`SELECT * FROM areasotis`);
  }

  static getPreguntasOtis() {
    return db.execute(`SELECT * FROM preguntasotis`);
  }

  static getRespuestasOtis(idUsuario, idGrupo) {
    return db.execute(
      `
                  SELECT a.nombres, a.apellidoPaterno, a.apellidoMaterno, 
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

                  JOIN perteneceGrupo ga ON a.idUsuario = ga.idUsuario 
                  AND ga.idGrupo = ?

                  LEFT JOIN respuestaotisaspirante ra ON 
                  a.idUsuario = ra.idUsuario

                  LEFT JOIN opcionesotis o ON ra.idOpcionOtis = o.idOpcionOtis

                  LEFT JOIN preguntasotis p ON 
                  ra.idPreguntaOtis = p.idPreguntaOtis

                  LEFT JOIN areasotis ao ON p.idAreaOtis = ao.idAreaOtis

                  WHERE a.idUsuario = ?

                  GROUP BY a.nombres, a.apellidoPaterno, a.apellidoMaterno,
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
                  GROUP BY idUsuario;
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
};
