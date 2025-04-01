const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class formatoEntrevistaDL {
    constructor(
        mi_lugarTrabajo,
        mi_empresa,
        mi_puesto,
        mi_años,
        mi_actividades,
        mi_sueldo,
        mi_personal,
        mi_idFormato
    ){
        this.lugarTrabajo = mi_lugarTrabajo;
        this.empresa = mi_empresa;
        this.puesto = mi_puesto;
        this.años = mi_años;
        this.actividades = mi_actividades;
        this.sueldo = mi_sueldo;
        this.personal = mi_personal;
        this.idFormato=mi_idFormato;
    }
    save(){
        return db.execute("UPDATE formatoEntrevista SET lugarTrabajo=?, empresa=?, puesto=?, años=?, actividades=?, sueldo=?, personal=? WHERE idFormato=?",
            [this.lugarTrabajo, this.empresa, this.puesto, this.años, this.actividades, this.sueldo, this.personal, this.idFormato])
    }
};