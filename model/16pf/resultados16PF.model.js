const db = require("../../util/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = class Resultados16PF {
  constructor(
    mi_idGrupo,
    mi_idUsuario,
    mi_A,
    mi_B,
    mi_C,
    mi_E,
    mi_F,
    mi_G,
    mi_H,
    mi_I,
    mi_L,
    mi_M,
    mi_N,
    mi_O,
    mi_Q1,
    mi_Q2,
    mi_Q3,
    mi_Q4,
    mi_IM
  ) {
    this.mi_idGrupo = mi_idGrupo;
    this.mi_idUsuario = mi_idUsuario;
    this.a = mi_A;
    this.b = mi_B;
    this.c = mi_C;
    this.e = mi_E;
    this.f = mi_F;
    this.g = mi_G;
    this.h = mi_H;
    this.i = mi_I;
    this.l = mi_L;
    this.m = mi_M;
    this.n = mi_N;
    this.o = mi_O;
    this.q1 = mi_Q1;
    this.q2 = mi_Q2;
    this.q3 = mi_Q3;
    this.q4 = mi_Q4;
    this.im = mi_IM;
  }

  save() {
    return db.execute(
      `INSERT INTO parametros16PF (
        idGrupo, idUsuario, A, B, C, E, F, G, H, I, L, M, 
          N, O, Q1, Q2, Q3, Q4, IM
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.mi_idGrupo,
        this.mi_idUsuario,
        this.a,
        this.b,
        this.c,
        this.e,
        this.f,
        this.g,
        this.h,
        this.i,
        this.l,
        this.m,
        this.n,
        this.o,
        this.q1,
        this.q2,
        this.q3,
        this.q4,
        this.im,
      ]
    );
  }

  static fetchAll(idGrupo, idUsuario) {
    return db.execute(
      "SELECT * FROM parametros16PF WHERE idGrupo = ? AND idUsuario = ?",
      [idGrupo, idUsuario]
    );
  }
};
