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
        FROM pruebasAspirante pa
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
      FROM responde16PF
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }
};
