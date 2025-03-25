const db = require("../util/database");

const bcrypt = require("bcryptjs");

module.exports = class Usuario {
  constructor(mi_username, mi_password) {
    this.username = mi_username;
    this.password = mi_password;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM usuario");
  }

  static fetchOne(username) {
    return db.execute("SELECT * FROM usuario WHERE username = ?", [username]);
  }

  static fetch(username) {
    if (username) {
      return this.fetchOne(username);
    } else {
      return this.fetchAll();
    }
  }
};
