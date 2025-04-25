const db = require("../../util/database");
/* modelo de las interpretaciones de la prueba 16pf */
module.exports = class Interpretaciones16PF {
  constructor(mi_nivel, mi_A, mi_B, mi_C, mi_E, mi_F, mi_G, mi_H, mi_I, mi_L, mi_M, mi_N, mi_O, mi_Q1, mi_Q2, mi_Q3, mi_Q4, mi_EX, mi_AX, mi_TM, mi_IN, mi_SC) {
    this.nivel = mi_nivel;
    this.A = mi_A;
    this.B = mi_B;
    this.C = mi_C;
    this.E = mi_E;
    this.F = mi_F;
    this.G = mi_G;
    this.H = mi_H;
    this.I = mi_I;
    this.L = mi_L;
    this.M = mi_M;
    this.N = mi_N;
    this.O = mi_O;
    this.Q1 = mi_Q1;
    this.Q2 = mi_Q2;
    this.Q3 = mi_Q3;
    this.Q4 = mi_Q4;
    this.EX = mi_EX;
    this.AX = mi_AX;
    this.TM = mi_TM;
    this.IN = mi_IN;
    this.SC = mi_SC;
  }

  static interpretacion(columna, nivel) {
    if (nivel == 1){
        return db.execute("SELECT nivel1 as resp FROM interpretaciones16PF WHERE parametro = ?",
            [columna]
        );
    } else if (nivel == 2){
        return db.execute("SELECT nivel2 as resp FROM interpretaciones16PF WHERE parametro = ?",
            [columna]
        );
    } else if (nivel == 3){
        return db.execute("SELECT nivel3 as resp FROM interpretaciones16PF WHERE parametro = ?",
            [columna]
        );
    }
  }
};