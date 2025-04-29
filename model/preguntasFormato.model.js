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
    async save(){
        const query = `INSERT INTO respuestaspreguntasformatos(idFormato,idPregunta,respuesta) VALUES(?,?,?) ON DUPLICATE KEY UPDATE respuesta = VALUES(respuesta)`;

        const [resultado] = await db.execute(query, [
            this.idEntrevista,
            this.idPregunta,
            this.respuesta, 
        ]);

        return this.idEntrevista;
    }

    static async fetchPreguntaRespuesta(idPregunta, idEntrevista){
        const query = ``
    }

    static async fetchPregunta(idPregunta, idEntrevista){
        const query = `SELECT respuesta FROM respuestaspreguntasformatos WHERE idPregunta = ? AND idFormato = ?`;
        const [resultado] = await db.execute(query, [
            idPregunta,
            idEntrevista
        ]);

        return resultado;
    }
}