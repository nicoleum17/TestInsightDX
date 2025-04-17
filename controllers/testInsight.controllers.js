const { response } = require("express");
const Usuario = require("../model/usuarios.model");
const OTP = require("../model/otp.model");
const MS = require("../util/emailSender");

/* Función que sirve como controlador para renderizar la página de login */
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

/* Función para generar los OTP del aspirante */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* Función que sirve como controlador para verificar el login del usuario. 
Necesita verificar que el usuario exista, verificar su contraseña, verificar los priviliegios que tiene el usuario, su rol, y en caso de que el rol de 
un usuario sea el de 'aspirante', enviar un OTP por correo, y obtener a qué grupo pertenece el aspirante*/
exports.post_login = (request, response, next) => {
  Usuario.fetchOne(request.body.usuario)
    .then(([rows, fieldData]) => {
      if (rows.length > 0) {
        const bcrypt = require("bcryptjs");
        bcrypt
          .compare(request.body.contraseña, rows[0].contraseña)
          .then((doMatch) => {
            if (doMatch) {
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
                    Usuario.getAspirante(rows[0].idUsuario).then(
                      ([aspirante]) => {
                        aspiranteDatos = aspirante[0];
                        const otp = generateOTP();
                        const expiraEn = new Date(Date.now() + 10 * 60000);
                        const newOTP = new OTP(
                          rows[0].idUsuario,
                          otp,
                          expiraEn
                        );
                        newOTP.save().then((uuid) => {
                          console.log("OTP saved successfully:");
                          /*return MS.sendEmail(
                              aspiranteDatos.correo,
                              aspiranteDatos.nombres,
                              otp
                            );
                          })
                          .then((response) => {
                            console.log("Email sent successfully:", response);
                            response.redirect("/aspirante/verificarOtp");*/
                        });
                        Usuario.getGrupo(rows[0].idUsuario).then(([grupo]) => {
                          (request.session.grupo = grupo[0].idGrupo),
                            response.redirect("/aspirante/verificarOtp");
                        });
                      }
                    );
                  }
                }
              );
            } else {
              //verificar los intentos de inicio de sesión
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
        //verificar los intentos de inicio de sesión
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
