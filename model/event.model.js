const db = require("../util/database.js");
const { v4: uuidv4 } = require("uuid");
module.exports = class eventoGoogle{
    constructor(
        miNombre,
        miLugar,
        miDescripcion,
        miInicio,
        miFinal
    ){
        this.nombre = miNombre;
        this.lugar = miLugar;
        this.descripcion = miDescripcion;
        this.inicio = miInicio;
        this.final = miFinal;
        this.conferenceID = uuidv4();
    }
}