const db = require("../util/database");

module.exports = class CuadernilloColores {
  // Obtener las selecciones de colores del aspirante (2 fases)
  static getSeleccionesColores(idGrupo, idAspirante) {
    return db.execute(
      `
            SELECT 
                SC.idSeleccionColores, 
                SC.idColor, 
                SC.posicion, 
                SC.fase,
                C.nombreColor, 
                C.numeroColor, 
                C.hexColor  
            FROM seleccionescolores SC
            JOIN colores C ON SC.idColor = C.idColor
            WHERE SC.idAspirante = ?
            AND SC.idGrupo = ?
            AND SC.idPrueba = 6
            ORDER BY SC.fase, SC.posicion
        `,
      [idAspirante, idGrupo]
    );
  }
};
