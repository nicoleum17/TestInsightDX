const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class formatoEntrevistaDA{
    constructor(
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
       this.idFormato=mi_id;
       this.nombreLicenciatura=mi_nombreLicenciatura;
       this.institucion=mi_institucion;
       this.promedio=mi_promedio;
       this.generacion=mi_generacion;
       this.gradoMax=mi_gradoMax;
       this.maestria=mi_maestria;
       this.institucionMaestria=mi_institucionMaestria;
       this.promedioMaestria=mi_promedioMaestria;
       this.cursos=mi_cursos;
       this.idiomas=mi_idiomas;
    }

    save(){
        return db.execute(
            "UPDATE formatoEntrevista SET nombreLicenciatura=?,institucion=?, promedio=?, generacion=?, gradoMax=?, maestria=?, institucionMaestria=?,  promedioMaestria=?, cursos=?, idiomas=? WHERE idFormato=?",
            [
                this.nombreLicenciatura,
                this.institucion,
                this.promedio,
                this.generacion, 
                this.gradoMax, 
                this.maestria, 
                this.institucionMaestria, 
                this.promedioMaestria, 
                this.cursos, 
                this.idiomas, 
                this.idFormato
            ]
        )
    }
};