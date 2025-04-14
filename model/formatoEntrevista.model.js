const db = require("../util/database.js");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class formatoEntrevista {
  constructor(
    mi_apellidoP,
    mi_apellidoM,
    mi_nombre,
    mi_fechaNacimiento,
    mi_genero,
    mi_edad,
    mi_nacionalidad,
    mi_origen,
    mi_estadoCivil,
    mi_direccionA,
    mi_celular,
    mi_telefono,
    mi_correo,
    mi_idFormato
  ) {
    this.nombre = mi_nombre;
    this.apellidoP = mi_apellidoP;
    this.apellidoM = mi_apellidoM;
    this.fechaNacimiento = mi_fechaNacimiento;
    this.genero = mi_genero;
    this.edad = mi_edad;
    this.nacionalidad = mi_nacionalidad;
    this.origen = mi_origen;
    this.estadoCivil = mi_estadoCivil;
    this.direccionA = mi_direccionA;
    this.celular = mi_celular;
    this.telefono = mi_telefono;
    this.correo = mi_correo;
    this.idFormato = mi_idFormato;
    this.estatus = "Empezado";
  }
  static getID(idUsuario) {
    return db.execute(
      "SELECT idFormato FROM formatoentrevista WHERE idUsuario = ?",
      [idUsuario]
    );
  }
  save() {
    return db
      .execute(
        "UPDATE formatoentrevista SET nombre = ?, apellidoP = ?, apellidoM = ?, fechaNacimiento = ?, " +
          "genero = ?, nacionalidad = ?, edad = ?, estadoCivil = ?, origen = ?, telefono = ?, celular = ?, " +
          "correo = ?, direccionA = ?, estatus = ? WHERE idFormato = ?",
        [
          this.nombre,
          this.apellidoP,
          this.apellidoM,
          this.fechaNacimiento,
          this.genero,
          this.nacionalidad,
          this.edad,
          this.estadoCivil,
          this.origen,
          this.telefono,
          this.celular,
          this.correo,
          this.direccionA,
          this.estatus,
          this.idFormato,
        ]
      )
      .then(([result]) => {
        return this.idFormato;
      });
  }

  static saveDA(
    mi_nombreLicenciatura,
    mi_institucion,
    mi_promedio,
    mi_generacion,
    mi_gradoMax,
    mi_maestria,
    mi_institucionMaestria,
    mi_promedioMaestria,
    mi_cursos,
    mi_idiomas,
    mi_id
  ) {
    return db
      .execute(
        "UPDATE formatoentrevista SET nombreLicenciatura=?,institucion=?, promedio=?, generacion=?, gradoMax=?, maestria=?, institucionMaestria=?,  promedioMaestria=?, cursos=?, idiomas=? WHERE idFormato=?",
        [
          mi_nombreLicenciatura,
          mi_institucion,
          mi_promedio,
          mi_generacion,
          mi_gradoMax,
          mi_maestria,
          mi_institucionMaestria,
          mi_promedioMaestria,
          mi_cursos,
          mi_idiomas,
          mi_id,
        ]
      )
      .then(([result]) => {
        return mi_id;
      });
  }

  static saveDL(
    mi_lugarTrabajo,
    mi_empresa,
    mi_puesto,
    mi_años,
    mi_actividades,
    mi_sueldo,
    mi_personal,
    mi_idFormato
  ) {
    return db
      .execute(
        "UPDATE formatoentrevista SET lugarTrabajo=?, empresa=?, puesto=?, años=?, actividades=?, sueldo=?, personal=? WHERE idFormato=?",
        [
          mi_lugarTrabajo,
          mi_empresa,
          mi_puesto,
          mi_años,
          mi_actividades,
          mi_sueldo,
          mi_personal,
          mi_idFormato,
        ]
      )
      .then(([result]) => {
        return mi_idFormato;
      });
  }

  static finish(mi_idFormato) {
    return db
      .execute("UPDATE formatoentrevista SET estatus=? WHERE idFormato=?", [
        "Finalizado",
        mi_idFormato,
      ])
      .then(([result]) => {
        return mi_idFormato;
      });
  }

  static formato_activo(idUsuario) {
    return db.execute(
      `SELECT estatus, idFormato
      FROM formatoentrevista
      WHERE idUsuario = ?`,
      [idUsuario]
    );
  }
};
