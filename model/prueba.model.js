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
      "INSERT INTO Pruebas(idPrueba, duracion, instrucciones, nombre) VALUES (?, ?, ?, ?)",
      [this.idPrueba, this.duracion, this.instrucciones, this.nombre]
    );
  }

  //Este método servirá para devolver los objetos del almacenamiento persistente.
  static fetchOne(idPrueba) {
    return db.execute("SELECT * FROM Pruebas WHERE idPrueba = ?", [idPrueba]);
  }

  static fetchOneNombre(nombre) {
    return db.execute("SELECT idPrueba FROM Pruebas WHERE nombre = ?", [
      nombre,
    ]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM Pruebas");
  }

  static pruebasPorAspirante(idUsuario) {
    return db.execute(
      "SELECT pg.idUsuario, tp.idPrueba, p.instrucciones, p.nombrePrueba FROM perteneceGrupo pg JOIN tienePruebas tp ON pg.idGrupo = tp.idGrupo JOIN pruebas p ON p.idPrueba = tp.idPrueba WHERE pg.idUsuario = ?",
      [idUsuario]
    );
  }

  static pruebasActivas(idUsuario) {
    return db.execute(
      `SELECT tp.idPrueba as idPrueba, tp.fechaLimitePrueba as fecha, pa.estatus as estatus
      FROM perteneceGrupo pg
      JOIN tienePruebas tp ON pg.idGrupo = tp.idGrupo
      JOIN pruebasAspirante pa ON pa.idPrueba = tp.idPrueba
      WHERE pg.idUsuario = ?`,
      [idUsuario]
    );
  }

  static kostickActiva(idUsuario) {
    return db.execute(
      `SELECT MAX(tiempo)
      FROM respondeKostick
      WHERE idUsuario = ?;`,
      [idUsuario]
    );
  }

  static P16PFActiva(idUsuario) {
    return db.execute(
      `SELECT MAX(tiempo)
      FROM respondeKostick
      WHERE idUsuario = ?;`,
      [idUsuario]
    );
  }
};
