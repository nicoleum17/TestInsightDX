const { response, request } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const familia = require("../model/familiaEntrevista.model");
const familiar = require("../model/familiar.model");
const preguntasFormato = require("../model/preguntasFormato.model");
const Pregunta16PF = require("../model/preguntas16pf.model");
const PreguntaKostick = require("../model/preguntasKostick.model");
const Responde16PF = require("../model/responde16pf.model");
const RespondeKostick = require("../model/respondeKostick.model");
const Aspirante = require("../model/aspirante.model");
const PruebaAspirante = require("../model/pruebasAspirante.model");
const Grupo = require("../model/grupo.model");
const OTP = require("../model/otp.model");
const { google } = require("googleapis");
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
  OTP.fetchOne(request.session.idUsuario).then(([otp]) => {
    if (
      otp[0].contraseña === request.body.token &&
      new Date(otp[0].expiraEn).getTime() > Date.now() &&
      otp[0].estaActivo === 1
    ) {
      csrfToken: request.csrfToken();
      grupo: request.session.grupo;
      OTP.updateOtp(otp[0].idOTP).then(() => {
        response.redirect("/aspirante/inicio");
      });
    } else
      OTP.updateOtp(otp[0].idOTP).then(() => {
        console.log("OTP inválido");
        response.redirect("/login");
      });
  });
};

/* Función que sirve como controlador para permitir renderizar la vista de inicio del rol de aspirante.
 Necesita la información de aspirante, qué pruebas tiene asignadas, y el status de dichas pruebas */
exports.get_root = (request, response, next) => {
  Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
    Prueba.fetchAll().then(([rows]) => {
      Prueba.pruebasPorAspirante(request.session.idUsuario).then(([rows]) => {
        PruebaAspirante.fetchOne(request.session.idUsuario).then(
          ([pruebasAspirante]) => {
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
            });
          }
        );
      });
    });
  });
};

/* Función que sirve como controlador para obtener las notificaciones que tiene el aspirante */
exports.get_notificacionA = (request, response, next) => {
  response.render("notificacionesAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

/* Función que sirve como controlador para obtener la vista en la que el aspirante carga sus documentos (CV y Kardex) */
exports.get_documentosA = (request, response, next) => {
  response.render("documentosAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
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
    request.session.idPregunta16PF = uuid;
    request.session.idGrupo = uuid;
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
    request.session.idPregunta16PF = uuid;
    request.session.idGrupo = uuid;
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

exports.get_pruebaCompletada = (request, response, next) => {
  //Calificar
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
  let opcion = "a";
  const size = m.length;

  for (let l = 0; l < size; l++) {
    for (let o = 0; o <= 1; o++) {
      if (o == 0) {
        opcion = "a";
      } else {
        opcion = "b";
      }
      for (let p = 0; p < 10; p++) {
        pregunta = m[l][o][p];
        RespondeKostick.fetchRespuesta(
          request.session.grupo,
          request.session.idUsuario.idUsuario,
          pregunta
        ).then((respuesta) => {
          if (respuesta == opcion) {
            suma[l]++;
          }
        });
      }
    }
    console.log(letras[l] + ": " + suma[l]);
  }

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
};

exports.formato_entrevista = (request, response, next) => {
  response.render("formatoEntrevista", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    idUsuario: request.session.idUsuario,
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
        request.body.telefono,
        request.body.correo,
        row[0].idFormato
      );
      newFormato
        .save()
        .then((uuid) => {
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

exports.formato_entrevista_preguntasP = (request, response, next) => {
  response.render("formatoEntrevistaPreguntasP", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
  });
};

exports.post_formato_entrevista_preguntasP = (request, response, next) => {
  let numPregunta = 1;
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
    newPregunta
      .save()
      .then((id) => {
        request.session.idFormato = id;
        response.redirect("formatoEntrevistaFamilia");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

/* /* Función que funciona como controlador para cerrar la sesión del aspirante */

exports.get_logout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect("/");
  });
};

exports.formato_entrevista_DA = (request, response, next) => {
  response.render("formatoEntrevistaDA", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
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
      request.body.maestria,
      request.body.institucionMaestria,
      request.body.promedioMaestria,
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

exports.formato_entrevista_preguntasDA = (request, response, next) => {
  response.render("formatoEntrevistaPreguntasDA", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
  });
};

exports.post_formato_entrevista_preguntasDA = async (
  request,
  response,
  next
) => {
  let numPregunta = 7;
  for (const a in request.body) {
    if (a == "_csrf" || a == "idFormato") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.body.idFormato || ""
    );
    numPregunta += 1;
    await newPregunta
      .save()
      .then((id) => {
        request.session.idFormato = id;
        response.redirect("formatoEntrevistaDL");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_DL = (request, response, next) => {
  response.render("formatoEntrevistaDL", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
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

exports.formato_entrevista_preguntasDL = (request, response, next) => {
  response.render("formatoEntrevistaPreguntasDL", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
  });
};

exports.post_formato_entrevista_preguntasDL = (request, response, next) => {
  let numPregunta = 14;
  for (const a in request.body) {
    if (a == "_csrf" || a == "idFormato") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.body.idFormato || ""
    );
    numPregunta += 1;
    newPregunta
      .save()
      .then((id) => {
        request.session.idFormato = id;
        response.redirect("formatoEntrevista/confirmacion");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_familia = (request, response, next) => {
  response.render("formatoEntrevistaFamilia", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato,
  });
};

exports.post_formato_entrevista_familia = (request, response, next) => {
  console.log(request.body);
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
  response.render("formatoEntrevistaFamiliar", {
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
    response.send("Succes in LOGIN");
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
      const eventos = res.data.items;
      response.json(eventos);
    }
  );
};
