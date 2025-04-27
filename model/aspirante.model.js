const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = class Aspirante {
  constructor(
    mi_codigoIdentidad,
    mi_nombres,
    mi_apellidoPaterno,
    mi_apellidoMaterno,
    mi_numTelefono,
    mi_lugarOrigen,
    mi_correo,
    mi_universidadOrigen
  ) {
    this.codigoIdentidad = mi_codigoIdentidad;
    this.idUsuario = uuidv4();
    this.nombres = mi_nombres;
    this.apellidoPaterno = mi_apellidoPaterno;
    this.apellidoMaterno = mi_apellidoMaterno;
    this.numTelefono = mi_numTelefono;
    this.lugarOrigen = mi_lugarOrigen;
    this.correo = mi_correo;
    this.universidadOrigen = mi_universidadOrigen;
  }
  save() {
    return db.execute(
      "INSERT INTO aspirantes (codigoIdentidad, idUsuario, nombres, apellidoPaterno, apellidoMaterno, numTelefono, lugarOrigen, correo, universidadOrigen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        this.codigoIdentidad,
        this.idUsuario,
        this.nombres,
        this.apellidoPaterno,
        this.apellidoMaterno,
        this.numTelefono,
        this.lugarOrigen,
        this.correo,
        this.universidadOrigen,
      ]
    );
  }

  /* query para modificar la información del aspirante */
  static updateAspirante(
    codigoIdentidad,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    numTelefono,
    lugarOrigen,
    correo,
    universidadOrigen,
    idUsuario
  ) {
    return db
      .execute(
        "UPDATE aspirantes SET codigoIdentidad = ?, nombres = ?, apellidoPaterno = ?, apellidoMaterno = ?, numTelefono = ?, lugarOrigen = ?, correo = ?, universidadOrigen = ? WHERE idUsuario = ?",
        [
          codigoIdentidad,
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          numTelefono,
          lugarOrigen,
          correo,
          universidadOrigen,
          idUsuario,
        ]
      )
      .then(([result]) => {
        return idUsuario;
      });
  }

  static saveSexo(idUsuario, sexo) {
    return db
      .execute("UPDATE aspirantes SET sexo = ? WHERE idUsuario = ?", [
        sexo,
        idUsuario,
      ])
      .then(([result]) => {
        return idUsuario;
      });
  }

  static fetchAll() {
    return db.execute("SELECT * FROM aspirantes WHERE hidden = 0");
  }

  static fetchOne(idUsuario) {
    return db.execute("SELECT * FROM aspirantes WHERE idUsuario = ?", [
      idUsuario,
    ]);
  }

  static fetchByCI(codigoIdentidad) {
    return db.execute(
      "SELECT idUsuario FROM aspirantes WHERE codigoIdentidad = ?",
      [codigoIdentidad]
    );
  }

  static find(valor) {
    return db.execute(
      `SELECT *
        FROM aspirantes a WHERE hidden = 0`
    );
  }

  static update_subirKardex(idUsuario, kardex) {
    return db.execute(
      "UPDATE `pertenecegrupo` SET `kardex` = ? WHERE `idUsuario` = ?",
      [kardex, idUsuario]
    );
  }

  static update_subirCV(idUsuario, CV) {
    return db.execute(
      "UPDATE `pertenecegrupo` SET `curriculumVitae` = ? WHERE `idUsuario` = ?",
      [CV, idUsuario]
    );
  }

  static documentos_activos(idUsuario) {
    return db.execute(
      `SELECT kardex, curriculumVitae
      FROM pertenecegrupo
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }

  static update_subirReporte(idUsuario, reporte) {
    return db.execute(
      "UPDATE `pertenecegrupo` SET `reporte` = ? WHERE `idUsuario` = ?",
      [reporte, idUsuario]
    );
  }

  static notificacion(idUsuario) {
    return db.execute(
      `SELECT g.fechaPruebaGrupal as pruebaGrupal, pg.fechaZoomIndividual as zoomIndividual, tp.fechaLimitePrueba as limitePrueba
    FROM perteneceGrupo pg
    JOIN grupos g ON g.idGrupo = pg.idGrupo
    JOIN tienePruebas tp ON g.idGrupo = tp.idGrupo
    WHERE pg.idUsuario = ?`,
      [idUsuario]
    );
  }

  static async borrarAspirante(idAspirante) {
    await db.execute(
      "UPDATE `aspirantes` SET `hidden` = ? WHERE `idUsuario` = ?;",
      [1, idAspirante]
    );
    return db.execute(
      "UPDATE `usuarios` SET `hidden` = ? WHERE `idUsuario` = ?",
      [1, idAspirante]
    );
  }
};
