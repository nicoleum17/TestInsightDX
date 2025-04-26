const db = require("../../util/database");

module.exports = class InterpretacionKostick {
  static fetchAll() {
    return db.execute("SELECT * FROM interpretacionkostick");
  }
};
