const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class preguntasFormato{
    constructor(
        mi_respuesta
    ){
        this.respuesta=mi_respuesta;
    }
}