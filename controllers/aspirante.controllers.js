const { response, request } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const familia = require("../model/familiaEntrevista.model")
const preguntasFormato = require("../model/preguntasFormato.model");
const Pregunta16PF = require("../model/preguntas16pf.model");
const PreguntaKostick = require("../model/preguntasKostick.model");

exports.get_root = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("inicio_aspirante", {
      pruebas: rows,
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
    });
  });
};

exports.get_notificacionA = (request, response, next) => {
  response.render("notificaciones_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_documentosA = (request, response, next) => {
  response.render("documentos_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_calendarioA = (request, response, next) => {
  response.render("calendario_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_datosA = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("datos_aspirante", {
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
    response.render("instrucciones_prueba", {
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
                return response.render("preguntas_prueba", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: prueba[0],
                  pregunta: pregunta[0],
                  opciones: opciones,
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
                return response.render("preguntas_prueba", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: prueba[0],
                  pregunta: pregunta[0],
                  opciones: opciones,
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
  const { respuestaSeleccionada } = request.body;
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;

  //Aqui falta un metodo del modelo, que va a guardar la respuesta del usuario

  PreguntaKostick.fetchOne(request.session.index)
    .then(([pregunta]) => {
      PreguntaKostick.getOpciones(pregunta[0].idPreguntaKostick)
        .then(([opciones]) => {
          return response.status(200).json({
            csrfToken: request.csrfToken(),
            pregunta: pregunta[0],
            opciones: opciones,
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
  const { respuestaSeleccionada } = request.body;
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;

  //Aqui falta un metodo del modelo, que va a guardar la respuesta del usuario

  Pregunta16PF.fetchOne(request.session.index)
    .then(([pregunta]) => {
      Pregunta16PF.getOpciones(pregunta[0].idPregunta16PF)
        .then(([opciones]) => {
          return response.status(200).json({
            csrfToken: request.csrfToken(),
            pregunta: pregunta[0],
            opciones: opciones,
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
  response.render("formato_entrevista", {
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
      response.redirect("formato_entrevista_preguntasP");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.formato_entrevista_preguntasP = (request, response, next) => {
  response.render("formato_entrevista_preguntasP", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato:request.session.idFormato
  });
};

exports.post_formato_entrevista_preguntasP = (request, response, next) => {
  let numPregunta = 1;
  for (const a in request.body) {
    if (a == "_csrf" || a=="idFormato") {
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
        request.session.idFormato = id
        response.redirect("formato_entrevista_familia");
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
  response.render("formato_entrevista_DA", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato
  });
};

exports.post_formato_entrevista_DA = (request, response, next)=>{
  formatoEntrevista.saveDA(
  
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
    request.body.idFormato,
  ).then((id)=>{
    request.session.idFormato = id;
    response.redirect("formato_entrevista_preguntasDA");
    console.log("Datos_academicos_Guardados");
  })
  .catch((error) => {
    console.log(error);
  });
};

exports.formato_entrevista_preguntasDA = (request, response, next) => {
  response.render("formato_entrevista_preguntasDA", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato:request.session.idFormato
  });
};

exports.post_formato_entrevista_preguntasDA = async (request, response, next) => {
  let numPregunta = 7;
  for (const a in request.body) {
    if (a == "_csrf"||a == "idFormato") {
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
        request.session.idFormato = id
        response.redirect("formato_entrevista_DL");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_DL = (request, response, next) => {
  response.render("formato_entrevista_DL", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato
  });
};

exports.post_formato_entrevista_DL = (request, response, next) => {
  console.log(request.body);
  formatoEntrevista.saveDL(
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
      request.session.idFormato=id;
      response.redirect("formato_entrevista_preguntasDL");
      console.log("Datos_Laborales_Guardados");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.formato_entrevista_preguntasDL = (request, response, next) => {
  response.render("formato_entrevista_preguntasDL", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato:request.session.idFormato
  });
};

exports.post_formato_entrevista_preguntasDL = (request, response, next) => {
  let numPregunta = 14;
  for (const a in request.body) {
    if (a == "_csrf"||a == "idFormato") {
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
        request.session.idFormato = id
        response.redirect("inicio");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_familia = (request, response, next) => {
  response.render("formato_entrevista_familia", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato:request.session.idFormato
  });
};

exports.post_formato_entrevista_familia = (request, response, next) => {
  console.log(request.body)
  const newFamilia = new familia(
    request.body.idFormato,
  )
  newFamilia.save()
  .then((idFormato,idFamilia) => {
    request.session.idFormato = idFormato;
    request.session.idFamilia = idFamilia;
    response.redirect("formato_entrevista_familiar_abueloM");
    console.log(request.body.idFormato, request.body.idFamilia);
  })
  .catch((error) => {
    console.log(error);
  });
};

exports.formato_entrevista_familiar_abueloM = (request,response,next) => {
  response.render("formato_entrevista_familiar", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato:request.session.idFormato,
    familia:request.session.idFamilia,
    tipoFamiliar:'Abuelos Maternos'
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
