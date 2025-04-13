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

exports.get_root = (request, response, next) => {
  Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
    Prueba.fetchAll().then(([rows]) => {
      Prueba.pruebasPorAspirante(request.session.idUsuario).then(([rows]) => {
        PruebaAspirante.fetchOne(request.session.idUsuario).then(
          ([pruebasAspirante]) => {
            console.log(pruebasAspirante);
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

exports.post_preguntasPrueba = (request, response, next) => {
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

exports.post_siguiente_pregunta1 = (request, response, next) => {
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
  Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
    console.log(idUsuario);
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
