const db = require("../util/database.js");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class familiares{
    constructor(
        miNombre,
        miEdad,
        miGenero,
        miEstadoCivil,
        miFamilia,
        miRelacionAspirante,
        miIdFormato
    ){
        this.idFamiliar = uuidv4();
        this.nombre = miNombre;
        this.genero = miGenero;
        this.edad = miEdad;
        this.estadoCivil = miEstadoCivil;
        this.familia = miFamilia;
        this.relacionAspirante = miRelacionAspirante;
        this.idFormato = miIdFormato;
    }
    save(){
        return db
            .execute(
                "INSERT INTO familiar(idFamiliar, nombre, genero, edad, estadoCivil, relacionAspirante, familia) VALUES (?,?,?,?,?,?,?)",
                [this.idFamiliar, this.nombre, this.genero, this.edad, this.estadoCivil, this.relacionAspirante, this.familia]
            )
            .then(([result]) => {
                return{
                    idFormato : this.idFormato,
                    idFamilia : this.familia
                } 
              });
    }
}