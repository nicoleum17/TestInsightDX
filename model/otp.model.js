const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");

module.exports = class OTP {
  constructor(idUsuario, contraseña, expiraEn) {
    this.idOTP = uuidv4();
    this.idUsuario = idUsuario;
    this.contraseña = contraseña;
    this.expiraEn = expiraEn;
  }
  save() {
    return db.execute(
      "INSERT INTO otp (idOTP, idUsuario, contraseña, expiraEn) VALUES (?, ?, ?, ?)",
      [this.idOTP, this.idUsuario, this.contraseña, this.expiraEn]
    );
  }

  static fetchOne(idUsuario) {
    return db.execute(
      "SELECT * FROM otp WHERE idUsuario = ? ORDER BY created_at DESC LIMIT 1;",
      [idUsuario]
    );
  }

  static updateOtp(idOTP) {
    return db.execute("UPDATE otp SET estaActivo = 0 WHERE idOTP = ?", [idOTP]);
  }
};
