const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");

module.exports = class Grupo {
  //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
  constructor(mi_posgrado, mi_generacion, mi_fechaPruebaGrupal, mi_enlaceZoom) {
    this.idGrupo = uuidv4();
    this.posgrado = mi_posgrado;
    this.generacion = mi_generacion;
    this.fechaPruebaGrupal = mi_fechaPruebaGrupal;
    this.enlaceZoom = mi_enlaceZoom;
  }

  //Este método servirá para guardar de manera persistente el nuevo objeto.
  save() {
    return db.execute(
      "INSERT INTO Grupos (idGrupo, posgrado, generacion, fechaPruebaGrupal, enlaceZoom) VALUES (?, ?, ?, ?, ?)",
      [
        this.idGrupo,
        this.posgrado,
        this.generacion,
        this.fechaPruebaGrupal,
        this.enlaceZoom,
      ]
    );
  }

  //Este método servirá para devolver los objetos del almacenamiento persistente.
  static fetchOneId(idGrupo) {
    return db.execute("SELECT * FROM Grupos WHERE idGrupo = ?", [idGrupo]);
  }

  static fetchOneNombre(posgrado, generacion) {
    return db.execute(
      "SELECT idGrupo FROM Grupos WHERE posgrado = ? AND generacion = ?",
      [posgrado, generacion]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM Grupos");
  }

  static update_subirReporte(idGrupo, archivoPdf) {
    return db.execute(
      "UPDATE `grupos` SET `archivoPdf` = ? WHERE `idGrupo` = ?",
      [archivoPdf, idGrupo]
    );
  }

  static update_subirFoda(idGrupo, archivoFoda) {
    return db.execute(
      "UPDATE `grupos` SET `archivoFoda` = ? WHERE `idGrupo` = ?",
      [archivoFoda, idGrupo]
    );
  }

  static borrarGrupo(idGrupo) {
    return db.execute(
      "UPDATE `grupos` SET `hidden` = ? WHERE `idGrupo` = ?",
      [1,idGrupo]
    );
  }
};
