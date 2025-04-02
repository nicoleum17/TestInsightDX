const db = require("../util/database");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class formatoEntrevista {
  constructor(
    mi_nombre,
    mi_apellidoP,
    mi_apellidoM,
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
    mi_estatus
  ) {
    this.idFormato = uuidv4();
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
    this.estatus = mi_estatus;
  }
  save() {
    return db
      .execute(
        "INSERT INTO formatoentrevista(idFormato, nombre, apellidoP, apellidoM, fechaNacimiento, genero, nacionalidad, edad, estadoCivil, origen, telefono, celular, correo, direccionA, codigoIdentidad, estatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          this.idFormato,
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
          "aa",
          "Empezado",
        ]
      )
      .then(([result]) => {
        return this.idFormato;
      });
  }
  
  static saveDA(
    mi_id,
    mi_nombreLicenciatura,
    mi_institucion,
    mi_promedio,
    mi_generacion,
    mi_gradoMax,
    mi_maestria,
    mi_institucionMaestria,
    mi_promedioMaestria,
    mi_cursos,
    mi_idiomas
  ){
    return db.execute(
                "UPDATE formatoEntrevista SET nombreLicenciatura=?,institucion=?, promedio=?, generacion=?, gradoMax=?, maestria=?, institucionMaestria=?,  promedioMaestria=?, cursos=?, idiomas=? WHERE idFormato=?",
                [
                  mi_nombreLicenciatura,mi_institucion,mi_promedio,mi_generacion,mi_gradoMax,mi_maestria,mi_institucionMaestria,mi_promedioMaestria,
                  mi_cursos,mi_idiomas
                ]
              )
  }
};
