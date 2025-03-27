const db = require("../util/database");

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

  static fetchAll() {
    return db.execute("SELECT * FROM Pruebas");
  }
};
