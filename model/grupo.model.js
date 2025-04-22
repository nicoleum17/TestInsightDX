const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");

module.exports = class Grupo {
  constructor(
    mi_institucion,
    mi_posgrado,
    mi_generacion,
    mi_fechaPruebaGrupal,
    mi_enlaceZoom
  ) {
    this.idGrupo = uuidv4();
    this.institucion = mi_institucion;
    this.posgrado = mi_posgrado;
    this.generacion = mi_generacion;
    this.fechaPruebaGrupal = mi_fechaPruebaGrupal;
    this.enlaceZoom = mi_enlaceZoom;
    this.hidden = 0;
  }

  save() {
    return db.execute(
      "INSERT INTO grupos (idGrupo, institucion, posgrado, generacion, fechaPruebaGrupal, enlaceZoom, hidden) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        this.idGrupo,
        this.institucion,
        this.posgrado,
        this.generacion,
        this.fechaPruebaGrupal,
        this.enlaceZoom,
        this.hidden,
      ]
    );
  }

  //Este método servirá para devolver los objetos del almacenamiento persistente.
  static fetchOneId(idGrupo) {
    return db.execute("SELECT * FROM grupos WHERE idGrupo = ?", [idGrupo]);
  }

  static fetchOneNombre(posgrado, generacion) {
    return db.execute(
      "SELECT idGrupo FROM grupos WHERE posgrado = ? AND generacion = ?",
      [posgrado, generacion]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM grupos WHERE hidden = 0");
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

  /* query para modificar la información del grupo */
  static updateGrupo(
    institucion,
    posgrado,
    generacion,
    fechaPruebaGrupal,
    enlaceZoom,
    idGrupo
  ) {
    return db.execute(
      "UPDATE grupos SET institucion = ?, posgrado = ?, generacion = ?, fechaPruebaGrupal = ?, enlaceZoom = ? WHERE idGrupo = ?",
      [
        institucion,
        posgrado,
        generacion,
        fechaPruebaGrupal,
        enlaceZoom,
        idGrupo,
      ]
    );
  }

  static borrarGrupo(idGrupo) {
    return db.execute("UPDATE `grupos` SET `hidden` = ? WHERE `idGrupo` = ?", [
      1,
      idGrupo,
    ]);
  }
};
