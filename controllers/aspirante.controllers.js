const { response, request } = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const familia = require("../model/familiaEntrevista.model");
const familiar = require("../model/familiar.model");
const preguntasFormato = require("../model/preguntasFormato.model");
const Pregunta16PF = require("../model/16pf/preguntas16pf.model");
const PreguntaKostick = require("../model/kostick/preguntasKostick.model");
const Responde16PF = require("../model/16pf/responde16pf.model");
const RespondeKostick = require("../model/kostick/respondeKostick.model");
const Aspirante = require("../model/aspirante.model");
const PruebaAspirante = require("../model/pruebasAspirante.model");
const Grupo = require("../model/grupo.model");
const OTP = require("../model/otp.model");
const PruebaColores = require("../model/vaultTech/prueba.model");
const PruebaOtis = require("../model/vaultTech/prueba.model");
const OpcionOtis = require("../model/vaultTech/opcionOtis.model.js");
const { google } = require("googleapis");
const PerteneceGrupo = require("../model/perteneceGrupo.model");
const ResultadosKostick = require("../model/kostick/resultadosKostick.model");
const TienePruebas = require("../model/tienePruebas.model");
const Usuario = require("../model/usuarios.model");
const Hartman = require("../model/hartman/hartman.model");
const HartmanAnalysisModel = require("../model/hartman/hartmanAnalysis.model");
const { calcularResultados } = require("../public/js/valorHartman.js");
const RespuestasPrueba = require("../model/hartman/respuestasPruebasX.model");
const Terman = require("../model/terman/terman.model.js");
const ModeloTerman = new Terman();
const RespuestasTerman = require("../model/terman/respuestasTerman.model.js");
const CalificarSerieTerman = require("../public/js/calificarTerman.js");
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET,
  process.env.REDIRECT
);

/* Función que sirve como controlador que permite verificar la vista para verificar el Token de seguridad*/
exports.get_verificarOtp = (request, response, next) => {
  response.render("verificarOtp", {
    csrfToken: request.csrfToken(),
  });
};

/* Función que sirve como controlador que permite verificar el token de seguridad */
exports.post_verificarOtp = (request, response, next) => {
  OTP.fetchOne(request.session.idUsuario)
    .then(([otp]) => {
      bcrypt.compare(request.body.token, otp[0].contraseña).then((doMatch) => {
        if (
          doMatch &&
          new Date(otp[0].expiraEn).getTime() > Date.now() &&
          otp[0].estaActivo === 1
        ) {
          csrfToken: request.csrfToken();
          grupo: request.session.grupo;

          OTP.updateOtp(otp[0].idOTP).then(() => {
            response.redirect("/aspirante/inicio");
          });
        } else {
          OTP.updateOtp(otp[0].idOTP).then(() => {
            console.log("OTP inválido");
            response.redirect("/login");
          });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      response.status(500).send("An error occurred");
    });
};

/* Función que sirve como controlador para permitir renderizar la vista de inicio del rol de aspirante.
 Necesita la información de aspirante, qué pruebas tiene asignadas, y el status de dichas pruebas */
exports.get_root = (request, response, next) => {
  Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
    Prueba.pruebasPorAspirante(request.session.idUsuario).then(([rows]) => {
      PruebaAspirante.fetchOne(request.session.idUsuario).then(
        ([pruebasAspirante]) => {
          TienePruebas.getFechaLimite(request.session.idUsuario).then(
            ([fechaLimite]) => {
              console.log(request.session.idUsuario);
              response.render("inicioAspirante", {
                pruebas: rows,
                isLoggedIn: request.session.isLoggedIn || false,
                usuario: request.session.usuario || "",
                csrfToken: request.csrfToken(),
                privilegios: request.session.privilegios || [],
                grupo: request.session.grupo,
                pruebasAspirante: pruebasAspirante,
                idUsuario: request.session.idUsuario,
                aspirante: aspirante[0],
                fechaLimite: fechaLimite[0],
              });
            }
          );
        }
      );
    });
  });
};

/* Función que sirve como controlador para obtener las notificaciones que tiene el aspirante */
exports.get_notificacionA = (request, response, next) => {
  Aspirante.notificacion(request.session.idUsuario).then(([rows]) => {
    Usuario.getGrupo(request.session.idUsuario).then(([idGrupo])=>{
      Grupo.fetchOneId(idGrupo[0].idGrupo).then(([grupo])=>{
        response.render("notificacionesAspirante", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          pruebaGrupal: rows[0].pruebaGrupal || null,
          zoomIndividual: rows[0].zoomIndividual,
          limitePrueba: rows[0].limitePrueba || null,
          idGrupo: idGrupo[0].idGrupo,
          grupo: grupo[0],
          enlaceZoom: rows[0].enlaceZoomIndividual,
      })

    })

    });
  });
};

/* Función que sirve como controlador para obtener la vista en la que el aspirante carga sus documentos (CV y Kardex) */
exports.get_documentosA = (request, response, next) => {
  PerteneceGrupo.consultarReporte(request.session.idUsuario).then(
    ([documentos]) => {
      response.render("documentosAspirante", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        documentos: documentos[0],
      });
    }
  );
};

exports.getPdfFile = (request, response, next) => {
  const filename = request.params.filename;
  const filePath = path.join(__dirname, "../public/uploads", filename);
  console.log(__dirname, "../public/uploads", filename);

  response.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      response.status(err.status).end();
    }
  });
};

/* Función que sirve como controlador para obtener el calendario con las fechas límites o fechas de reunión con las psicólogas */
exports.get_calendarioA = (request, response, next) => {
  response.render("calendarioAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

/* Función que sirve como controlador para mostrar las instrucciones de cada una de las pruebas. 
Necesita la información de la pruebas guardadas en base de datos para obtener las instrucciones */
exports.get_instrucciones = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("instruccionesPrueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      prueba: rows[0],
      idUsuario: request.session.idUsuario,
    });
  });
};

/* Función que sirve como controlador para obtener los datos personales del aspirante, y que éste solamente los verifique.
Necesita la información del aspirante guardada en base de datos, como nombre, apellidos y el grupo al que pertenece */
exports.get_datosA = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
      Grupo.fetchOneId(request.session.grupo).then(([grupoCompleto]) => {
        request.session.idPrueba = rows[0].idPrueba;
        response.render("datosAspirante", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          prueba: rows[0],
          idUsuario: request.session.idUsuario,
          aspirante: aspirante[0],
          grupo: request.session.grupo,
          grupoCompleto: grupoCompleto[0],
        });
      });
    });
  });
};

/* Función que sirve como controlador para obtener la primera pregunta de la prueba, y que el aspirante la pueda responder. 
Guarda la respuesta seleccionada en la base de de datos y aumenta un índice para que el siguiente controlador pueda obtener la pregutna que sigue*/
exports.post_preguntasPrueba = (request, response, next) => {
  if (request.params.idPrueba == 1) {
    //En caso de que el id de la prueba sea 1, que es la prueba Kostick, recupera las preguntas y opciones pertenecientes a cada pregunta
    Prueba.fetchOne(request.params.idPrueba)
      .then(([prueba]) => {
        request.session.index = 1;
        let currentQuestionIndex = request.session.index;
        PreguntaKostick.fetchOne(currentQuestionIndex)
          .then(([pregunta]) => {
            PreguntaKostick.getOpciones(pregunta[0].idPreguntaKostick)
              .then(([opciones]) => {
                return response.render("preguntasPrueba", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: prueba[0],
                  pregunta: pregunta[0],
                  opciones: opciones,
                  idGrupo: request.session.grupo,
                  idUsuario: request.session.idUsuario || "",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (request.params.idPrueba == 2) {
    //En caso de que el id de la prueba sea 2, que es la prueba 16PF, recupera las preguntas y opciones pertenecientes a cada pregunta
    Prueba.fetchOne(request.params.idPrueba)
      .then(([prueba]) => {
        request.session.index = 1;
        let currentQuestionIndex = request.session.index;
        Pregunta16PF.fetchOne(currentQuestionIndex)
          .then(([pregunta]) => {
            Pregunta16PF.getOpciones(pregunta[0].idPregunta16PF)
              .then(([opciones]) => {
                return response.render("preguntasPrueba", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: prueba[0],
                  pregunta: pregunta[0],
                  opciones: opciones,
                  idGrupo: request.session.grupo,
                  idUsuario: request.session.idUsuario || "",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (request.params.idPrueba == 3) {
    // Para Hartman
  }
};

/* Función que funciona como controlador para renderizar las preguntas de la 2 a la última, utilizando AJAX, para la prueba 16PF. 
También guarda las respuestas seleccionadas por el aspirante en ese rango de preguntas*/
exports.post_siguientePregunta = (request, response, next) => {
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;

  const newRespondeKostick = new RespondeKostick(
    request.body.idPreguntaKostick,
    request.body.idGrupo,
    request.body.idUsuario,
    request.body.idOpcionKostick,
    request.body.tiempo
  );
  newRespondeKostick.save().then((uuid) => {
    request.session.idUsuario = uuid;
  });
  PreguntaKostick.fetchOne(request.session.index)
    .then(([pregunta]) => {
      PreguntaKostick.getOpciones(pregunta[0].idPreguntaKostick)
        .then(([opciones]) => {
          return response.status(200).json({
            csrfToken: request.csrfToken(),
            pregunta: pregunta[0],
            opciones: opciones,
            idGrupo: request.session.grupo,
            idUsuario: request.session.idUsuario || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

/* Función que funciona como controlador para renderizar las preguntas de la 2 a la última, utilizando AJAX, para la prueba 16PF. 
También guarda las respuestas seleccionadas por el aspirante en ese rango de preguntas*/
exports.post_siguientePregunta1 = (request, response, next) => {
  const { idOpcion16PF, idGrupo, idUsuario, idPregunta16PF, tiempo } =
    request.body;
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;

  const newResponde16pf = new Responde16PF(
    request.body.idPregunta16PF,
    request.body.idGrupo,
    request.body.idUsuario,
    request.body.idOpcion16PF,
    request.body.tiempo
  );
  newResponde16pf.save().then((uuid) => {
    request.session.idUsuario = uuid;
  });

  Pregunta16PF.fetchOne(request.session.index)
    .then(([pregunta]) => {
      Pregunta16PF.getOpciones(pregunta[0].idPregunta16PF)
        .then(([opciones]) => {
          return response.status(200).json({
            csrfToken: request.csrfToken(),
            pregunta: pregunta[0],
            opciones: opciones,
            idGrupo: request.session.grupo,
            idUsuario: request.session.idUsuario || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

/* Función que funciona como controlador para guardar la última respuesta del aspirante, utilizando AJAX, para la prueba Kostick*/
exports.pruebaCompletada = (request, response, next) => {
  const idOpcionKostick = request.body.idOpcionKostick;
  const idGrupo = request.body.idGrupo;
  const idUsuario = request.body.idUsuario;
  const idPreguntaKostick = request.body.idPreguntaKostick;
  const tiempo = request.body.tiempo;
  const idPrueba = 1;

  if (!request.session.index) {
    return response.redirect("/login");
  }

  const newRespondeKostick = new RespondeKostick(
    idPreguntaKostick,
    idGrupo,
    idUsuario,
    idOpcionKostick,
    tiempo
  );

  newRespondeKostick
    .save()
    .then((uuid) => {
      request.session.idPregunta16PF = uuid;
      request.session.idGrupo = uuid;
      request.session.idUsuario = uuid;
      return response.status(200).json({
        message: "Prueba completada exitosamente",
      });
    })
    .catch((error) => {
      console.error("Error saving response:", error);
      return response.status(500).json({ message: "Error saving response." });
    });

  const newPruebaAspirante = new PruebaAspirante(idUsuario, idGrupo, idPrueba);

  newPruebaAspirante.terminarPrueba().then((uuid) => {
    request.session.idGrupo = uuid;
    request.session.idUsuario = uuid;
  });
};

/* Función que funciona como controlador para guardar la última respuesta del aspirante, utilizando AJAX, para la prueba 16PF*/
exports.pruebaCompletada1 = (request, response, next) => {
  const idOpcion16PF = request.body.idOpcion16PF;
  const idGrupo = request.body.idGrupo;
  const idUsuario = request.body.idUsuario;
  const idPregunta16PF = request.body.idPregunta16PF;
  const tiempo = request.body.tiempo;

  const idPrueba = 2;

  if (!request.session.index) {
    return response.redirect("/login");
  }

  const newResponde16pf = new Responde16PF(
    idOpcion16PF,
    idGrupo,
    idUsuario,
    idPregunta16PF,
    tiempo
  );
  newResponde16pf
    .save()
    .then((uuid) => {
      request.session.idPregunta16PF = uuid;
      request.session.idGrupo = uuid;
      request.session.idUsuario = uuid;
      return response.status(200).json({
        message: "Prueba completada exitosamente",
      });
    })
    .catch((error) => {
      console.error("Error saving response:", error);
      return response.status(500).json({ message: "Error saving response." });
    });
  const newPruebaAspirante = new PruebaAspirante(idUsuario, idGrupo, idPrueba);

  newPruebaAspirante.terminarPrueba().then((uuid) => {
    request.session.idGrupo = uuid;
    request.session.idUsuario = uuid;
  });
};

exports.get_pruebaCompletada = async (request, response, next) => {
  if (request.session.idPrueba === 1) {
    const letras = [
      "G",
      "L",
      "I",
      "T",
      "V",
      "S",
      "R",
      "D",
      "C",
      "E",
      "W",
      "F",
      "K",
      "Z",
      "O",
      "B",
      "X",
      "P",
      "A",
      "N",
    ];

    const m = [
      // G
      [[1, 11, 21, 31, 41, 51, 61, 71, 81], []],
      // L
      [[12, 22, 32, 42, 52, 62, 72, 82], [81]],
      // I
      [
        [23, 33, 43, 53, 63, 73, 83],
        [82, 71],
      ],
      // T
      [
        [34, 44, 54, 64, 74, 84],
        [83, 72, 61],
      ],
      // V
      [
        [45, 55, 65, 75, 85],
        [84, 73, 62, 51],
      ],
      // S
      [
        [56, 66, 76, 86],
        [85, 74, 63, 52, 41],
      ],
      // R
      [
        [67, 77, 87],
        [86, 75, 64, 53, 42, 31],
      ],
      // D
      [
        [78, 88],
        [87, 76, 65, 54, 43, 32, 21],
      ],
      // C
      [[89], [88, 77, 66, 55, 44, 33, 22, 11]],
      // E
      [[], [89, 78, 67, 56, 45, 34, 23, 12, 1]],
      // W
      [[90, 80, 70, 60, 50, 40, 30, 20, 10], []],
      // F
      [[79, 69, 59, 49, 39, 29, 19, 9], [10]],
      // K
      [
        [68, 58, 48, 38, 28, 18, 8],
        [9, 20],
      ],
      // Z
      [
        [57, 47, 37, 27, 17, 7],
        [8, 19, 30],
      ],
      // O
      [
        [46, 36, 26, 16, 6],
        [7, 18, 29, 40],
      ],
      // B
      [
        [35, 25, 15, 5],
        [6, 17, 28, 39, 50],
      ],
      // X
      [
        [24, 14, 4],
        [5, 16, 27, 38, 49, 60],
      ],
      // P
      [
        [13, 3],
        [4, 15, 26, 37, 48, 59, 70],
      ],
      // A
      [[2], [3, 14, 25, 36, 47, 58, 69, 80]],
      // N
      [[], [2, 13, 24, 35, 46, 57, 68, 79, 90]],
    ];

    let suma = new Array(m.length).fill(0);

    try {
      //Calificar

      const promesas = [];

      let pregunta = 0;
      const size = m.length;

      for (let l = 0; l < size; l++) {
        for (let o = 0; o <= 1; o++) {
          let opcion = "a";
          if (o === 0) {
            opcion = "a";
          } else {
            opcion = "b";
          }
          for (let p = 0; p < m[l][o].length; p++) {
            pregunta = m[l][o][p];
            const letra = l;
            promesas.push(
              RespondeKostick.fetchRespuesta(
                request.session.grupo,
                request.session.idUsuario,
                pregunta
              )
                .then((respuesta) => {
                  if (respuesta[0][0].opcionKostick === opcion) {
                    suma[letra] = suma[letra] + 10;
                  }
                })
                .catch((err) => {
                  //console.error(`Error en pregunta ${pregunta}:`, err);
                })
            );
          }
        }
      }
      await Promise.all(promesas);

      for (let i = 0; i < letras.length; i++) {
        console.log(letras[i] + ": " + suma[i]);
      }
    } catch (err) {
      console.error("Error general:", err);
      response.status(500).send("Ocurrió un error al calificar la prueba");
    }

    const mis_resultadosKostick = new ResultadosKostick(
      request.session.grupo,
      request.session.idUsuario,
      suma[0],
      suma[1],
      suma[2],
      suma[3],
      suma[4],
      suma[5],
      suma[6],
      suma[7],
      suma[8],
      suma[9],
      suma[10],
      suma[11],
      suma[12],
      suma[13],
      suma[14],
      suma[15],
      suma[16],
      suma[17],
      suma[18],
      suma[19]
    );
    mis_resultadosKostick.save().then(() => {
      Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
        response.render("finPrueba", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          idUsuario: request.session.idUsuario,
          aspirante: aspirante[0],
        });
      });
    });
  } else {
    Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
      response.render("finPrueba", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario,
        aspirante: aspirante[0],
      });
    });
  }
};

exports.formato_entrevista = (request, response, next) => {
  formatoEntrevista
    .formato_activo(request.session.idUsuario)
    .then(([row, fieldData]) => {
      console.log(row[0]);
      formatoEntrevista.fetch(row[0].idFormato).then((info) => {
        console.log(row[0].estatus);
        response.render("formatoEntrevista", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          idUsuario: request.session.idUsuario,
          formato: info[0][0] || "",
          estatusFormato: row[0].estatus,
        });
      });
    });
};

exports.post_formato_entrevista = (request, response, next) => {
  formatoEntrevista
    .getID(request.body.idUsuario)
    .then(([row, fieldData]) => {
      const newFormato = new formatoEntrevista(
        request.body.apellidoP,
        request.body.apellidoM,
        request.body.nombre,
        request.body.fechaNacimiento,
        request.body.genero,
        request.body.edad,
        request.body.nacionalidad,
        request.body.origen,
        request.body.estadoCivil,
        request.body.direccionA,
        request.body.celular,
        request.body.telefono || null,
        request.body.correo,
        row[0].idFormato
      );
      newFormato
        .save()
        .then((uuid) => {
          console.log(request.body.estatus);
          request.session.estatus = request.body.estatus;
          request.session.idFormato = uuid;
          response.redirect("formatoEntrevistaPreguntasP");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.formato_entrevista_preguntasP = async (request, response, next) => {
  const promesas = [];
  for (let i = 1; i < 7; i++) {
    promesas.push(preguntasFormato.fetchPregunta(i, request.session.idFormato));
  }
  try {
    const respuestas = await Promise.all(promesas);

    response.render("formatoEntrevistaPreguntasP", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      respuesta: respuestas,
      formato: request.session.idFormato,
    });
  } catch (error) {
    console.error("Error al sacar preguntas:", error);
  }
};

exports.post_formato_entrevista_preguntasP = async (
  request,
  response,
  next
) => {
  let numPregunta = 1;
  const promesas = [];
  for (const a in request.body) {
    if (a == "_csrf" || a == "idFormato") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.body.idFormato
    );
    numPregunta += 1;

    promesas.push(newPregunta.save());
  }

  try {
    const idPreguntas = await Promise.all(promesas);
    console.log(promesas);
    request.session.idFormato = idPreguntas[idPreguntas.length - 1];
    response.redirect("formatoEntrevistaFamilia");
    console.log("Pregunta Guardada");
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
  }
};

/* /* Función que funciona como controlador para cerrar la sesión del aspirante */

exports.get_logout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect("/");
  });
};

exports.formato_entrevista_DA = (request, response, next) => {
  formatoEntrevista.fetchDA(request.session.idFormato).then((info) => {
    console.log(info);
    response.render("formatoEntrevistaDA", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      formato: request.session.idFormato,
      respuesta: info[0][0] || null,
    });
  });
};

exports.post_formato_entrevista_DA = (request, response, next) => {
  formatoEntrevista
    .saveDA(
      request.body.nombreLicenciatura,
      request.body.institucion,
      request.body.promedio,
      request.body.generacion,
      request.body.gradoMax,
      request.body.maestria || null,
      request.body.institucionMaestria || null,
      request.body.promedioMaestria || null,
      request.body.cursos,
      request.body.idiomas,
      request.body.idFormato
    )
    .then((id) => {
      request.session.idFormato = id;
      response.redirect("formatoEntrevistaPreguntasDA");
      console.log("Datos_academicos_Guardados");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.formato_entrevista_preguntasDA = async (request, response, next) => {
  const promesas = [];
  for (let i = 7; i < 14; i++) {
    promesas.push(preguntasFormato.fetchPregunta(i, request.session.idFormato));
  }
  try {
    const respuestas = await Promise.all(promesas);
    console.log(respuestas);
    response.render("formatoEntrevistaPreguntasDA", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      respuesta: respuestas || null,
      formato: request.session.idFormato,
    });
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
  }
};

exports.post_formato_entrevista_preguntasDA = async (
  request,
  response,
  next
) => {
  let numPregunta = 7;
  const promesas = [];
  for (const a in request.body) {
    if (a == "_csrf" || a == "idFormato") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.body.idFormato
    );
    numPregunta += 1;

    promesas.push(newPregunta.save());
  }

  try {
    const idPreguntas = await Promise.all(promesas);
    request.session.idFormato = idPreguntas[idPreguntas.length - 1];
    response.redirect("formatoEntrevistaDL");
    console.log("Pregunta Guardada");
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
  }
};

exports.formato_entrevista_DL = (request, response, next) => {
  formatoEntrevista.fetchDL(request.session.idFormato).then((info) => {
    console.log(info);
    response.render("formatoEntrevistaDL", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      formato: request.session.idFormato,
      respuesta: info[0][0] || null,
    });
  });
};
exports.post_formato_entrevista_DL = (request, response, next) => {
  formatoEntrevista
    .saveDL(
      request.body.lugarTrabajo,
      request.body.empresa,
      request.body.puesto,
      request.body.tiempo,
      request.body.actividades,
      request.body.sueldo,
      request.body.personal,
      request.body.idFormato
    )
    .then((id) => {
      request.session.idFormato = id;
      response.redirect("formatoEntrevistaPreguntasDL");
      console.log("Datos_Laborales_Guardados");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.formato_entrevista_preguntasDL = async (request, response, next) => {
  const promesas = [];
  for (let i = 14; i < 20; i++) {
    promesas.push(preguntasFormato.fetchPregunta(i, request.session.idFormato));
  }
  try {
    const respuestas = await Promise.all(promesas);
    console.log(respuestas);
    response.render("formatoEntrevistaPreguntasDL", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      respuesta: respuestas || null,
      formato: request.session.idFormato,
    });
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
  }
};

exports.post_formato_entrevista_preguntasDL = async (
  request,
  response,
  next
) => {
  let numPregunta = 14;
  const promesas = [];
  for (const a in request.body) {
    if (a == "_csrf" || a == "idFormato") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.body.idFormato
    );
    numPregunta += 1;

    promesas.push(newPregunta.save());
  }

  try {
    const idPreguntas = await Promise.all(promesas);
    request.session.idFormato = idPreguntas[idPreguntas.length - 1];
    response.redirect("formatoEntrevista/confirmacion");
    console.log("Pregunta Guardada");
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
  }
};

exports.formato_entrevista_familia = (request, response, next) => {
  console.log("Este es el id del Formato", request.session.idFormato);
  familia.fetchFamilia(request.session.idFormato).then((resultados) => {
    const fila = resultados[0]?.[0];
    if (fila) {
      const { idFamilia } = fila;
      console.log("Este es el id", idFamilia);
      response.render("formatoEntrevistaFamilia", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        formato: request.session.idFormato,
        familia: idFamilia,
      });
    } else {
      response.render("formatoEntrevistaFamilia", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        formato: request.session.idFormato,
        familia: "",
      });
    }
  });
};

exports.post_formato_entrevista_familia = (request, response, next) => {
  console.log(request.body);
  if (request.body.idFamilia) {
    console.log("YA HAY FAMILIA");
    request.session.idFamilia = request.body.idFamilia;
    request.session.idFormato = request.body.idFormato;
    response.redirect("formatoEntrevista/Familiar/AbueloM");
  } else {
    const newFamilia = new familia(request.body.idFormato);
    newFamilia
      .save()
      .then(({ idFormato, idFamilia }) => {
        request.session.idFormato = idFormato;
        request.session.idFamilia = idFamilia;
        response.redirect("formatoEntrevista/Familiar/AbueloM");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_familiar_abueloM = (request, response, next) => {
  response.render("formatoEntrevistaFamiliar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Abuelos Maternos",
    rutaPost: "AbueloM",
    omitirRuta: "AbueloP",
  });
};

exports.formato_entrevista_familiar_abueloP = (request, response, next) => {
  response.render("formatoEntrevistaFamiliar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Abuelos Paternos",
    rutaPost: "AbueloP",
    omitirRuta: "TioM",
  });
};

exports.formato_entrevista_familiar_TioM = (request, response, next) => {
  response.render("formatoEntrevistaFamiliar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Tios/as Maternos/as",
    rutaPost: "TioM",
    omitirRuta: "TioP",
  });
};

exports.formato_entrevista_familiar_TioP = (request, response, next) => {
  response.render("formatoEntrevistaFamiliar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Tios/as Paternos/as",
    rutaPost: "TioP",
    omitirRuta: "Padres",
  });
};

exports.formato_entrevista_familiar_Padres = (request, response, next) => {
  response.render("formatoEntrevistaFamiliarObligatorio", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Padres",
    rutaPost: "Padres",
    omitirRuta: "Pareja",
  });
};

exports.formato_entrevista_familiar_Pareja = (request, response, next) => {
  response.render("formatoEntrevistaFamiliar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Pareja",
    rutaPost: "Pareja",
    omitirRuta: "Hijos",
  });
};

exports.formato_entrevista_familiar_Hijos = (request, response, next) => {
  response.render("formatoEntrevistaFamiliar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
    familia: request.session.idFamilia,
    tipoFamiliar: "Hijos",
    rutaPost: "Hijos",
    omitirRuta: "/aspirante/formatoEntrevistaDA",
  });
};

exports.post_formato_entrevista_familiar_abueloM = (
  request,
  response,
  next
) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("AbueloM");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Abuelo/a Materno/a",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("AbueloP");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.post_formato_entrevista_familiar_abueloP = (
  request,
  response,
  next
) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("AbueloP");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Abuelo/a Paterno/a",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("TioM");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.post_formato_entrevista_familiar_TioM = (request, response, next) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("TioM");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Tio/a Materno/a",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("TioP");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.post_formato_entrevista_familiar_TioP = (request, response, next) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("TioP");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Tio/a Paterno/a",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("Padres");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.post_formato_entrevista_familiar_Padres = (request, response, next) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("Padres");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Padre/Madre",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("Pareja");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.post_formato_entrevista_familiar_Pareja = (request, response, next) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("Pareja");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Pareja",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("Hijos");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.post_formato_entrevista_familiar_Hijos = (request, response, next) => {
  const nombres = [].concat(request.body.nombreFamiliar);
  const edades = [].concat(request.body.edad);
  const generos = [].concat(request.body.genero);
  const estadosCiviles = [].concat(request.body.estadoCivil);
  if (!request.body.nombreFamiliar) {
    response.redirect("Hijos");
  } else {
    let contador = 0;
    for (const a in nombres) {
      const newFamiliar = new familiar(
        nombres[contador],
        edades[contador],
        generos[contador],
        estadosCiviles[contador],
        request.body.familia,
        "Hijo/a",
        request.session.idFormato
      );
      newFamiliar
        .save()
        .then(({ idFormato, idFamilia }) => {
          request.session.idFormato = idFormato;
          request.session.idFamilia = idFamilia;
          response.redirect("/aspirante/formatoEntrevistaDA");
        })
        .catch((error) => {
          console.log(error);
        });
      contador += 1;
    }
  }
};

exports.getConfirmacionFormato = (request, response) => {
  response.render("formatoEntrevistaConfirmar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
  });
};

exports.postConfirmacionFormato = (request, response) => {
  formatoEntrevista
    .finish(request.body.idFormato)
    .then((id) => {
      request.session.idFormato = id;
      response.redirect("/aspirante/inicio");
      console.log("Termina Formato Entrevista");
    })
    .catch((error) => {
      console.log(error);
    });
};
//exports.post_formato_entrevista = (request,response,next) => {

// UNMODELO.fetchAll().then(async () => {
//   for (let familiar of request.body.familiares) {
//     const nuevo_familiar = new Familiar(familiar);
//     await nuevo_familiar.save();
//   }

// });

//};

exports.registra_kardex = (request, response, next) => {
  response.render("registrarKardex", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    idUsuario: request.session.idUsuario || "",
  });
};

exports.post_registra_kardex = (request, response, next) => {
  let kardex = request.file.filename;
  Aspirante.update_subirKardex(request.session.idUsuario, kardex).then(() => {
    response.redirect("/aspirante/documentosAspirante");
  });
};

exports.registra_CV = (request, response, next) => {
  response.render("registrarCV", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    idUsuario: request.session.idUsuario || "",
  });
};

exports.post_registra_CV = (request, response, next) => {
  let CV = request.file.filename;
  Aspirante.update_subirCV(request.session.idUsuario, CV).then(() => {
    response.redirect("/aspirante/documentosAspirante");
  });
};

exports.get_documentos_activos = (request, response, next) => {
  Aspirante.documentos_activos(request.session.idUsuario).then(([rows]) => {
    if (rows.length > 0) {
      const documentos = {
        kardex: rows[0].kardex || null,
        curriculumVitae: rows[0].curriculumVitae || null,
        idUsuario: request.session.idUsuario,
      };
      response.status(200).json({ documentos });
    }
  });
};

exports.get_formato_activo = (request, response, next) => {
  formatoEntrevista.formato_activo(request.session.idUsuario).then(([rows]) => {
    if (rows.length > 0) {
      const formato = {
        estatus: rows[0].estatus || null,
        idFormato: rows[0].idFormato || null,
        idUsuario: request.session.idUsuario,
      };
      response.status(200).json({ formato });
    }
  });
};

exports.getOauthAuthenticator = (request, response, next) => {
  const url = oauth2Client.generateAuthUrl({
    acces_type: "offline",
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });
  response.redirect(url);
};

exports.getRedirectOauth = (request, response, next) => {
  const code = request.query.code;
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error("NO TOKEN;", err);
      response.send("error");
      return;
    }
    oauth2Client.setCredentials(token);
    response.redirect("calendarios/eventos");
  });
};

exports.getCalendario = (request, response, next) => {
  const calenario = google.calendar({ version: "v3", auth: oauth2Client });
  calenario.calendarList.list({}, (err, res) => {
    if (err) {
      console.error("Error fetching calendar;", err);
      res.end("error");
      return;
    }
    const calenarios = res.data.items;
    response.json(calenarios);
  });
};

exports.getEventoCalendario = (request, response, next) => {
  const calendarId = request.query.calendar ?? "primary";
  const calendario = google.calendar({ version: "v3", auth: oauth2Client });
  calendario.events.list(
    {
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 15,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) {
        console.error("Error fetching events", err);
        response.send("error");
        return;
      }
      request.session.eventos = res.data.items;
      response.render("calendario", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario || "",
      });
    }
  );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.get_respuestas_enviadas = (request, response, next) => {
  response.send("Respuestas enviadas");
};

//Obtener las areas, preguntas y opciones
exports.obtenerPreguntas = async (req, res, next) => {
  try {
    const [areasDB] = await PruebaOtis.getAreaOtis();
    const [preguntasDB] = await PruebaOtis.getPreguntasOtis();
    const [opcionesDB] = await OpcionOtis.fetchAll();
    const preguntas = preguntasDB.map((pregunta) => {
      const opciones = opcionesDB
        .filter((opcion) => opcion.idPreguntaOtis === pregunta.idPreguntaOtis)
        .map((opcion) => ({
          idOpcionOtis: opcion.idOpcionOtis,
          opcionOtis: opcion.opcionOtis,
          descripcionOpcion: opcion.descripcionOpcion,
          esCorrecta: opcion.esCorrecta,
        }));

      const respuestaCorrecta = opcionesDB.find(
        (opcion) =>
          opcion.idPreguntaOtis === pregunta.idPreguntaOtis &&
          opcion.esCorrecta === 1
      )?.descripcionOpcion;

      // Buscar el nombre del área por idAreaOtis
      const area = areasDB.find((a) => a.idAreaOtis === pregunta.idAreaOtis);
      return {
        num: pregunta.numeroPregunta,
        idPreguntaOtis: pregunta.idPreguntaOtis,
        pregunta: pregunta.preguntaOtis,
        respuesta: respuestaCorrecta,
        nombreAreaOtis: area ? area.nombreAreaOtis : "Sin área",
        opciones: opciones,
      };
    });

    return res.json({ preguntas });
  } catch (error) {
    console.error("Error obteniendo preguntas:", error);
  }
};

// Obtener toda la prueba
exports.getPruebaOtis = (request, response, next) => {
  const idPrueba = 5;
  // Obtener el idGrupo y idPrueba por la sesión

  Usuario.getGrupo(request.session.idUsuario)
    .then(([grupo]) => {
      if (grupo.length > 0) {
        request.session.idGrupo = grupo[0];
        request.session.idPrueba = idPrueba;
      } else {
        console.log("No se encontró grupo para este aspirante y prueba");
      }

      // Función para obtener las preguntas del model
      return PruebaOtis.getPreguntasOtis();
    })
    .then(([grupo, fieldData]) => {
      const preguntas = grupo;
      response.render("pruebaOtis", {
        preguntas: preguntas || [],
        csrfToken: request.csrfToken(),
        grupo: request.session.grupo,
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario || "",
        error: null,
      });
    })
    .catch((error) => {
      console.error("Error al cargar la prueba OTIS:", error);
      response.render("pruebaOtis", {
        preguntas: [],
        csrfToken: request.csrfToken(),
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario || "",
        error: "Error al cargar la prueba OTIS",
      });
    });
};

exports.postPruebaOtis = (request, response, next) => {
  response.redirect("finPrueba");
};

const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");

exports.postGuardarRespuestas = async (request, response) => {
  const idUsuario = request.session.idUsuario;
  const idGrupo = request.session.grupo;
  const idPrueba = request.session.idPrueba;
  console.log("GRUPO", request.session.grupo);

  // Si no se encuentra el idUsuario
  if (!request.session.idUsuario) {
    return response.redirect("/aspirante/datos-personales-otis");
  }

  const respuestas = request.body;

  try {
    // Armar el array de valores para insertar
    const values = respuestas.map((r) => [
      uuidv4(), // para generar el idRespuestaOtis
      idUsuario,
      idGrupo,
      r.idPreguntaOtis,
      r.idOpcionOtis,
      idPrueba,
      r.tiempoRespuesta,
    ]);

    // Insertar valores en la tabla respuestaOtisAspirante
    await db.query(
      `INSERT INTO respuestaotisaspirante
          (idRespuestaOtis, idUsuario, idGrupo, idPreguntaOtis, idOpcionOtis, idPrueba, tiempoRespuesta)
          VALUES ?`,
      [values]
    );

    // Obtener datos personales desde sesión
    const datosPersonales = request.session.datosPersonalesOtis || {
      nombre: "Usuario",
      apellidoPaterno: "",
      apellidoMaterno: "",
      puestoSolicitado: "No especificado",
      fecha: new Date(),
    };

    // Verificar si ya existe el registro en aspirantesGruposPruebas
    const [rows] = await PruebaOtis.verificarExistencia(
      idUsuario,
      idGrupo,
      idPrueba
    );

    console.log("Registro encontrado, actualizando estado...");
    const newPruebaAspirante = new PruebaAspirante(
      idUsuario,
      idGrupo,
      idPrueba
    );

    newPruebaAspirante.terminarPrueba().then((uuid) => {
      request.session.idGrupo = uuid;
      request.session.idUsuario = uuid;
    });
  } catch (error) {
    console.error("Error al guardar respuestas:", error);
  }
  return response.json({
    success: true,
    redirectUrl: "/aspirante/prueba-completada",
  });
};

exports.getPruebaColores = (request, response, next) => {
  const idPrueba = 6;

  // Obtener el idGrupo aspirante y prueba
  Usuario.getGrupo(request.session.idUsuario)
    .then(([grupo]) => {
      if (grupo.length > 0) {
        request.session.idGrupo = grupo[0];
        request.session.idPrueba = idPrueba;
      } else {
        console.log("No se encontró grupo para este aspirante y prueba");
      }

      // Continuar con colores
      return PruebaColores.fetchColores();
    })
    .then(([grupo, fieldData]) => {
      const colores = grupo;
      response.render("pruebaColores", {
        colores: colores || [],
        fase: 1,
        error: null,
        csrfToken: request.csrfToken(),
        usuario: request.session.usuario || "",
        isLoggedIn: request.session.isLoggedIn || false,
        grupo: request.session.grupo,
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario || "",
      });
    })
    .catch((error) => {
      console.log(error);
      response.render("pruebaColores", {
        colores: [],
        fase: 1,
        error: "Error al cargar los colores",
        csrfToken: request.csrfToken(),
        grupo: request.session.grupo,
        usuario: request.session.usuario || "",
        isLoggedIn: request.session.isLoggedIn || false,
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario || "",
      });
    });
};

exports.postPruebaColores = (request, response, next) => {
  response.redirect("/aspirante/prueba-completada");
};

exports.postGuardarSeleccionesColores = (request, response) => {
  console.log("1. Iniciando controlador postGuardarSeleccionesColores");

  if (!request.session.idUsuario) {
    console.log("2. Error: No se encontró idUsuario en la sesión");
    return response.redirect("/aspirante/datos-personales-colores");
  }

  console.log("Datos recibidos:", request.body);

  // Recolectar las selecciones de colores desde los campos del formulario
  const selecciones = [];
  const regex = /selecciones\[(\d+)\]\[(\w+)\]/;

  const datos = {};
  for (const key in request.body) {
    if (key.startsWith("selecciones")) {
      const matches = key.match(regex);
      if (matches) {
        const index = matches[1];
        const prop = matches[2];
        const value = request.body[key];

        if (!datos[index]) {
          datos[index] = {};
        }
        datos[index][prop] = value;
      }
    }
  }

  // Convertir el objeto en un array
  for (const index in datos) {
    selecciones.push({
      idColor: parseInt(datos[index].idColor),
      fase: parseInt(datos[index].fase),
      posicion: parseInt(datos[index].posicion),
    });
  }

  console.log("3. Selecciones procesadas:", selecciones);

  if (selecciones.length === 0) {
    console.log("4. Error: No hay selecciones para procesar");
    return response.redirect("/aspirante/prueba-colores");
  }

  const idPrueba = 6;

  Usuario.getGrupo(request.session.idUsuario)
    .then(([grupo]) => {
      if (grupo.length > 0) {
        request.session.idGrupo = grupo[0].idGrupo;
      } else {
        throw new Error("No se encontró grupo para este aspirante y prueba");
      }

      const idGrupo = request.session.idGrupo;
      console.log("5. ID de Grupo obtenido:", idGrupo);

      // Separar las selecciones de fase 1 y 2
      const seleccionesFase1 = selecciones.filter((s) => s.fase === 1);
      const seleccionesFase2 = selecciones.filter((s) => s.fase === 2);

      console.log("6. Selecciones fase 1:", seleccionesFase1.length);
      console.log("7. Selecciones fase 2:", seleccionesFase2.length);

      return Aspirante.fetchOne(request.session.idUsuario)
        .then(() => {
          console.log("8. Datos personales guardados correctamente");
          // const pruebaColores1 = new PruebaColores(seleccionesFase1);
          return PruebaColores.saveSeleccion(
            request.session.idUsuario,
            idGrupo,
            idPrueba,
            1,
            seleccionesFase1
          );
        })
        .then(() => {
          console.log("9. Primera selección guardada");
          return PruebaColores.saveSeleccion(
            request.session.idUsuario,
            idGrupo,
            idPrueba,
            2,
            seleccionesFase2
          );
        })
        .then(() => {
          console.log("10. Segunda selección guardada");
          return PruebaColores.verificarExistencia(
            request.session.idUsuario,
            idGrupo,
            idPrueba
          );
        })
        .then(([rows]) => {
          if (rows.length === 0) {
            console.log("11. No existe registro, insertando...");
            return db.execute(
              `INSERT INTO pruebasaspirante (idUsuario, idGrupo, idPrueba, estatus)
                  VALUES (?, ?, ?, 'En proceso')`,
              [request.session.idUsuario, idGrupo, idPrueba]
            );
          } else {
            console.log("12. Registro encontrado, actualizando estado...");
            const newPruebaAspirante = new PruebaAspirante(
              request.session.idUsuario,
              idGrupo,
              idPrueba
            );
            return newPruebaAspirante.terminarPrueba().then((uuid) => {
              request.session.idGrupo = uuid;
            });
          }
        });
    })
    .then(() => {
      console.log("13. Proceso completado con éxito");
      delete request.session.datosPersonalesColores;
      delete request.session.primeraSeleccion;
      response.redirect("/aspirante/pruebaCompletada");
    })
    .catch((error) => {
      console.error("Error:", error.message);
      console.log(error);
      return response.send(`
              <h3>Error al procesar la prueba</h3>
              <p>${error.message}</p>
              <a href="/aspirante/prueba-colores" class="btn btn-primary">Volver a intentar</a>
          `);
    });
};

exports.getPruebaCompletada = (request, response, next) => {
  response.render("finPrueba", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    idUsuario: request.session.idUsuario,
  });
};

exports.getRespuestasEnviadas = (request, response, next) => {
  response.render("Aspirantes/respuestasEnviadas");
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
let tiempoInicio;

/**
 * Controlador para la primera fase de la prueba de Hartman.
 * Almacena el tiempo de inicio, obtiene las preguntas de la fase 1,
 * actualiza la sesión de la prueba y renderiza la vista.
 */
exports.get_HartmanFase1 = async (request, response, next) => {
  try {
    tiempoInicio = Date.now();
    console.log("Contador iniciado:", tiempoInicio);

    const fasePregunta = 1;
    const [rows] = await Hartman.fetchFase1(fasePregunta);
    Usuario.getGrupo(request.session.idUsuario).then(([grupo]) => {
      request.session.idGrupo = grupo[0].idGrupo;
      response.render("faseHartman", {
        idsPreguntasHartman: rows.map((row) => row.idPreguntaHartman),
        numerosPreguntas: rows.map((row) => row.idPreguntaHartman),
        preguntasHartman: rows.map((row) => row.preguntaHartman),
        fase1: true,
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario,
        grupo: grupo[0].idGrupo,
      });
    });
  } catch (error) {
    console.error("Error obteniendo las preguntas de la fase 1:", error);
    response.status(500).send("Error al obtener las preguntas de la fase 1.");
  }
};

/**
 * Controlador para procesar las respuestas de la primera fase de Hartman.
 * Calcula el tiempo, extrae las respuestas, las guarda y redirige a la siguiente fase.
 */
exports.post_HartmanFase1 = (request, response, next) => {
  const tiempoFin = Date.now();
  const tiempoTotalSegundos = Math.floor((tiempoFin - tiempoInicio) / 1000);
  console.log(
    "Contador detenido:",
    tiempoFin,
    " -> Tiempo total:",
    tiempoTotalSegundos,
    "segundos"
  );

  const totalPreguntas = Object.keys(request.body).filter((key) =>
    key.startsWith("respuesta_")
  ).length;
  const tiempoPromedio =
    totalPreguntas > 0 ? tiempoTotalSegundos / totalPreguntas : 0;
  console.log("Tiempo promedio por pregunta:", tiempoPromedio);

  const respuestas = Object.entries(request.body)
    .filter(([pregunta_id]) => pregunta_id.startsWith("respuesta_"))
    .map(([pregunta_id, respuesta]) => {
      const idPregunta = parseInt(pregunta_id.replace("respuesta_", ""), 10);
      return [
        request.session.idUsuario,
        request.session.idGrupo,
        idPregunta,
        3,
        respuesta,
        tiempoPromedio,
      ];
    });

  const respuestasFase1 = new Hartman(respuestas);

  respuestasFase1
    .save()
    .then(() => {
      response.redirect("/aspirante/hartman/fase2");
    })
    .catch((err) => {
      console.error("Error al guardar respuestas:", err);
      response.status(500).send("Error interno del servidor");
    });
};

/**
 * Controlador para la segunda fase de la prueba de Hartman.
 * Almacena el tiempo de inicio, obtiene las preguntas de la fase 2 y renderiza la vista.
 */
exports.get_HartmanFase2 = async (request, response, next) => {
  try {
    tiempoInicio = Date.now();
    console.log("Contador iniciado:", tiempoInicio);
    const fasePregunta = 2;
    const [rows] = await Hartman.fetchFase1(fasePregunta);

    response.render("faseHartman", {
      numerosPreguntas: rows.map((row) => row.idPreguntaHartman),
      preguntasHartman: rows.map((row) => row.preguntaHartman),
      fase1: false,
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      idUsuario: request.session.idUsuario,
    });
  } catch (error) {
    console.error("Error obteniendo las preguntas de la fase 2:", error);
    response.status(500).send("Error al obtener las preguntas de la fase 2.");
  }
};

/**
 * Controlador para procesar las respuestas de la segunda fase de Hartman.
 * Calcula el tiempo, extrae las respuestas, las guarda, actualiza la sesión
 * de la prueba y redirige al aspirante.
 */

exports.post_HartmanFase2 = async (request, response, next) => {
  try {
    const tiempoFin = Date.now();
    const tiempoTotalSegundos = Math.floor((tiempoFin - tiempoInicio) / 1000);
    console.log(
      "Contador detenido:",
      tiempoFin,
      " -> Tiempo total:",
      tiempoTotalSegundos,
      "segundos"
    );

    const totalPreguntas = Object.keys(request.body).filter((key) =>
      key.startsWith("respuesta_")
    ).length;
    const tiempoPromedio =
      totalPreguntas > 0 ? tiempoTotalSegundos / totalPreguntas : 0;
    console.log("Tiempo promedio por pregunta:", tiempoPromedio);

    const respuestas = Object.entries(request.body)
      .filter(([pregunta_id]) => pregunta_id.startsWith("respuesta_"))
      .map(([pregunta_id, respuesta]) => {
        const idPregunta = parseInt(pregunta_id.replace("respuesta_", ""), 10);

        return [
          request.session.idUsuario,
          request.session.idGrupo,
          idPregunta,
          3,
          respuesta,
          tiempoPromedio,
        ];
      });

    console.log("Respuestas array:", respuestas); // Log the array

    const respuestasFase2 = new Hartman(respuestas);

    await respuestasFase2.save();
    // 1. Recuperar todas las respuestas del usuario
    const todasLasRespuestas = await Hartman.getRespuestasUsuario(
      request.session.idUsuario,
      request.session.idGrupo
    );
    console.log("Todas las respuestas del usuario:", todasLasRespuestas);

    // Separar las respuestas en arreglos de 'cita' y 'frase' y los convierte a numeros
    const respuestasFrase = todasLasRespuestas
      .filter((r) => r.idPreguntaHartman >= 1 && r.idPreguntaHartman <= 18)
      .map((r) => parseInt(r.respuestaAbierta, 10));

    const respuestasCita = todasLasRespuestas
      .filter((r) => r.idPreguntaHartman >= 19 && r.idPreguntaHartman <= 36)
      .map((r) => parseInt(r.respuestaAbierta, 10));
    console.log("Respuestas Frase:", respuestasFrase);
    console.log("Respuestas Cita:", respuestasCita);

    // 2. Analizar las respuestas
    const resultadosAnalisis = calcularResultados(
      respuestasFrase,
      respuestasCita
    );
    console.log("Resultados del análisis:", resultadosAnalisis);

    // 3. Guardar los resultados del análisis
    const hartmanAnalysis = new HartmanAnalysisModel(
      request.session.idUsuario,
      request.session.idGrupo,
      resultadosAnalisis
    );
    await hartmanAnalysis.save();
    console.log("Análisis guardado en la base de datos.");

    // --- FIN ANÁLISIS Y GUARDADO ---
    const idPrueba = 3;
    const newPruebaAspirante = new PruebaAspirante(
      request.session.idUsuario,
      request.session.idGrupo,
      idPrueba
    );
    return newPruebaAspirante.terminarPrueba().then((uuid) => {
      request.session.idGrupo = uuid;
      response.redirect("/aspirante/pruebaCompletada");
    });
  } catch (err) {
    console.error("Error en post_HartmanFase2:", err);
    response.status(500).send("Error interno del servidor.");
  }
};

exports.get_responderTerman = (request, response, next) => {
  Usuario.getGrupo(request.session.idUsuario).then(([grupo]) => {
    request.session.idGrupo = grupo[0].idGrupo;
    response.render("responderTerman", {
      csrfToken: request.csrfToken(),
      title: "Responder Terman",
      csrfToken: request.csrfToken(),
      grupo: request.session.grupo,
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      privilegios: request.session.privilegios || [],
      idUsuario: request.session.idUsuario || "",
    });
  });
};

exports.get_infoSerie = (request, response, next) => {
  const idSerie = parseInt(request.params.idSerie);
  console.log("Valor recibido en req.params.idSerie:", idSerie);

  if (!idSerie || isNaN(idSerie)) {
    return response
      .status(400)
      .json({ error: "ID de serie inválido o no proporcionado." });
  }

  let nombreSeccion, instruccion, preguntas, opciones;

  return ModeloTerman.fetchSerieInfoById(idSerie)
    .then((info) => {
      //console.log("info:", info);
      id = info[0].idSerieTerman;
      nombreSeccion = info[0].nombreSeccion;
      instruccion = info[0].instruccion;
      duracion = info[0].duracion;

      return ModeloTerman.fetchPreguntaSerieById(idSerie);
    })
    .then((preguntasRows) => {
      preguntas = preguntasRows;
      return ModeloTerman.fetchOpcionesSerieById(idSerie);
    })
    .then((opcionesRows) => {
      opciones = opcionesRows;

      // Adjunta las opciones a cada pregunta
      const preguntasConOpciones = preguntas.map((p) => {
        p.opciones = opciones.filter(
          (o) => o.idPreguntaTerman === p.idPreguntaTerman
        );
        return p;
      });

      response.json({
        id,
        nombreSeccion,
        instruccion,
        duracion,
        preguntas: preguntasConOpciones,
      });
      console.log(response.json);
    })
    .catch((error) => {
      console.error("Error al cargar serie:", error);
      response.status(500).json({ error: "Error al cargar la serie." });
    });
};

exports.post_respuestasSerie = async (request, response, next) => {
  try {
    // Constantes de construcción
    const idSerie = parseInt(request.params.idSerie);

    const { respuestas } = request.body;
    // console.log("Recibimos respuestas en el backend:", respuestas);
    const idUsuario = request.session.idUsuario;
    const idGrupo = request.session.idGrupo;
    const idPrueba = 4;
    const totalPartes = 10;

    // PASO 49 DE DIAGRAMA: Calificamos la serie
    await CalificarSerieTerman(idSerie, idUsuario, idGrupo, respuestas);

    // PASO 69 DE DIAGRAMA: Creamos el modelo con esos datos
    const respuestasModel = new RespuestasTerman(
      idUsuario,
      idGrupo,
      idPrueba,
      respuestas
    );

    // Guardamos las respuestas
    await respuestasModel.save();
    // Increment the part completion count in the session
    if (!request.session.completedParts) {
      request.session.completedParts = 0;
    }
    request.session.completedParts += 1;

    // Check if all parts are completed
    if (request.session.completedParts >= totalPartes) {
      const idPrueba = 4;
      const newPruebaAspirante = new PruebaAspirante(
        request.session.idUsuario,
        request.session.idGrupo,
        idPrueba
      );

      await newPruebaAspirante.terminarPrueba().then((uuid) => {
        request.session.idGrupo = uuid;
        response.redirect("/aspirante/pruebaCompletada");
      });
    } else {
      response.status(200).json({ ok: true, message: "Respuestas guardadas" });
    }
  } catch (error) {
    console.log("Algo salió mal en post_respuestasSerie:", error);
    response.status(500).json({ error: "Error al guardar respuestas" });
  }
};
