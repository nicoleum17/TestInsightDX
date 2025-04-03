const db = require("../util/database.js");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class familia {
    constructor(
        mi_idEntrevista,

    ){
        this.idFamilia=uuidv4();
        this.idFormato=mi_idEntrevista;
    }
    save(){
        console.log(this.idFormato)
        console.log(this.idFamilia)
        return db.execute("INSERT INTO familia(idFormato,idFamilia) VALUES (?,?)", [this.idFormato,this.idFamilia])
        .then(([result]) => {
            return this.idFormato, this.idFamilia;
          });
    }
};