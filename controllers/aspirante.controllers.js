const { response, request } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const familia = require("../model/familiaEntrevista.model");
const preguntasFormato = require("../model/preguntasFormato.model");
const Pregunta16PF = require("../model/preguntas16pf.model");
const PreguntaKostick = require("../model/preguntasKostick.model");
const Responde16PF = require("../model/responde16pf.model");
const RespondeKostick = require("../model/respondeKostick.model");
exports.get_root = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("inicioAspirante", {
      pruebas: rows,
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupo: request.session.grupo,
    });
  });
};

exports.get_notificacionA = (request, response, next) => {
  response.render("notificacionesAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_documentosA = (request, response, next) => {
  response.render("documentosAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_calendarioA = (request, response, next) => {
  response.render("calendarioAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_datosA = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("datosAspirante", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      prueba: rows[0],
    });
  });
};

exports.get_instrucciones = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("instruccionesPrueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      prueba: rows[0],
    });
  });
};

exports.get_preguntasPrueba = (request, response, next) => {
  if (request.params.idPrueba == 1) {
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

exports.post_siguiente_pregunta = (request, response, next) => {
  const { idOpcionKostick, idGrupo, idUsuario, idPreguntaKostick, tiempo } =
    request.body;
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;
  // if(request.session.index == 90){
  //   return response.redirect("/prueba_completada")
  // }

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

exports.post_siguiente_pregunta1 = (request, response, next) => {
  console.log("Request body1", request.body);
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

exports.formato_entrevista = (request, response, next) => {
  response.render("formatoEntrevista", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.post_formato_entrevista = (request, response, next) => {
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
    request.body.correo
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
  console.log(request.body);
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
        response.redirect("inicio");
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
    .then((idFormato, idFamilia) => {
      request.session.idFormato = idFormato;
      request.session.idFamilia = idFamilia;
      response.redirect("formatoEntrevistaFamiliarAbueloM");
      console.log(request.body.idFormato, request.body.idFamilia);
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
  });
};

exports.post_formato_entrevista_familiar_abueloM = (
  request,
  response,
  next
) => {
  console.log(request.body);
};
//exports.post_formato_entrevista = (request,response,next) => {

// UNMODELO.fetchAll().then(async () => {
//   for (let familiar of request.body.familiares) {
//     const nuevo_familiar = new Familiar(familiar);
//     await nuevo_familiar.save();
//   }

// });

//};
