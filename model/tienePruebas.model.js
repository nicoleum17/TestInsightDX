const db = require("../util/database");

module.exports = class TienePruebas {
  constructor(
    mi_idGrupo,
    mi_idPrueba,
    mi_fechaLimitePrueba,
    mi_fechaPruebaGrupal,
    mi_enlaceZoom
  ) {
    this.idGrupo = mi_idGrupo;
    this.idPrueba = mi_idPrueba;
    this.fechaLimitePrueba = mi_fechaLimitePrueba;
    this.fechaPruebaGrupal = mi_fechaPruebaGrupal;
    this.enlaceZoom = mi_enlaceZoom;
  }

  //Este método servirá para guardar de manera persistente el nuevo objeto.
  save() {
    return db.execute(
      "INSERT INTO tienePruebas (id_grupo, id_prueba, fecha_limite_prueba, fecha_prueba_grupal, enlace_zoom) VALUES (?, ?, ?, ?, ?)",
      [
        this.idGrupo,
        this.idPrueba,
        this.fechaLimitePrueba,
        this.fechaLimitePrueba,
        this.enlaceZoom,
      ]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM tienePruebas");
  }
};
