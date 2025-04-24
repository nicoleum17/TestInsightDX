const { response, request } = require("express");
const db = require("../util/database");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const Prueba = require("../model/prueba.model");
const Grupo = require("../model/grupo.model");
const Aspirante = require("../model/aspirante.model");
const TienePruebas = require("../model/tienePruebas.model");
const Usuario = require("../model/usuarios.model");
const PerteneceGrupo = require("../model/perteneceGrupo.model");
const ResultadosKostick = require("../model/kostick/resultadosKostick.model");
const Resultados16PF = require("../model/16pf/resultados16PF.model");
const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET,
  process.env.REDIRECT
);
const evento = require("../model/event.model");
const eventoGoogle = require("../model/event.model");

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
    request.body.lugarO,
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
    `Sesion Individual con ${request.body.nombre}`,
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

  const fehcaZoom = new Date(request.body.fechaSesionIndividual);

  const mi_usuario = new Usuario(
    mi_aspirante.idUsuario,
    nombreUsuario,
    contraseñaBase,
    "2"
  );

  mi_aspirante.save().then(() => {
    mi_perteneceGrupo.save().then(() => {
      request.session.infoAspirante = "Aspirante registrado exitosamente";
      mi_usuario.save().then(() => {
        mi_usuario.correo;
        response.redirect("inicio");
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
              response.render("consultaRespuestasAspirante", {
                isLoggedIn: request.session.isLoggedIn || false,
                usuario: request.session.usuario || "",
                csrfToken: request.csrfToken(),
                privilegios: request.session.privilegios || [],
                prueba: "El inventario de Percepción Kostick",
                grupo: grupoRows[0],
                valores: resultados[0][0],
                datos: datosAspirante[0],
              });
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
              });
            }
          );
        }
      });
    });
  });
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

exports.post_grupo = (request, response, next) => {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const fechaGrupoInicioIOS = `${request.body.fechaPruebaGrupal}T${request.body.horaPruebaGrupal}:00`;
  const inicioDateGrupo = new Date(fechaGrupoInicioIOS);
  const finalDateGrupo = new Date(inicioDateGrupo.getTime() + 90 * 60000);
  const fechaGrupoFinalIOS = finalDateGrupo.toISOString();
  //TRABAJO AQUI
  const mi_grupo = new Grupo(
    request.body.institucion,
    request.body.posgrado,
    request.body.generacion,
    request.body.fechaPruebaGrupal + " " + request.body.horaPruebaGrupal,
    request.body.enlaceZoom
  );
  const eventoNuevo = new eventoGoogle(
    `Sesion Grupal de: ${request.body.institucion} para el posgrado ${request.body.posgrado}`,
    "Zoom",
    `Sesion Grupal con ${request.body.posgrado}, ${request.body.institucion}`,
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
  mi_grupo
    .save()
    .then(() => {
      const pruebas = Array.isArray(request.body.pruebasOpcion)
        ? request.body.pruebasOpcion
        : [request.body.pruebasOpcion];

      const promesas = pruebas.map((prueba) => {
        return Prueba.fetchOneNombre(prueba).then(([rows]) => {
          const idPrueba = rows[0]?.idPrueba;

          const mi_tienePruebas = new TienePruebas(
            mi_grupo.idGrupo,
            idPrueba,
            request.body.fechaLimite
          );

          return mi_tienePruebas.save();
        });
      });

      return Promise.all(promesas);
    })
    .then(() => {
      request.session.info = "Grupo creado exitosamente";
      request.session.grupoCreado = {
        id: mi_grupo.idGrupo,
        posgrado: mi_grupo.posgrado,
        generacion: mi_grupo.generacion,
        institucion: mi_grupo.institucion,
      };
      response.redirect("/psicologa/grupo/confirmarCreacion");
    })
    .catch((error) => {
      console.log("Error al crear grupo o asignar pruebas:", error);
      response.status(500).send("Error al procesar la creación del grupo.");
    });
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
      TienePruebas.getFechaLimite(idGrupo).then(([tienePruebas]) => {
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
    request.session.idUsuario = idUsuario;
    response.render("reporteAspirante", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      aspirante: aspirante[0],
      idUsuario: request.session.idUsuario,
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
        tiempo: rows[0].tiempo || "N/A",
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
        tiempo: rows[0].tiempo || "N/A",
      };
      response.status(200).json({ P16PFTiempo });
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
