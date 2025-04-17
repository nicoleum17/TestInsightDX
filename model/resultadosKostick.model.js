const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = class ResultadosKostick {
  constructor(
    mi_idGrupo,
    mi_idUsuario,
    mi_G,
    mi_L,
    mi_I,
    mi_T,
    mi_V,
    mi_S,
    mi_R,
    mi_D,
    mi_C,
    mi_E,
    mi_W,
    mi_F,
    mi_K,
    mi_Z,
    mi_O,
    mi_B,
    mi_X,
    mi_P,
    mi_A,
    mi_N
  ) {
    this.mi_idGrupo = mi_idGrupo;
    this.mi_idUsuario = mi_idUsuario;
    this.g = mi_G;
    this.l = mi_L;
    this.i = mi_I;
    this.t = mi_T;
    this.v = mi_V;
    this.s = mi_S;
    this.r = mi_R;
    this.d = mi_D;
    this.c = mi_C;
    this.e = mi_E;
    this.w = mi_W;
    this.f = mi_F;
    this.k = mi_K;
    this.z = mi_Z;
    this.o = mi_O;
    this.b = mi_B;
    this.x = mi_X;
    this.p = mi_P;
    this.a = mi_A;
    this.n = mi_N;
  }

  save() {
    return db.execute(
      `INSERT INTO resultadoskostick (
          idGrupo, idUsuario, G, L, I, T, V, S, R, D, C, E, 
          W, F, K, Z, O, B, X, P, A, N
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.mi_idGrupo,
        this.mi_idUsuario,
        this.g,
        this.l,
        this.i,
        this.t,
        this.v,
        this.s,
        this.r,
        this.d,
        this.c,
        this.e,
        this.w,
        this.f,
        this.k,
        this.z,
        this.o,
        this.b,
        this.x,
        this.p,
        this.a,
        this.n,
      ]
    );
  }

  static fetchAll(idGrupo, idUsuario) {
    return db.execute(
      "SELECT * FROM resultadoskostick WHERE idGrupo = ? AND idUsuario = ?",
      [idGrupo, idUsuario]
    );
  }
};
