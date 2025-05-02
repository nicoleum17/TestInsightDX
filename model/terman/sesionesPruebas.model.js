const db = require('../../config/database');

// Define la clase SesionesPruebas para manejar operaciones sobre la tabla sesionesprueba
class SesionesPruebas {

        async updateSesionPrueba({ estatus, idAspirante, idGrupo, idPrueba }) {
            if (estatus === 1) {
                await db.execute(
                    "UPDATE sesionesprueba SET estatus = ? WHERE idAspirante = ? AND idGrupo = ? AND idPrueba = ?", 
                    ["Incompleto", idAspirante, idGrupo, idPrueba]
                );
            }
            else if (estatus === 3) {
                await db.execute(
                    "UPDATE sesionesprueba SET estatus = ? WHERE idAspirante = ? AND idGrupo = ? AND idPrueba = ?", 
                    ["En progreso", idAspirante, idGrupo, idPrueba]
                );
            } else {
                await db.execute(
                    "UPDATE sesionesprueba SET estatus = ? WHERE idAspirante = ? AND idGrupo = ? AND idPrueba = ?", 
                    ["Completado", idAspirante, idGrupo, idPrueba]
                );
            }
        };

        async fetchById({ idAspirante, idGrupo, idPrueba }) {
            const [rows] = await db.execute(
                "SELECT estatus FROM pruebasaspirante WHERE idAspirante = ? AND idGrupo = ? AND idPrueba = ?",
                [idAspirante, idGrupo, idPrueba]
            );
            return rows;
        };
        

};

module.exports = SesionesPruebas;
