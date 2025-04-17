const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
/*modelo de la tabla que guarda los otp de un aspirante */
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
  /* query que obtiene el otp más reciente por aspirante para la comparación al momento de verificar */
  static fetchOne(idUsuario) {
    return db.execute(
      "SELECT * FROM otp WHERE idUsuario = ? ORDER BY created_at DESC LIMIT 1;",
      [idUsuario]
    );
  }

  /* query para modificar el estado de uso de un otp una vez que este ya ha sido usado o el tiempo de expiración ha pasado*/
  static updateOtp(idOTP) {
    return db.execute("UPDATE otp SET estaActivo = 0 WHERE idOTP = ?", [idOTP]);
  }
};
