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
    username: request.session.usuario || "",
    isNew: false,
    info: mensaje,
    warning: warning,
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
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
<<<<<<< HEAD
              request.session.attempts = 0;
               request.session.attempts1 = 0;
               request.session.isLoggedIn = true;
               request.session.usuario = request.body.usuario;
               return request.session.save((error) => {
                 response.redirect("/aspirante/inicio_aspirante");
               });
=======
              Usuario.getPrivilegios(rows[0].usuario).then(
                ([privilegios, fieldData]) => {
                  request.session.attempts = 0;
                  request.session.attempts1 = 0;
                  request.session.isLoggedIn = true;
                  request.session.usuario = request.body.usuario;
                  request.session.privilegios = privilegios;
                  request.session.idUsuario = rows[0].idUsuario;
                  if (rows[0].idRol === 1) {
                    response.redirect("/psicologa/inicio");
                  } else if (rows[0].idRol === 2) {
                    Usuario.getGrupo(rows[0].idUsuario).then(([grupo]) => {
                      (request.session.grupo = grupo[0].idGrupo),
                        response.redirect("/aspirante/inicio");
                    });
                  }
                }
              );
>>>>>>> develop
            } else {
              request.session.attempts = request.session.attempts + 1;
              console.log(request.session.attempts);
              if (request.session.attempts > 2) {
                request.session.warning = `Por favor contácte a los administradores para verificar sus credenciales`;
                response.redirect("/login");
              } else {
                request.session.warning = `Usuario y/o contraseña incorrectos`;
                response.redirect("/login");
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        request.session.attempts1 = request.session.attempts1 + 1;
        console.log(request.session.attempts1);
        if (request.session.attempts1 > 2) {
          request.session.warning = `Por favor contácte a los administradores para verificar sus credenciales`;
          response.redirect("/login");
        } else {
          request.session.warning = `Usuario y/o contraseña incorrectos`;
          response.redirect("/login");
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
