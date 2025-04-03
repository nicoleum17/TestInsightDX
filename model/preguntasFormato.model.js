const db = require("../util/database.js");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = class preguntasFormato{
    constructor(
        mi_respuesta,
        mi_idPregunta,
        mi_idEntrevista
    ){
        this.respuesta=mi_respuesta;
        this.idPregunta=mi_idPregunta;
        this.idEntrevista=mi_idEntrevista;
    }
    save(){
        return db.execute("INSERT INTO respuestaspreguntasformatos(idFormato,idPregunta,respuesta) VALUES(?,?,?)",
            [this.idEntrevista,this.idPregunta,this.respuesta])
            .then(([result]) => {
                return this.idEntrevista;
              });;
    }
}