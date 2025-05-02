const { response, request } = require("express");
const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const readXlsxFile = require("read-excel-file/node");
const MSI = require("../util/emailSenderInicial");

const Prueba = require("../model/prueba.model");
const Grupo = require("../model/grupo.model");
const Aspirante = require("../model/aspirante.model");
const Familiar = require("../model/familiar.model");
const FormatoEntrevista = require("../model/formatoEntrevista.model");
const ConsultaResultados = require("../model/hartman/consultaResultados.model");
const Hartman = require("../model/hartman/hartman.model");
const Terman = require("../model/terman/terman.model");
const TienePruebas = require("../model/tienePruebas.model");
const Usuario = require("../model/usuarios.model");
const PerteneceGrupo = require("../model/perteneceGrupo.model");
const PerteneceGrupoParcial = require("../model/perteneceGrupoParcial.model");
const ResultadosKostick = require("../model/kostick/resultadosKostick.model");
const Resultados16PF = require("../model/16pf/resultados16PF.model");
const PruebaV = require("../model/vaultTech/prueba.model");
const OpcionesOtis = require("../model/vaultTech/opcionOtis.model");
const Cuadernillo = require("../model/vaultTech/cuadernilloOtis.model");
const CuadernilloColores = require("../model/vaultTech/cuadernilloColores.model");
const Interpretaciones16PF = require("../model/16pf/interpretaciones.model");
const PreguntasFormato = require("../model/preguntasFormato.model");
const interpretaciones = require("../public/js/interpretacionColores");
const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET,
  process.env.REDIRECT
);
const evento = require("../model/event.model");
const eventoGoogle = require("../model/event.model");
const PreguntaKostick = require("../model/kostick/preguntasKostick.model");
const OpcionKostick = require("../model/kostick/opcionesKostick.model");
const InterpretacionKostick = require("../model/kostick/interpretacionKostick.model");
const Pregunta16PF = require("../model/16pf/preguntas16pf.model");
const Opcion16PF = require("../model/16pf/opciones16pf.model");
const respuestasTermanModel = require('../model/terman/respuestasTerman.model.js');
const calificacionesTerman = require('../model/terman/calificacionesTerman.model.js');
const calificacionTerman = new calificacionesTerman();
const resultadosSeriesTerman = require('../model/terman/resultadosSeriesTerman.model.js');
const calificarSerieTerman = require("../model/terman/calificarTerman");
const resultadoSerieTerman = new resultadosSeriesTerman();
const modeloTerman = new Terman();

exports.inicio_psicologa = (request, response, next) => {
  const mensajeBorrado = request.session.infoBorrado;
  request.session.infoBorrado = undefined;

  const mensajeAspirante = request.session.infoAspirante;
  request.session.infoAspirante = undefined;

  const mensajeUsuario = request.session.infoUsuario;
  request.session.infoUsuario = undefined;

  response.render("inicioPsicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    infoBorrado: mensajeBorrado,
    infoAspirante: mensajeAspirante,
    infoUsuario: mensajeUsuario,
  });
};
exports.notificaciones_psicologa = (request, response, next) => {
  response.render("notificacionesPsicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};
exports.calendario_psicologa = (request, response, next) => {
  response.render("calendarioPsicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};
exports.get_prueba = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("consultaPrueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      pruebas: rows,
    });
  });
};

exports.get_preguntas = (request, response, next) => {
  const idPrueba = parseInt(request.params.id);

  Prueba.fetchOne(idPrueba).then(([pruebaInfo]) => {
    if (idPrueba === 1) {
      PreguntaKostick.fetchAll().then(([preguntasKostick]) => {
        OpcionKostick.fetchAll().then(([opcionesKostick]) => {
          response.render("preguntasYopciones", {
            isLoggedIn: request.session.isLoggedIn || false,
            usuario: request.session.usuario || "",
            csrfToken: request.csrfToken(),
            privilegios: request.session.privilegios || [],
            prueba: pruebaInfo[0],
            preguntas: preguntasKostick,
            opciones: opcionesKostick,
          });
        });
      });
    } else if (idPrueba === 2) {
      Pregunta16PF.fetchAll().then(([preguntas16PF]) => {
        Opcion16PF.fetchAll().then(([opciones16Pf]) => {
          response.render("preguntasYopciones", {
            isLoggedIn: request.session.isLoggedIn || false,
            usuario: request.session.usuario || "",
            csrfToken: request.csrfToken(),
            privilegios: request.session.privilegios || [],
            prueba: pruebaInfo[0],
            preguntas: preguntas16PF,
            opciones: opciones16Pf,
          });
        });
      });
    } else if (idPrueba === 3) {
      Hartman.fetchAll().then(([preguntasHartman]) => {
        response.render("preguntasYopciones", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          prueba: pruebaInfo[0],
          preguntas: preguntasHartman,
        });
      });
    } else if (idPrueba === 4) {
      Terman.fetchAll().then(([preguntasTerman]) => {
        Terman.fetchOpciones().then(([opcionesTerman]) => {
          response.render("preguntasYopciones", {
            isLoggedIn: request.session.isLoggedIn || false,
            usuario: request.session.usuario || "",
            csrfToken: request.csrfToken(),
            privilegios: request.session.privilegios || [],
            prueba: pruebaInfo[0],
            preguntas: preguntasTerman,
            opciones: opcionesTerman,
          });
        });
      });
    } else if (idPrueba === 5) {
      PruebaV.getPreguntasOtis().then(([preguntasOtis]) => {
        OpcionesOtis.fetchAll().then(([opcionesOtis]) => {
          response.render("preguntasYopciones", {
            isLoggedIn: request.session.isLoggedIn || false,
            usuario: request.session.usuario || "",
            csrfToken: request.csrfToken(),
            privilegios: request.session.privilegios || [],
            prueba: pruebaInfo[0],
            preguntas: preguntasOtis,
            opciones: opcionesOtis,
          });
        });
      });
    } else {
      response.status(404).send("Tipo de prueba no reconocido.");
    }
  });
};

exports.registrarAspirante = (request, response, next) => {
  Grupo.fetchAll().then(([rows]) => {
    response.render("registrarAspirante", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupos: rows,
    });
  });
};

exports.post_registrarAspirante = (request, response, next) => {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const mi_aspirante = new Aspirante(
    request.body.codigoI,
    request.body.nombre,
    request.body.apellidoP,
    request.body.apellidoM,
    request.body.numeroTel,
    request.body.genero,
    request.body.estado + ", " + request.body.pais,
    request.body.correo,
    request.body.universidad
  );

  const mi_perteneceGrupo = new PerteneceGrupo(
    request.body.grupo,
    mi_aspirante.idUsuario,
    request.body.fechaSesionIndividual +
      " " +
      request.body.horaSesionIndividual,
    request.body.enlaceZoom
  );
  const fechaInicioIOS = `${request.body.fechaSesionIndividual}T${request.body.horaSesionIndividual}:00`;
  const inicioDate = new Date(fechaInicioIOS);
  const finalDate = new Date(inicioDate.getTime() + 90 * 60000);
  const fechaFinalIOS = finalDate.toISOString();
  const eventoNuevo = new eventoGoogle(
    `Sesion Individual de: ${request.body.nombre} ${request.body.apellidoP}`,
    "Zoom",
    `Sesion Individual con ${request.body.nombre}. \n LINK: ${request.body.enlaceZoom}`,
    fechaInicioIOS,
    fechaFinalIOS
  );
  const eventoCreado = {
    summary: eventoNuevo.nombre,
    location: eventoNuevo.lugar,
    description: eventoNuevo.descripcion,
    start: {
      dateTime: eventoNuevo.inicio,
      timeZone: "America/Mexico_City",
    },
    end: {
      dateTime: eventoNuevo.final,
      timeZone: "America/Mexico_City",
    },
  };
  calendar.events.insert(
    {
      calendarId: "primary",
      resource: eventoCreado,
    },
    (err, ev) => {
      if (err) {
        console.error("Error creando evento: " + err);
      } else {
        console.log("EXITO AL CREAR EVENTO");
      }
    }
  );

  const nombreUsuario = mi_aspirante.codigoIdentidad + new Date().getFullYear();
  const contraseñaBase = uuidv4();

  console.log("Usuario", nombreUsuario);
  console.log("Contraseña Base: " + contraseñaBase);
  
  return MSI.sendEmail(
    mi_aspirante.correo, mi_aspirante.nombres, nombreUsuario, contraseñaBase
  ).then((emailSend) => {
    const fehcaZoom = new Date(request.body.fechaSesionIndividual);

    const mi_usuario = new Usuario(
      mi_aspirante.idUsuario,
      nombreUsuario,
      contraseñaBase,
      "2"
    );

    Aspirante.asignaPruebasAspirante(mi_aspirante.idUsuario, mi_perteneceGrupo.idGrupo);

    mi_aspirante.save().then(() => {
      mi_perteneceGrupo.save().then(() => {
        request.session.infoAspirante = "Aspirante registrado exitosamente";
        mi_usuario.save().then(() => {
          mi_usuario.correo;
          response.redirect("inicio");
        });
      });
    });
  });
};

exports.get_aspirantes = (request, response, next) => {
  const mensaje = request.session.info || "";
  if (request.session.info) {
    request.session.info = "";
  }

  Aspirante.fetchAll(request.session.idUsuario)
    .then(([rows, fieldData]) => {
      response.render("consultaAspirante", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        aspirantes: rows,
        info: mensaje,
        privilegios: request.session.privilegios || [],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.get_buscar = (request, response, next) => {
  Aspirante.find(request.params.valor)
    .then(([rows, fieldData]) => {
      response.status(200).json({ aspirantes: rows });
    })
    .catch((error) => {
      response.status(500).json({ message: "Aspirante no encontrado" });
    });
};

exports.get_respuestasA = (request, response, next) => {
  const idUsuario = request.params.idusuario;
  const idPrueba = request.params.idprueba;

  Aspirante.fetchOne(idUsuario).then(([datosAspirante, fieldData]) => {
    PerteneceGrupo.fetchOne(idUsuario).then(([rows, fieldData]) => {
      Grupo.fetchOneId(rows[0].idGrupo).then(([grupoRows, fieldData]) => {
        if (idPrueba == 1) {
          ResultadosKostick.fetchAll(rows[0].idGrupo, idUsuario).then(
            (resultados) => {
              InterpretacionKostick.fetchAll().then(
                (interpretacionesKostick) => {
                  response.render("consultaRespuestasAspirante", {
                    isLoggedIn: request.session.isLoggedIn || false,
                    usuario: request.session.usuario || "",
                    csrfToken: request.csrfToken(),
                    privilegios: request.session.privilegios || [],
                    prueba: "El inventario de Percepción Kostick",
                    grupo: grupoRows[0],
                    valores: resultados[0][0],
                    datos: datosAspirante[0],
                    interpretaciones: interpretacionesKostick[0],
                    idUsuario: idUsuario,
                    idPrueba: idPrueba,
                    respuestasCorrectas: null,
                    tiempoTotal: null,
                    respuestasAspitanteOtis: null,
                  });
                }
              );
            }
          );
        } else if (idPrueba == 2) {
          Resultados16PF.fetchAll(rows[0].idGrupo, idUsuario).then(
            (resultados) => {
              response.render("consultaRespuestasAspirante", {
                isLoggedIn: request.session.isLoggedIn || false,
                usuario: request.session.usuario || "",
                csrfToken: request.csrfToken(),
                privilegios: request.session.privilegios || [],
                prueba: "Personalidad 16 Factores (16 PF)",
                grupo: grupoRows[0],
                valores: resultados[0][0],
                datos: datosAspirante[0],
                interpretaciones: null,
                idUsuario: idUsuario,
                idPrueba: idPrueba,
                respuestasCorrectas: null,
                tiempoTotal: null,
                respuestasAspitanteOtis: null,
              });
            }
          );
        } else if (idPrueba == 3) {
          request.session.idUsuario = idUsuario;
          request.session.idGrupoAspirante = rows[0].idGrupo;
          response.redirect("/psicologa/analisisHartman");
        }else if (idPrueba == 4){
          //TRABAJO AQUI
          respuestasTerman = new respuestasTermanModel();
          request.session.idUsuarioAspirante = idUsuario;
          request.session.idGrupoAspirante = rows[0].idGrupo;

          response.redirect("/psicologa/analisisTerman");

        } else if (idPrueba == 5) {
          // Obtiene las respuestas correctas del aspirante
          Cuadernillo.getRespuestasCorrectas(rows[0].idGrupo, idUsuario)
            .then(([correctasOtis, fieldData]) => {
              const respuestasCorrectas = correctasOtis[0].RespuestasCorrectas;
              // Obtiene el tiempo total que tomo el aspirante para completar la prueba
              Cuadernillo.getTiempoTotal(rows[0].idGrupo, idUsuario)
                .then(([tt, fieldData]) => {
                  const tiempoTotal = tt[0].Tiempo;
                  // Obtiene las preguntas, opciones y la respuesta del aspirante
                  Cuadernillo.getRespuestasOtisAspirante(
                    rows[0].idGrupo,
                    idUsuario
                  )
                    .then(([respuestasOtisAspirante, fieldData]) => {
                      const preguntasAgrupadas = {};

                      respuestasOtisAspirante.forEach((row) => {
                        // Creamos el objeto de pregunta si este no existe
                        if (!preguntasAgrupadas[row.idPreguntaOtis]) {
                          preguntasAgrupadas[row.idPreguntaOtis] = {
                            idPreguntaOtis: row.idPreguntaOtis,
                            numeroPregunta: row.numeroPregunta,
                            preguntaOtis: row.preguntaOtis,
                            opciones: [],
                            esCorrecta: false,
                            tiempoRespuesta: 0,
                            contestada: null,
                          };
                        }
                        // Vamos añadiendo las opciones de la pregunta correspondiente
                        preguntasAgrupadas[row.idPreguntaOtis].opciones.push({
                          idOpcionOtis: row.idOpcionOtis,
                          opcionOtis: row.opcionOtis,
                          descripcionOpcion: row.descripcionOpcion,
                          esCorrecta: row.esCorrecta === 1,
                          seleccionada: row.opcionSeleccionada === 1,
                        });

                        if (row.opcionSeleccionada === 1) {
                          preguntasAgrupadas[
                            row.idPreguntaOtis
                          ].tiempoRespuesta = row.tiempoRespuesta;
                          preguntasAgrupadas[row.idPreguntaOtis].contestada =
                            true;
                          preguntasAgrupadas[row.idPreguntaOtis].esCorrecta =
                            row.esCorrecta === 1;
                        }

                        if (
                          !preguntasAgrupadas[row.idPreguntaOtis].contestada
                        ) {
                          preguntasAgrupadas[row.idPreguntaOtis].esCorrecta =
                            null;
                        }
                      });

                      const respuestasAspitanteOtis =
                        Object.values(preguntasAgrupadas);

                      response.render("consultaRespuestasAspirante", {
                        isLoggedIn: request.session.isLoggedIn || false,
                        usuario: request.session.usuario || "",
                        csrfToken: request.csrfToken(),
                        privilegios: request.session.privilegios || [],
                        idUsuario: idUsuario,
                        prueba: "OTIS",
                        idPrueba: idPrueba,
                        grupo: grupoRows[0],
                        valores: null,
                        datos: datosAspirante[0],
                        interpretaciones: null,
                        respuestasCorrectas: respuestasCorrectas || 0,
                        tiempoTotal: tiempoTotal || 0,
                        respuestasAspitanteOtis: respuestasAspitanteOtis || [],
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
      });
    });
  });
};

exports.get_analisisOtis = (request, response, next) => {
  const idUsuario = request.params.idusuario;
  Aspirante.fetchOne(idUsuario).then(([datosAspirante, fieldData]) => {
    PerteneceGrupo.fetchOne(idUsuario).then(([rows, fieldData]) => {
      Grupo.fetchOneId(rows[0].idGrupo).then(([grupoRows, fieldData]) => {
        Prueba.getRespuestasOtis(idUsuario, rows[0].idGrupo)
          .then(([informacionAnalisis, fieldData]) => {
            Prueba.getPuntajeBrutoOtis(idUsuario, rows[0].idGrupo)
              .then(([puntaje, fieldData]) => {
                // console.log(idUsuario);
                const puntajeBruto = puntaje[0].puntajeBruto;
                // console.log("Informacion Analisis: ", informacionAnalisis);
                // console.log("Puntaje Bruto: ", puntajeBruto);
                response.render("analisisOtis", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: "OTIS",
                  grupo: grupoRows[0],
                  datos: datosAspirante[0],
                  informacionAnalisis: informacionAnalisis || [],
                  puntajeBruto: puntajeBruto || 0,
                  idAspirante: idUsuario || null,
                  idGrupo: rows[0].idGrupo || null,
                  idInstitucion: rows[0].institucion || null,
                  valores: null,
                  interpretaciones: null,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  });
};

exports.get_resultadosAspiranteK = (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  Aspirante.fetchOne(idUsuario).then(([datosAspirante, fieldData]) => {
    PerteneceGrupo.fetchOne(idUsuario).then(([rows, fieldData]) => {
      Grupo.fetchOneId(rows[0].idGrupo).then(([grupoRows, fieldData]) => {
        PreguntaKostick.fetchAll().then(([preguntasKostick]) => {
          RespondeKostick.fetchRespuestasAspirante(rows[0].idGrupo, idUsuario).then(([resultados]) => {
            const opciones = resultados.map(r => r.opcionKostick);
            const descripcionOpciones = resultados.map(r => r.descripcionOpcionKostick);
            response.render("respuestasAspiranteK", {
              isLoggedIn: request.session.isLoggedIn || false,
              usuario: request.session.usuario || "",
              csrfToken: request.csrfToken(),
              privilegios: request.session.privilegios || [],
              prueba: "El inventario de Percepción Kostick",
              grupo: grupoRows[0],
              valores: resultados[0][0],
              datos: datosAspirante[0],
              preguntas: preguntasKostick,
              opciones: opciones,
              descripcion: descripcionOpciones,
              aspirante: datosAspirante[0],
            });
          });
      });
    });
  });
})
};

exports.get_resultadosAspirante16 = (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  Aspirante.fetchOne(idUsuario).then(([datosAspirante, fieldData]) => {
    PerteneceGrupo.fetchOne(idUsuario).then(([rows, fieldData]) => {
      Grupo.fetchOneId(rows[0].idGrupo).then(([grupoRows, fieldData]) => {
        Pregunta16PF.fetchAll().then(([preguntas16PF]) => {
          Responde16PF.fetchRespuestasAspirante(rows[0].idGrupo, idUsuario).then(([resultados]) => {
            const opciones = resultados.map(r => r.opcion16PF);
            const descripcionOpciones = resultados.map(r => r.descripcionOpcion16PF);
            response.render("respuestasAspirante16", {
              isLoggedIn: request.session.isLoggedIn || false,
              usuario: request.session.usuario || "",
              csrfToken: request.csrfToken(),
              privilegios: request.session.privilegios || [],
              prueba: "Personalidad 16 Factores (16 PF)",
              grupo: grupoRows[0],
              valores: resultados[0][0],
              datos: datosAspirante[0],
              preguntas: preguntas16PF,
              opciones: opciones,
              descripcion: descripcionOpciones,
              aspirante: datosAspirante[0],
            });
          });
      });
    });
  });
})
};

exports.get_respuestasG = (request, response, next) => {
  response.render("consultaRespuestasGrupo", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.crear_grupo = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("crearGrupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      pruebas: rows,
    });
  });
};

exports.post_grupo = async (request, response, next) => {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const fechaGrupoInicioIOS = `${request.body.fechaPruebaGrupal}T${request.body.horaPruebaGrupal}:00`;
  const inicioDateGrupo = new Date(fechaGrupoInicioIOS);
  const finalDateGrupo = new Date(inicioDateGrupo.getTime() + 90 * 60000);
  const fechaGrupoFinalIOS = finalDateGrupo.toISOString();

  const mi_grupo = new Grupo(
    request.body.institucion,
    request.body.posgrado,
    request.body.generacion,
    request.body.fechaPruebaGrupal + " " + request.body.horaPruebaGrupal,
    request.body.enlaceZoom
  );

  try {
    let idAspirantes = [];
    await mi_grupo.save();

    const excelFile = request.file;

    if (excelFile) {
      const path = excelFile.path;
      const rows = await readXlsxFile(path);

      for (let i = 1; i < rows.length; i++) {
        const [
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          codigoIdentidad,
          correo,
          telefono,
          genero,
          pais,
          estado,
          universidadProcedencia,
        ] = rows[i];

        const mi_aspirante = new Aspirante(
          codigoIdentidad,
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
          genero,
          estado + " " + pais,
          correo,
          universidadProcedencia
        );

        await mi_aspirante.save();

        const mi_perteneceGrupoParcial = new PerteneceGrupoParcial(
          mi_grupo.idGrupo,
          mi_aspirante.idUsuario
        );

        await mi_perteneceGrupoParcial.saveParcial();

        const nombreUsuario =
          mi_aspirante.codigoIdentidad + new Date().getFullYear();
        const contraseñaBase = uuidv4();

        console.log("Usuario", nombreUsuario);
        console.log("Contraseña Base: " + contraseñaBase);

        await MSI.sendEmail(
          mi_aspirante.correo,
          mi_aspirante.nombres,
          nombreUsuario,
          contraseñaBase
        );

        const mi_usuario = new Usuario(
          mi_aspirante.idUsuario,
          nombreUsuario,
          contraseñaBase,
          "2"
        );

        await mi_usuario.save();
        idAspirantes.push(mi_aspirante.idUsuario);
      }
    } else {
      console.error("No se encontró el archivo de Excel.");
    }

    const eventoNuevo = new eventoGoogle(
      `Sesion Grupal de: ${request.body.institucion} para el posgrado ${request.body.posgrado}`,
      "Zoom",
      `Sesion Grupal con ${request.body.posgrado}, ${request.body.institucion}. \n LINK: ${request.body.enlaceZoom}`,
      fechaGrupoInicioIOS,
      fechaGrupoFinalIOS
    );

    const eventoCreado = {
      summary: eventoNuevo.nombre,
      location: eventoNuevo.lugar,
      description: eventoNuevo.descripcion,
      start: {
        dateTime: eventoNuevo.inicio,
        timeZone: "America/Mexico_City",
      },
      end: {
        dateTime: eventoNuevo.final,
        timeZone: "America/Mexico_City",
      },
    };

    calendar.events.insert(
      {
        calendarId: "primary",
        resource: eventoCreado,
      },
      (err, ev) => {
        if (err) {
          console.error("Error creando evento: " + err);
        } else {
          console.log("EXITO AL CREAR EVENTO");
        }
      }
    );

    const pruebas = Array.isArray(request.body.pruebasOpcion)
      ? request.body.pruebasOpcion
      : [request.body.pruebasOpcion];

    const promesas = pruebas.map((prueba) => {
      return Prueba.fetchOneNombre(prueba).then(([rows]) => {
        const idPrueba = rows[0]?.idPrueba;

        for (let i = 0; i < idAspirantes.length; i++) {
          Aspirante.asignaPruebas(idAspirantes[i], mi_grupo.idGrupo, idPrueba);
        }

        const mi_tienePruebas = new TienePruebas(
          mi_grupo.idGrupo,
          idPrueba,
          request.body.fechaLimite
        );

        return mi_tienePruebas.save();
      });
    });

    await Promise.all(promesas);

    request.session.info = "Grupo creado exitosamente";
    request.session.grupoCreado = {
      id: mi_grupo.idGrupo,
      posgrado: mi_grupo.posgrado,
      generacion: mi_grupo.generacion,
      institucion: mi_grupo.institucion,
    };
    response.redirect("/psicologa/grupo/confirmarCreacion");
  } catch (error) {
    console.log("Error al crear grupo o asignar pruebas:", error);
    response.status(500).send("Error al procesar la creación del grupo.");
  }
};

exports.confirmar_creacion_grupo = (request, response, next) => {
  const info = request.session.info;
  const grupo = request.session.grupoCreado;

  // Limpiar sesión
  delete request.session.info;
  delete request.session.grupoCreado;

  response.render("confirmarCreacionGrupo", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    info: info,
    grupo: grupo,
  });
};

exports.elegir_grupo = (request, response, next) => {
  const mensaje = request.session.infoBorrado;
  request.session.infoBorrado = undefined;
  Grupo.fetchAll().then(([rows]) => {
    response.render("elegirGrupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupos: rows,
      infoBorrado: mensaje,
    });
  });
};

exports.get_grupo = (request, response, next) => {
  const numGrupo = request.params.id;
  Grupo.fetchOneId(numGrupo).then(([rows]) => {
    response.render("consultaGrupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupo: rows[0],
    });
  });
};

exports.registra_reporte_grupo = (request, response, next) => {
  const numGrupo = request.params.id;
  Grupo.fetchOneId(numGrupo).then(([rows]) => {
    response.render("registrarReporteGrupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupo: rows[0],
    });
  });
};

exports.post_registra_reporte_grupo = (request, response, next) => {
  const idGrupo = request.params.id;
  let archivoPdf = request.file.filename;
  Grupo.update_subirReporte(idGrupo, archivoPdf).then(() => {
    response.redirect("/psicologa/grupo/" + idGrupo);
  });
};

exports.registra_foda_grupo = (request, response, next) => {
  const numGrupo = request.params.id;

  Grupo.fetchOneId(numGrupo).then(([rows]) => {
    response.render("registrarFodaGrupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupo: rows[0],
    });
  });
};

exports.post_registra_foda_grupo = (request, response, next) => {
  const idGrupo = request.params.id;
  let archivoFoda = request.file.filename;

  Grupo.update_subirFoda(idGrupo, archivoFoda).then(() => {
    response.redirect("/psicologa/grupo/" + idGrupo);
  });
};

/* Función que sirve como controlador para renderizar la vista para modificar la información de un grupo */
exports.get_modificarGrupo = (request, response, next) => {
  const idGrupo = request.params.id;
  Prueba.fetchAll().then(([pruebas]) => {
    Grupo.fetchOneId(idGrupo).then(([rows]) => {
      TienePruebas.getFecha(idGrupo).then(([tienePruebas]) => {
        response.render("modificarGrupo", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          grupo: rows[0],
          pruebas: pruebas,
          idGrupo: request.params.id,
          tienePruebas: tienePruebas[0],
        });
      });
    });
  });
};

/* Función que sirve como controlador para guardar los cambios realizados en la información de un grupo */
exports.post_modificarGrupo = (request, response, next) => {
  console.log(request.body);
  institucion = request.body.institucion;
  posgrado = request.body.posgrado;
  generacion = request.body.generacion;
  fechaPruebaGrupal =
    request.body.fechaPruebaGrupal + " " + request.body.horaPruebaGrupal;
  enlaceZoom = request.body.enlaceZoom;
  idGrupo = request.body.idGrupo;
  fechaLimitePrueba = request.body.fechaLimite;
  Grupo.updateGrupo(
    institucion,
    posgrado,
    generacion,
    fechaPruebaGrupal,
    enlaceZoom,
    idGrupo
  ).then(() => {
    TienePruebas.updateGrupo(fechaLimitePrueba, idGrupo).then(() => {
      response.redirect("/psicologa/grupo/elegir");
    });
  });
};

/* Función que sirve como controlador para renderizar la vista para modificar la información de un aspirante */
exports.get_modificarAspirante = (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  Aspirante.fetchOne(idUsuario).then(([aspirante]) => {
    PerteneceGrupo.fetchOne(idUsuario).then(([perteneceGrupo]) => {
      request.session.idUsuario = idUsuario;
      response.render("modificarAspirante", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        aspirante: aspirante[0],
        perteneceGrupo: perteneceGrupo[0],
        idUsuario: request.session.idUsuario,
      });
    });
  });
};

/* Función que sirve como controlador para guardar los cambios realizados en la información de un aspirante */
exports.post_modificarAspirante = (request, response, next) => {
  console.log("Modificar Aspirante", request.body);
  nombres = request.body.nombres;
  apellidoPaterno = request.body.apellidoPaterno;
  apellidoMaterno = request.body.apellidoMaterno;
  codigoIdentidad = request.body.codigoIdentidad;
  numTelefono = request.body.numTelefono;
  genero = request.body.genero;
  lugarOrigen = request.body.lugarOrigen;
  correo = request.body.correo;
  universidadOrigen = request.body.universidadOrigen;
  fechaZoomIndividual =
    request.body.fechaZoomIndividual + " " + request.body.horaSesionIndividual;
  enlaceZoom = request.body.enlaceZoom;
  idUsuario = request.params.idUsuario;
  Aspirante.updateAspirante(
    codigoIdentidad,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    numTelefono,
    genero,
    lugarOrigen,
    correo,
    universidadOrigen,
    idUsuario
  ).then(() => {
    PerteneceGrupo.updatePerteneceGrupo(
      fechaZoomIndividual,
      enlaceZoom,
      idUsuario
    ).then(() => {
      response.redirect("/psicologa/consultaAspirante");
    });
  });
};

exports.get_reporteAspirante = (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  Aspirante.fetchOne(idUsuario).then(([aspirante]) => {
    FormatoEntrevista.fetchOne(idUsuario).then(([formatoEntrevista])=>{
      console.log("log ",formatoEntrevista)
      request.session.idUsuario = idUsuario;
      response.render("reporteAspirante", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        aspirante: aspirante[0],
        idUsuario: request.session.idUsuario,
        formatoEntrevista: formatoEntrevista[0],
    })
    });
  });
};

exports.get_consultarReporteAspirante = (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  Aspirante.fetchOne(idUsuario).then(([aspirante]) => {
    PerteneceGrupo.consultarReporte(idUsuario).then(([documentos]) => {
      request.session.idUsuario = idUsuario;
      response.render("consultarReporteAspirante", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        aspirante: aspirante[0],
        idUsuario: request.session.idUsuario,
        documentos: documentos[0],
      });
    });
  });
};

exports.getPdfFile = (request, response, next) => {
  const filename = request.params.filename;
  const filePath = path.join(__dirname, "../public/uploads", filename);

  response.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      response.status(err.status).end();
    }
  });
};

/* Función que sirve como controlador para cerrar la sesión */
exports.get_logout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect("/");
  });
};

exports.getPreguntaSeguridad = (request, response, next) => {
  const idGrupo = request.params.id;
  response.render("preguntaSeguridadBorrado.ejs", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    grupo: idGrupo,
  });
};

exports.postPreguntaSeguridad = (request, response, next) => {
  console.log(request.body);
  Usuario.fetchOne(request.body.usuario).then(([rows, fieldData]) => {
    if (rows.length > 0) {
      const bcrypt = require("bcryptjs");
      bcrypt
        .compare(request.body.contra, rows[0].contraseña)
        .then((doMatch) => {
          if (doMatch) {
            Grupo.borrarGrupo(request.body.grupo);
            request.session.infoBorrado = "Grupo borrado exitosamente";
            response.redirect("/psicologa/inicio");
            console.log("Grupo borrado");
          } else {
            request.session.infoBorrado =
              "Lo siento, la contraseña es incorrecta! Intenta nuevamente.";
            response.redirect("/psicologa/grupo/elegir");
            console.log("Grupo no borrado");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

exports.get_pruebasActivas = (request, response, next) => {
  Prueba.pruebasActivas(request.params.valor)
    .then(([rows]) => {
      response.status(200).json({ pruebas: rows });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_kostickActiva = (request, response, next) => {
  Prueba.kostickActiva(request.params.valor)
    .then(([rows]) => {
      const kostickTiempo = {
        tiempo: rows[0].tiempo || "-",
      };
      response.status(200).json({ kostickTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_P16PFActiva = (request, response, next) => {
  Prueba.P16PFActiva(request.params.valor)
    .then(([rows]) => {
      const P16PFTiempo = {
        tiempo: rows[0].tiempo || "-",
      };
      response.status(200).json({ P16PFTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_termanActiva = (request, response, next) => {
  Prueba.termanActiva(request.params.valor)
    .then(([rows]) => {
      const termanTiempo = {
        tiempo: rows[0].tiempo || "-",
      };
      response.status(200).json({ termanTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_otisActiva = (request, response, next) => {
  Prueba.otisActiva(request.params.valor)
    .then(([rows]) => {
      const otisTiempo = {
        tiempo: rows[0].tiempo || "-",
      };
      response.status(200).json({ otisTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.getOauthAuthenticator = (request, response, next) => {
  const url = oauth2Client.generateAuthUrl({
    acces_type: "offline",
    scope: "https://www.googleapis.com/auth/calendar.events",
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
    response.redirect("inicio");
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
      response.render("calendarioPsicologa", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        idUsuario: request.session.idUsuario || "",
        infoEventos: request.session.eventos,
      });
    }
  );
};

exports.registraReporte = (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  Aspirante.fetchOne(idUsuario).then(([aspirante]) => {
    response.render("registraReporte", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      aspirante: aspirante[0],
      idUsuario: request.session.idUsuario || "",
    });
  });
};

exports.post_registraReporte = (request, response, next) => {
  let reporte = request.file.filename;
  let idUsuario = request.params.idUsuario;
  Aspirante.update_subirReporte(idUsuario, reporte).then(() => {
    response.redirect("/psicologa/reporteAspirante/" + idUsuario);
  });
};

exports.get_formatoEntrevista = async (request, response, next) => {
  const idUsuario = request.params.idUsuario;
  try {
    const [[aspirantes]] = await Aspirante.fetchOne(idUsuario);
    const [[formatoEntrevista]] = await FormatoEntrevista.fetchOne(idUsuario);
    console.log(formatoEntrevista);

    const promesasPreguntas = [];
    const promesasRespuestas = [];
    console.log(formatoEntrevista.idFormato);
    for (let i = 1; i < 20; i++) {
      promesasRespuestas.push(
        PreguntasFormato.fetchPregunta(i, formatoEntrevista.idFormato)
      );
    }
    const respuestas = await Promise.all(promesasRespuestas);
    const preguntas = await Promise.all(promesasPreguntas);
    Familiar.fetchFamiliares(formatoEntrevista.idFormato).then(([familiares])=>{
      response.render("consultarFormatoEntrevista", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        aspirante: aspirantes,
        idUsuario: request.session.idUsuario || "",
        formatoEntrevista: formatoEntrevista,
        respuestasPreguntas: respuestas,
        preguntas: preguntas,
        familia: familiares,
    })
    
    
    });
  } catch (error) {
    console.error("Error al sacar preguntas:", error);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getAnalisisOtis = (request, response, next) => {
  Prueba.getRespuestasOtis(request.params.idUsuario, request.params.idGrupo)
    .then(([rows, fieldData]) => {
      const informacionAnalisis = rows;
      PruebaV.getPuntajeBrutoOtis(
        request.params.idUsuario,
        request.params.idGrupo
      )
        .then(([rows, fieldData]) => {
          const puntajeBruto = rows[0].puntajeBruto;
          console.log("Informacion Analisis: ", informacionAnalisis);
          console.log("Puntaje Bruto: ", puntajeBruto);
          response.render("Psicologos/analisisOtis.ejs", {
            informacionAnalisis: informacionAnalisis || [],
            puntajeBruto: puntajeBruto || 0,
            idUsuario: request.params.idUsuario || null,
            idGrupo: request.params.idGrupo || null,
            idInstitucion: request.params.idInstitucion || null,
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

/*
 * CUADERNILLO OTIS
 */
// Controlador para manejar la obtención del cuadernillo de respuestas OTIS.
exports.getCuadernilloOtis = (request, response, next) => {
  // Obtiene los datos personales del aspirante
  PruebaV.getDatosPersonalesAspiranteOtis(
    request.params.idGrupo,
    request.params.idUsuario
  )
    .then(([rows, fieldData]) => {
      const datosPersonales = rows;
      // Obtiene las respuestas correctas del aspirante
      Cuadernillo.getRespuestasCorrectas(
        request.params.idGrupo,
        request.params.idUsuario
      )
        .then(([rows, fieldData]) => {
          const respuestasCorrectas = rows[0].RespuestasCorrectas;
          // Obtiene el tiempo total que tomo el aspirante para completar la prueba
          Cuadernillo.getTiempoTotal(
            request.params.idGrupo,
            request.params.idUsuario
          )
            .then(([rows, fieldData]) => {
              const tiempoTotal = rows[0].Tiempo;
              // Obtiene las preguntas, opciones y la respuesta del aspirante
              Cuadernillo.getRespuestasOtisAspirante(
                request.params.idGrupo,
                request.params.idUsuario
              )
                .then(([rows, fieldData]) => {
                  const preguntasAgrupadas = {};

                  rows.forEach((row) => {
                    // Creamos el objeto de pregunta si este no existe
                    if (!preguntasAgrupadas[row.idPreguntaOtis]) {
                      preguntasAgrupadas[row.idPreguntaOtis] = {
                        idPreguntaOtis: row.idPreguntaOtis,
                        numeroPregunta: row.numeroPregunta,
                        preguntaOtis: row.preguntaOtis,
                        opciones: [],
                        esCorrecta: false,
                        tiempoRespuesta: 0,
                        contestada: null,
                      };
                    }
                    // Vamos añadiendo las opciones de la pregunta correspondiente
                    preguntasAgrupadas[row.idPreguntaOtis].opciones.push({
                      idOpcionOtis: row.idOpcionOtis,
                      opcionOtis: row.opcionOtis,
                      descripcionOpcion: row.descripcionOpcion,
                      esCorrecta: row.esCorrecta === 1,
                      seleccionada: row.opcionSeleccionada === 1,
                    });

                    if (row.opcionSeleccionada === 1) {
                      preguntasAgrupadas[row.idPreguntaOtis].tiempoRespuesta =
                        row.tiempoRespuesta;
                      preguntasAgrupadas[row.idPreguntaOtis].contestada = true;
                      preguntasAgrupadas[row.idPreguntaOtis].esCorrecta =
                        row.esCorrecta === 1;
                    }

                    if (!preguntasAgrupadas[row.idPreguntaOtis].contestada) {
                      preguntasAgrupadas[row.idPreguntaOtis].esCorrecta = null;
                    }
                  });

                  const respuestasAspitanteOtis =
                    Object.values(preguntasAgrupadas);

                  response.render("Psicologos/cuadernilloRespuestasOtis.ejs", {
                    datosPersonales: datosPersonales || [],
                    respuestasCorrectas: respuestasCorrectas || 0,
                    tiempoTotal: tiempoTotal || 0,
                    respuestasAspitanteOtis: respuestasAspitanteOtis || [],
                    aspirante: request.params.idUsuario || null,
                    grupo: request.params.idGrupo || null,
                    idInstitucion: request.params.idInstitucion || null,
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
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getPruebaOtis = (request, response, next) => {
  console.log("Prueba OTIS");
  response.render("Psicologos/infoPruebaOtis");
};

exports.getPruebaColores = (request, response, next) => {
  response.send("Prueba Colores");
};

/*
 * CUADERNILLO COLORES
 */
exports.getCuadernilloColores = (request, response, next) => {
  // Obtener los datos personales del aspirante
  Aspirante.fetchOne(request.params.idUsuario).then(([aspirante]) => {
    Usuario.getGrupo(request.params.idUsuario)
      .then(([grupo]) => {
        // Obtener todas las selecciones de colores
        CuadernilloColores.getSeleccionesColores(
          grupo[0].idGrupo,
          request.params.idUsuario
        )
          .then(([rows, fieldData]) => {
            // Separar las selecciones por fase
            const seleccionesFase1 = rows
              .filter((row) => row.fase === 1)
              .sort((a, b) => a.posicion - b.posicion);
            const seleccionesFase2 = rows
              .filter((row) => row.fase === 2)
              .sort((a, b) => a.posicion - b.posicion);
            request.session.idGrupo = grupo[0].idGrupo;
            request.session.idUsuario = request.params.idUsuario;
            response.render("cuadernilloColores", {
              seleccionesFase1: seleccionesFase1 || [],
              seleccionesFase2: seleccionesFase2 || [],
              aspirante: aspirante[0] || null,
              grupo: grupo || null,
              isLoggedIn: request.session.isLoggedIn || false,
              usuario: request.session.usuario || "",
              csrfToken: request.csrfToken(),
              privilegios: request.session.privilegios || [],
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

/*
 * ANÁLISIS COLORES
 */
/*
ANALISIS COLORES
*/

function obtenerZona(posicion) {
  if (posicion <= 1) return "+";
  if (posicion <= 3) return "X";
  if (posicion <= 5) return "=";
  return "-";
}

function mapearZona(zonaCruda) {
  if (
    zonaCruda === "+-" ||
    zonaCruda === "X-" ||
    zonaCruda === "-+" ||
    zonaCruda === "X=" ||
    zonaCruda === "=X" ||
    zonaCruda === "=-" ||
    zonaCruda === "-="
  ) {
    return zonaCruda;
  }

  switch (zonaCruda) {
    case "+-X":
    case "X-+":
    case "+-+":
      return "++";
    case "--=":
    case "=--":
    case "---":
      return "--";
    case "==-":
    case "=-=":
      return "==";
    case "X-=":
    case "=-X":
      return "+-";
    case "X-X":
      return "XX";
    default:
      return zonaCruda.split("-").sort().join("");
  }
}

function obtenerParejasConZona(selecciones) {
  const pares = new Map();
  for (let i = 0; i < selecciones.length - 1; i++) {
    const a = selecciones[i];
    const b = selecciones[i + 1];
    const clave = `${a.numeroColor}-${b.numeroColor}`;

    const zonaCruda = `${obtenerZona(a.posicion)}-${obtenerZona(b.posicion)}`;
    const zona = mapearZona(zonaCruda);

    if (!pares.has(clave)) {
      pares.set(clave, []);
    }
    pares.get(clave).push(zona);
  }
  return pares;
}

function filtrarParejasNaturalesYDisociadas(paresF1, paresF2) {
  const todasClaves = new Set([...paresF1.keys(), ...paresF2.keys()]);
  const zonasClave = new Set(["++", "--", "==", "XX"]);
  const resultado = [];

  for (let clave of todasClaves) {
    const [c1, c2] = clave.split("-").map(Number);
    const claveNorm = c1 < c2 ? `${c1}-${c2}` : `${c2}-${c1}`;

    const zonasF1 = paresF1.get(claveNorm) || [];
    const zonasF2 = paresF2.get(claveNorm) || [];

    const zonaF1 = zonasF1[0] || null;
    const zonaF2 = zonasF2[0] || null;

    const enF1 = zonasF1.length > 0;
    const enF2 = zonasF2.length > 0;

    const esZonaValida = (zona) => zonasClave.has(zona);

    const esNatural = enF1 && enF2 && zonaF1 === zonaF2 && esZonaValida(zonaF1);
    const esDisociada =
      enF1 &&
      enF2 &&
      zonaF1 !== zonaF2 &&
      esZonaValida(zonaF1) &&
      esZonaValida(zonaF2);

    if (esNatural || esDisociada) {
      resultado.push({
        pareja: claveNorm,
        tipo: esNatural ? "natural" : "disociada",
        zonas: { fase1: zonaF1 || "N/A", fase2: zonaF2 || "N/A" },
      });
    }
  }

  return resultado.filter(
    (par) =>
      (par.zonas.fase1 && zonasClave.has(par.zonas.fase1)) ||
      (par.zonas.fase2 && zonasClave.has(par.zonas.fase2))
  );
}

function filtrarParejasArtificiales(
  paresF1,
  paresF2,
  parejasNaturalesYDisociadas = [],
  seleccionesF1 = [],
  seleccionesF2 = []
) {
  const todasClaves = new Set([...paresF1.keys(), ...paresF2.keys()]);
  const resultado = [];

  const esParejaClasificada = (clave) => {
    const claveInversa = clave.split("-").reverse().join("-");
    return parejasNaturalesYDisociadas.some(
      (p) => p.pareja === clave || p.pareja === claveInversa
    );
  };

  const esPosicionValida = (a, b) => {
    const posicionesValidas = [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
    ];
    return posicionesValidas.some(
      (pair) =>
        (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a)
    );
  };

  const obtenerPosicionDeColor = (selecciones, numeroColor) => {
    for (let i = 0; i < selecciones.length; i++) {
      if (selecciones[i].numeroColor === numeroColor) {
        return selecciones[i].posicion;
      }
    }
    return null;
  };

  for (let clave of todasClaves) {
    const zonasF1 = paresF1.get(clave) || [];
    const zonasF2 = paresF2.get(clave) || [];

    const zonaF1 = zonasF1[0] || null;
    const zonaF2 = zonasF2[0] || null;

    const enF1 = zonasF1.length > 0;
    const enF2 = zonasF2.length > 0;

    if (esParejaClasificada(clave)) continue;

    const [colorA, colorB] = clave.split("-").map(Number);

    const posA_f1 = obtenerPosicionDeColor(seleccionesF1, colorA);
    const posB_f1 = obtenerPosicionDeColor(seleccionesF1, colorB);
    const posA_f2 = obtenerPosicionDeColor(seleccionesF2, colorA);
    const posB_f2 = obtenerPosicionDeColor(seleccionesF2, colorB);

    const parejaEsValida =
      esPosicionValida(posA_f1, posB_f1) || esPosicionValida(posA_f2, posB_f2);

    if (parejaEsValida) {
      if (enF1 && !enF2 && zonaF1 !== "+-" && zonaF1 !== undefined) {
        resultado.push({
          pareja: clave,
          tipo: "artificial",
          zonas: { fase1: zonaF1 || "N/A" },
        });
      } else if (enF2 && !enF1 && zonaF2 !== "+-" && zonaF2 !== undefined) {
        resultado.push({
          pareja: clave,
          tipo: "artificial",
          zonas: { fase2: zonaF2 || "N/A" },
        });
      }
    }
  }

  return resultado;
}

function obtenerInterpretacion(zona1, zona2, pareja) {
  if (zona1 === "N/A" || zona2 === "N/A") {
    return "Interpretación no disponible para esta combinación.";
  }

  const numeros = pareja.match(/\d+/g);
  if (!numeros || numeros.length !== 2) {
    return "Interpretación no disponible para esta combinación.";
  }

  const parejaNormalizada = `${numeros[0]}-${numeros[1]}`;
  const claveDirecta = `${zona1}|${parejaNormalizada}`;
  const claveInvertida = `${zona2}|${numeros[1]}-${numeros[0]}`;

  if (interpretaciones[claveDirecta]) {
    return interpretaciones[claveDirecta];
  } else if (interpretaciones[claveInvertida]) {
    return interpretaciones[claveInvertida];
  } else {
    return "Interpretación no disponible para esta combinación.";
  }
}

function obtenerParejasClasificadas(seleccionesFase1, seleccionesFase2) {
  const paresF1 = obtenerParejasConZona(seleccionesFase1);
  const paresF2 = obtenerParejasConZona(seleccionesFase2);

  const resultadoNaturalesYDisociadas = filtrarParejasNaturalesYDisociadas(
    paresF1,
    paresF2
  );
  const resultadoArtificiales = filtrarParejasArtificiales(
    paresF1,
    paresF2,
    resultadoNaturalesYDisociadas,
    seleccionesFase1,
    seleccionesFase2
  );

  // Agregar interpretaciones
  const agregarInterpretaciones = (parejas) => {
    return parejas.map((p) => {
      const textoFase1 = obtenerInterpretacion(
        p.zonas.fase1,
        p.zonas.fase2,
        p.pareja
      );
      const textoFase2 = obtenerInterpretacion(
        p.zonas.fase2,
        p.zonas.fase1,
        p.pareja
      );

      if (!p.zonas.fase1 || !p.zonas.fase2) {
        return {
          ...p,
          texto: {
            fase1: "Interpretación no disponible para esta combinación.",
            fase2: "Interpretación no disponible para esta combinación.",
          },
        };
      }

      return { ...p, texto: { fase1: textoFase1, fase2: textoFase2 } };
    });
  };

  return [
    ...agregarInterpretaciones(resultadoNaturalesYDisociadas),
    ...resultadoArtificiales,
  ];
}

exports.getAnalisisColores = async (request, response, next) => {
  const idGrupo = request.session.idGrupo;
  const idUsuario = request.session.idUsuario;
  try {
    // Obtener selecciones de colores completas
    const [seleccionesColoresRows] =
      await CuadernilloColores.getSeleccionesColores(idGrupo, idUsuario);

    // Separar selecciones por fase
    const seleccionesFase1 = seleccionesColoresRows
      .filter((row) => row.fase === 1)
      .sort((a, b) => a.posicion - b.posicion);
    const seleccionesFase2 = seleccionesColoresRows
      .filter((row) => row.fase === 2)
      .sort((a, b) => a.posicion - b.posicion);

    // Calcular parejas naturales
    const parejas = obtenerParejasClasificadas(
      seleccionesFase1,
      seleccionesFase2
    );

    // Obtener resultados de análisis
    const [rows] = await Prueba.getRespuestasColores(idUsuario, idGrupo);

    // Calcular movilidad
    const movilidad = calcularMovilidad(seleccionesFase1, seleccionesFase2);

    // Interpretar resultado de movilidad
    const interpretacionMovilidad = interpretarMovilidad(movilidad);

    // Inicializar arrays para resultadosFase1 y resultadosFase2
    const resultadosFase1 = [];
    const resultadosFase2 = [];

    const colores = {
      0: { nombre: "Gris", significado: "Participación", tipo: "No laboral" },
      1: { nombre: "Azul", significado: "Paciencia", tipo: "Laboral" },
      2: { nombre: "Verde", significado: "Productividad", tipo: "Laboral" },
      3: { nombre: "Rojo", significado: "Empuje/Agresividad", tipo: "Laboral" },
      4: { nombre: "Amarillo", significado: "Sociabilidad", tipo: "Laboral" },
      5: { nombre: "Morado", significado: "Creatividad", tipo: "Laboral" },
      6: { nombre: "Café", significado: "Vigor", tipo: "No laboral" },
      7: { nombre: "Negro", significado: "Satisfacción", tipo: "No laboral" },
      8: { nombre: "Gris", significado: "Participación", tipo: "No laboral" },
    };

    rows.forEach(({ fase, idColor, posicion }) => {
      const info = colores[idColor] || {
        nombre: "Desconocido",
        significado: "",
        tipo: "Desconocido",
      };

      let porcentaje;

      if (info.tipo === "No laboral") {
        porcentaje = 20 + posicion * 10;
        if (porcentaje <= 50) porcentaje -= 10;
      } else {
        porcentaje = 90 - posicion * 10;
        if (porcentaje <= 50) porcentaje -= 10;
      }

      const resultado = {
        color: info.nombre,
        significado: info.significado,
        tipo: info.tipo,
        porcentaje,
      };

      if (fase === 1) {
        resultadosFase1.push(resultado);
      } else if (fase === 2) {
        resultadosFase2.push(resultado);
      }
    });

    function agregarInterpretaciones(parejas) {
      return parejas.map((p) => {
        const textoFase1 = obtenerInterpretacion(
          p.zonas.fase1,
          p.zonas.fase2,
          p.pareja
        );
        const textoFase2 = obtenerInterpretacion(
          p.zonas.fase2,
          p.zonas.fase1,
          p.pareja
        );

        if (p.zonas.fase1 === "N/A" || p.zonas.fase2 === "N/A") {
          return {
            ...p,
            texto: {
              fase1: "Interpretación no disponible para esta combinación.",
              fase2: "Interpretación no disponible para esta combinación.",
            },
          };
        }

        return { ...p, texto: { fase1: textoFase1, fase2: textoFase2 } };
      });
    }

    const parejasNormalizadas = parejas.map((p) => {
      const numeros = p.pareja.match(/\d+/g);
      if (!numeros || numeros.length !== 2) {
        return p;
      }

      return {
        ...p,
        pareja: `${numeros[0]}-${numeros[1]}`,
      };
    });

    const parejasConInterpretaciones =
      agregarInterpretaciones(parejasNormalizadas);
    Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
      // Renderizar la vista con todos los datos
      response.render("analisisColores", {
        seleccionesFase1: seleccionesFase1 || [],
        seleccionesFase2: seleccionesFase2 || [],
        resultadosFase1,
        resultadosFase2,
        movilidad,
        interpretacionMovilidad,
        parejas: parejasConInterpretaciones,
        idGrupo,
        idUsuario,
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        aspirante: aspirante[0],
      });
    });
  } catch (error) {
    console.error("Error al obtener análisis de colores:", error);
  }
};

// Calcular la movilidad
function calcularMovilidad(seleccionesFase1, seleccionesFase2) {
  let positivosTotales = 0;
  let negativosTotales = 0;

  const posicionesFase1 = {};
  seleccionesFase1.forEach((seleccion) => {
    posicionesFase1[seleccion.idColor] = seleccion.posicion;
  });

  // Comparar con las posiciones en la fase 2
  seleccionesFase2.forEach((seleccion) => {
    const posicionFase1 = posicionesFase1[seleccion.idColor];
    const posicionFase2 = seleccion.posicion;
    const desplazamiento = posicionFase1 - posicionFase2;

    // Positivo = mover a la derecha
    if (desplazamiento < 0) {
      positivosTotales += Math.abs(desplazamiento);
    }
    // Negativo = mover a la izquierda
    else if (desplazamiento > 0) {
      negativosTotales += desplazamiento;
    }
  });

  return {
    positivos: positivosTotales,
    negativos: negativosTotales,
  };
}

// Interpretar el resultado de movilidad
function interpretarMovilidad(movilidad) {
  const totalPositivos = movilidad.positivos;
  const totalNegativos = movilidad.negativos;
  const valorAbsoluto = Math.max(totalPositivos, totalNegativos);

  if (totalPositivos === 0 && totalNegativos === 0) {
    return "RIGIDEZ (TERCO)";
  } else if (valorAbsoluto <= 1) {
    return "PERSONA DE MENTE ABIERTA Y DISPUESTA AL DIÁLOGO";
  } else if (valorAbsoluto <= 2) {
    return "PERSONA DISPUESTA A DIALOGAR (MENOR GRADO)";
  } else if (valorAbsoluto <= 3) {
    return "PERSONA DISPUESTA A DIALOGAR (MUCHO MENOR GRADO)";
  } else {
    return "PERSONA INESTABLE";
  }
}

exports.get_interpretaciones16PF = (request, response, next) => {
  let columna = request.params.columna;
  let nivel = request.params.nivel;
  Interpretaciones16PF.interpretacion(columna, nivel).then(([rows]) => {
    if (rows.length > 0) {
      inter = rows[0].resp;
      response.status(200).json({ inter });
    }
  });
};
exports.getPreguntaSeguridadAspirante = (request, response, next) => {
  const idAspirante = request.params.id;
  response.render("preguntaSeguridadBorradoAspirante.ejs", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    aspirante: idAspirante,
  });
};

exports.postPreguntaSeguridadAspirante = (request, response, next) => {
  console.log(request.body);
  Usuario.fetchOne(request.body.usuario).then(([rows, fieldData]) => {
    if (rows.length > 0) {
      const bcrypt = require("bcryptjs");
      bcrypt
        .compare(request.body.contra, rows[0].contraseña)
        .then((doMatch) => {
          if (doMatch) {
            Aspirante.borrarAspirante(request.body.aspirante);
            request.session.infoBorrado = "Aspirante borrado exitosamente";
            response.redirect("/psicologa/inicio");
            console.log("Aspirante borrado");
          } else {
            request.session.infoBorrado =
              "Lo siento, la contraseña es incorrecta! Intenta nuevamente.";
            response.redirect("/psicologa/grupo/elegir");
            console.log("Grupo no borrado");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};

const {
  buscarValor, // Importa la función
  DIM,
  DIF,
  dimGeneral,
  dimPorcentaje,
  INT,
  DI,
  DIS,
  VQ,
  Equilibrio_BQR,
  Equilibrio_BQA,
  Equilibrio_CQ1,
  Equilibrio_CQ2,
} = require("../public/js/encuentraValor");
const preguntasFormato = require("../model/preguntasFormato.model");
const { Console } = require("console");
const RespondeKostick = require("../model/kostick/respondeKostick.model");
const Responde16PF = require("../model/16pf/responde16pf.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");

/*
 *   OBTIENE ANALISIS DE HARTMAN DE LA BASE DE DATOS
 */

exports.get_analisisHartman = async (request, response, next) => {
  console.log("Comienza_el_analisis");

  const idAspirante = request.session.idUsuario;
  const idGrupo = request.session.idGrupoAspirante;
  console.log(idAspirante);
  console.log(idGrupo);

  console.log("Analisis Hartman");

  try {
    const [rows] = await ConsultaResultados.fetchHartmanAspirante(
      idAspirante,
      idGrupo
    );
    console.log("Datos de la base de datos:", rows);

    if (!rows || rows.length === 0) {
      return response
        .status(404)
        .send("No se encontraron resultados de Hartman.");
    }

    // Procesa los datos del analisis de hartman para poder graficarlos
    const analisisProcesado = {
      MundoInterno: {
        DimI: rows[0].citaDimI != null ? buscarValor(rows[0].citaDimI, DIM) : 0,
        DimE: rows[0].citaDimE != null ? buscarValor(rows[0].citaDimE, DIM) : 0,
        DimS: rows[0].citaDimS != null ? buscarValor(rows[0].citaDimS, DIM) : 0,
        DiF: rows[0].citaDif != null ? buscarValor(rows[0].citaDif, DIF) : 0,
        DimGeneral:
          rows[0].citaDimGeneral != null
            ? buscarValor(rows[0].citaDimGeneral, dimGeneral)
            : 0,
        DimPorcentaje:
          rows[0].citaDimPorcentaje != null
            ? buscarValor(rows[0].citaDimPorcentaje, dimPorcentaje)
            : 0,
        IntI: rows[0].citaIntI != null ? buscarValor(rows[0].citaIntI, INT) : 0,
        IntE: rows[0].citaIntE != null ? buscarValor(rows[0].citaIntE, INT) : 0,
        IntS: rows[0].citaIntS != null ? buscarValor(rows[0].citaIntS, INT) : 0,
        IntGeneral:
          rows[0].citaIntGeneral != null
            ? buscarValor(rows[0].citaIntGeneral, DIM)
            : 0,
        IntPorcentaje:
          rows[0].citaIntPorcentaje != null
            ? buscarValor(rows[0].citaIntPorcentaje, dimPorcentaje)
            : 0,
        Di: rows[0].citaDi != null ? buscarValor(rows[0].citaDi, DI) : 0,
        Dis: rows[0].citaDIS != null ? buscarValor(rows[0].citaDIS, DIS) : 0,
        Sq1: rows[0].citaSQ1 != null ? buscarValor(rows[0].citaSQ1, VQ) : 0,
        Sq2: rows[0].citaSQ2 != null ? buscarValor(rows[0].citaSQ2, DIM) : 0,
      },
      MundoExterno: {
        DimI:
          rows[0].fraseDimI != null ? buscarValor(rows[0].fraseDimI, DIM) : 0,
        DimE:
          rows[0].fraseDimE != null ? buscarValor(rows[0].fraseDimE, DIM) : 0,
        DimS:
          rows[0].fraseDimS != null ? buscarValor(rows[0].fraseDimS, DIM) : 0,
        DiF: rows[0].fraseDif != null ? buscarValor(rows[0].fraseDif, DIF) : 0,
        DimGeneral:
          rows[0].fraseDimGeneral != null
            ? buscarValor(rows[0].fraseDimGeneral, dimGeneral)
            : 0,
        DimPorcentaje:
          rows[0].fraseDimPorcentaje != null
            ? buscarValor(rows[0].fraseDimPorcentaje, dimPorcentaje)
            : 0,
        IntI:
          rows[0].fraseIntI != null ? buscarValor(rows[0].fraseIntI, INT) : 0,
        IntE:
          rows[0].fraseIntE != null ? buscarValor(rows[0].fraseIntE, INT) : 0,
        IntS:
          rows[0].fraseIntS != null ? buscarValor(rows[0].fraseIntS, INT) : 0,
        IntGeneral:
          rows[0].fraseIntGeneral != null
            ? buscarValor(rows[0].fraseIntGeneral, DIM)
            : 0,
        IntPorcentaje:
          rows[0].fraseIntPorcentaje != null
            ? buscarValor(rows[0].fraseIntPorcentaje, dimPorcentaje)
            : 0,
        Di: rows[0].fraseDi != null ? buscarValor(rows[0].fraseDi, DI) : 0,
        Dis: rows[0].fraseDIS != null ? buscarValor(rows[0].fraseDIS, DIS) : 0,
        Vq1: rows[0].fraseVQ1 != null ? buscarValor(rows[0].fraseVQ1, VQ) : 0,
        Vq2: rows[0].fraseVQ2 != null ? buscarValor(rows[0].fraseVQ2, DIM) : 0,
      },
      Equilibrio: {
        Bqr1:
          rows[0].BQr1 != null ? buscarValor(rows[0].BQr1, Equilibrio_BQR) : 0,
        Bqr2:
          rows[0].BQr2 != null ? buscarValor(rows[0].BQr2, Equilibrio_BQR) : 0,
        Bqa1:
          rows[0].BQa1 != null ? buscarValor(rows[0].BQa1, Equilibrio_BQA) : 0,
        Bqa2: rows[0].BQa2 != null ? buscarValor(rows[0].BQa2, DIM) : 0,
        Cq1: rows[0].CQ1 != null ? buscarValor(rows[0].CQ1, Equilibrio_CQ1) : 0,
        Cq2: rows[0].CQ2 != null ? buscarValor(rows[0].CQ2, Equilibrio_CQ2) : 0,
      },
    };

    console.log("Datos procesados para la gráfica:", analisisProcesado);

    response.render("analisisHartman", {
      csrfToken: request.csrfToken(),
      datos: analisisProcesado,
      analisisHartman: rows,
      isLoggedIn: request.session.isLoggedIn,
      usuario: request.session.usuario || "",
    });
  } catch (error) {
    console.error("Error al obtener o procesar los datos de Hartman:", error);
    response.status(500).send("Error al procesar el análisis de Hartman");
  }
};

async function obtenerCalificacion(idUsuario, grupoId) {
  try {
    const [rows, fields] = await ConsultaResultados.fetchCalificacionTerman(
      idUsuario,
      grupoId
    );
    return { filas: rows, campos: fields };
  } catch (error) {
    console.error("Error al obtener la calificación:", error);
    return null;
  }
}

async function obtenerSerie(idUsuario, grupoId, serieId, calificacionId) {
  try {
    const [rows] = await ConsultaResultados.fetchResultadosSerieTerman(
      idUsuario,
      grupoId,
      serieId,
      calificacionId
    );
    if (rows.length > 0) {
      return { puntuacion: rows[0].puntuacion, rango: rows[0].rango };
    } else {
      return { puntuacion: 0, rango: "" };
    }
  } catch (error) {
    console.error("Error al obtener los resultados de la serie:", error);
    return { puntuacion: 0, rango: "" };
  }
}

function reglaDeTres(num, max) {
  return (num * 100) / max;
}

exports.get_HartmanActiva = (request, response, next) => {
  Prueba.hartmanActiva(request.params.valor)
    .then(([rows]) => {
      const hartmanTiempo = {
        tiempo: rows[0].tiempo || "-",
      };
      response.status(200).json({ hartmanTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};
exports.get_TermanActiva = (request, response, next)=>{
  Prueba.termanActiva(request.params.valor)
  .then(([rows]) => {
    const hartmanTiempo = {
      tiempo: rows[0].tiempo || "N/A",
    };
    response.status(200).json({ hartmanTiempo });
  })
  .catch((error) => {
    response.status(500).json({ message: "Sin pruebas" });
  });
}
function obtenerTotalPorSerie(numeroSerie) {
    const totales = {
        1: 16, 2: 22, 3: 30, 4: 18, 5: 24,
        6: 20, 7: 20, 8: 17, 9: 18, 10: 22
    };
    return totales[numeroSerie] || 1; // Por si acaso
}

function reglaDeTres(valor, totalMaximo) {
    return (valor / totalMaximo) * 100;
}

//Aqui Esta Terman
exports.get_analisisTerman = async (request, response, next) => {
  console.log(request.session.idUsuario);
  const idAspirante = request.session.idUsuarioAspirante;
  const idGrupo = request.session.idGrupoAspirante;
  const idPrueba = 4;
  const sesionAspirante = await Prueba.termanEstatus( idAspirante, idGrupo, idPrueba );

  try {
      // 1. Buscar calificación
      const calificacionExistente = await calificacionTerman.fetchCalificacionById(idAspirante, idGrupo);

      // 2. Si NO existe, hacemos la calificación
      if (!calificacionExistente || calificacionExistente.length === 0) {
          console.log('No existe análisis previo. Calificando...');

          const sesionAspirante = await sesionPruebaModel.fetchById({ idAspirante, idGrupo, idPrueba });

          if (!sesionAspirante || sesionAspirante.length === 0) {
              return response.status(403).send("No hay una prueba Terman asignada a este aspirante.")
          }

          const progreso = await progresoTermanModel.fetchProgresoById(idAspirante, idGrupo);

          if (progreso.length > 0) {
              const updatedAt = new Date(progreso[0].updatedAt);
              const ahora = new Date();
              const diferenciaHoras = (ahora - updatedAt) / (1000 * 60 * 60);

              console.log("Diferencia Horas: ", diferenciaHoras)

              if (diferenciaHoras > 4 && sesionAspirante[0].estatus === "En progreso") {
                  await sesionPruebaModel.updateSesionPrueba({
                      estatus: 1, // Incompleto
                      idAspirante,
                      idGrupo,
                      idPrueba
                  });
              }

              if (diferenciaHoras < 4 && sesionAspirante[0].estatus === "En progreso") {
                return response.status(403).send("El aspirante sigue en progreso.")
              }

              if (sesionAspirante[0].estatus === "No iniciado") {
                return response.status(403).send("El aspirante nunca contesto la Prueba.")
              }

          // Calificar series
          const series = [1,2,3,4,5,6,7,8,9,10];

          for (const idSerie of series) {
              const respuestasAspirante = await respuestasTerman.fetchRespuestasSerieById(idAspirante, idGrupo, idSerie);

              if (idSerie >= 1 && idSerie <= 9) {
                  for (const resp of respuestasAspirante) {
                      if (typeof resp.respuestaAbierta === 'string') {
                          resp.respuestaAbierta = parseInt(resp.respuestaAbierta, 10);
                      }
                  }
              }

              if (respuestasAspirante.length > 0) {
                  await calificarSerieTerman(idSerie, idAspirante, idGrupo, respuestasAspirante);
              }
          }
      }
  }

      // 3. Buscar usuario y análisis ya guardado
      const [rows] = await Aspirante.fetchOne(idAspirante);
      const usuarioData = rows[0];
      const calificacion = await calificacionTerman.fetchCalificacionById(idAspirante, idGrupo);
      const series = await resultadoSerieTerman.fetchSeriesById(idAspirante, idGrupo);

      /*
      console.log("UsuarioData: ", usuarioData)
      console.log("calificacion: ", calificacion)
      console.log("series: ", series)
      */
      if (!usuarioData || !calificacion || !series || series.length === 0) {
          console.log("Sin resultados")
          return response.status(404).send("No hay datos para el analisis.")
      }

      const resultados = series.map(serie => ({
          numero: serie.idSerieTerman,
          categoria: serie.categoria,
          puntuacion: serie.puntuacion,
          rango: serie.rango,
          porcentaje: reglaDeTres(serie.puntuacion, obtenerTotalPorSerie(serie.idSerieTerman))
      })); 

      const resumen = {
          nombreCompleto: `${usuarioData.nombres} ${usuarioData.apellidoPaterno} ${usuarioData.apellidoMaterno}`,
          puntosTotales: calificacion[0].puntosTotales,
          rango: calificacion[0].rango,
          coeficienteIntelectual: calificacion[0].coeficienteIntelectual
      };
      
      console.log(sesionAspirante);
      // 4. Renderizar
      console.log(usuarioData);
      return response.render('analisisTerman', {
          csrfToken: request.csrfToken(),
          resumen,
          resultados,
          analisisTerman: resultados,
          datos: usuarioData,
          resultadosJSON: JSON.stringify(resultados),
          estatusPrueba: sesionAspirante[0].estatus,
          isLoggedIn: request.session.isLoggedIn,
          usuarioA: idAspirante,
          usuario: request.session.usuario,
          estatusPrueba: sesionAspirante[0][0].estatus
      });
      

  } catch (error) {
      console.error('Error en get_analisisTerman:', error);
      return response.status(500).render('error/error.pug', { message: "Ocurrió un error al analizar los resultados del Terman." });
  }
};

exports.get_pruebasGrupo = (request, response, next) => {
  Grupo.pruebasGrupo(request.params.valor)
    .then(([rows]) => {
      response.status(200).json({ pruebas: rows });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_kostickTiempo = (request, response, next) => {
  Grupo.kostickTiempo(request.params.valor)
    .then(([rows]) => {
      const kostickTiempo = {
        tiempo: rows[0].promedio || "-",
      };
      response.status(200).json({ kostickTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_P16PFTiempo = (request, response, next) => {
  Grupo.P16PFTiempo(request.params.valor)
    .then(([rows]) => {
      const P16PFTiempo = {
        tiempo: rows[0].promedio || "-",
      };
      response.status(200).json({ P16PFTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_hartmanTiempo = (request, response, next) => {
  Grupo.hartmanTiempo(request.params.valor)
    .then(([rows]) => {
      const hartmanTiempo = {
        tiempo: rows[0].promedio || "-",
      };
      response.status(200).json({ hartmanTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_termanTiempo = (request, response, next) => {
  Grupo.termanTiempo(request.params.valor)
    .then(([rows]) => {
      const termanTiempo = {
        tiempo: rows[0].promedio || "-",
      };
      response.status(200).json({ termanTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};

exports.get_otisTiempo = (request, response, next) => {
  Grupo.otisTiempo(request.params.valor)
    .then(([rows]) => {
      const otisTiempo = {
        tiempo: rows[0].promedio || "-",
      };
      response.status(200).json({ otisTiempo });
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};