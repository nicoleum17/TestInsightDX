const db = require("../util/database");

module.exports = class Grupo {
  //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
  constructor(mi_idGrupo, mi_posgrado, mi_generacion) {
    this.idGrupo = mi_idGrupo;
    this.posgrado = mi_posgrado;
    this.generacion = mi_generacion;
  }

  //Este método servirá para guardar de manera persistente el nuevo objeto.
  save() {
    return db.execute(
      "INSERT INTO Grupos (idGrupo, posgrado, generacion) VALUES (?, ?, ?)",
      [this.idGrupo, this.posgrado, this.generacion]
    );
  }

  //Este método servirá para devolver los objetos del almacenamiento persistente.
  static fetchOne(nombrePrueba) {
    return db.execute("SELECT * FROM Grupos WHERE posgrado = ?", [posgrado]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM Grupos");
  }
};
