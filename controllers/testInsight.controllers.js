const { response } = require("express");
const Usuario = require("../model/testInsight.model");

exports.get_login = (request, response, next) => {
  const mensaje = request.session.info || "";
  if (request.session.info) {
    request.session.info = "";
  }

  const warning = request.session.warning || "";
  if (request.session.warning) {
    request.session.warning = "";
  }

  response.render("login.ejs", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    isNew: false,
    info: mensaje,
    warning: warning,
    csrfToken: request.csrfToken(),
  });
};

exports.post_login = (request, response, next) => {
  Usuario.fetchOne(request.body.usuario)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        const bcrypt = require("bcryptjs");
        bcrypt
          .compare(request.body.contraseña, rows[0].contraseña)
          .then((doMatch) => {
            if (doMatch) {
              request.session.isLoggedIn = true;
              request.session.usuario = request.body.usuario;
              return request.session.save((error) => {
                response.redirect("/aspirante/inicio_aspirante");
              });
            } else {
              request.session.warning = `Usuario y/o contraseña incorrectos`;
              response.redirect("/login");
              console.log("Usuario y/o contraseña incorrectos-");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        request.session.warning = `Usuario y/o contraseña incorrectos`;
        response.redirect("/login");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
