const { response, request } = require("express");
const db = require("../util/database");

const Prueba = require("../model/prueba.model");
const Grupo = require("../model/grupo.model");
const Aspirante = require("../model/aspirante.model");
const TienePruebas = require("../model/tienePruebas.model");
const Usuario = require("../model/testInsight.model");
const PerteneceGrupo = require("../model/perteneceGrupo.model");

exports.inicio_psicologa = (request, response, next) => {
  const mensajeBorrado = request.session.infoBorrado;
  request.session.infoBorrado = undefined;

  const mensajeAspirante = request.session.infoAspirante;
  request.session.infoAspirante = undefined;

  response.render("inicioPsicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
    infoBorrado: mensajeBorrado,
    infoAspirante: mensajeAspirante,
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

  mi_aspirante.save().then(() => {
    mi_perteneceGrupo.save().then(() => {
      request.session.infoAspirante = "Aspirante registrado exitosamente";
      response.redirect("inicio");
    });
  });
};

exports.get_aspirantes = (request, response, next) => {
  console.log(request.session.privilegios);

  const mensaje = request.session.info || "";
  if (request.session.info) {
    request.session.info = "";
  }

  Aspirante.fetchAll(request.session.idUsuario)
    .then(([rows, fieldData]) => {
      console.log(fieldData);
      console.log(rows);
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
  response.render("consultaRespuestasAspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
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

exports.sesion_grupal = (request, response, next) => {
  response.render("sesionGrupal", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.sesion_individual = (request, response, next) => {
  response.render("sesionIndividual", {
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
  const mi_grupo = new Grupo(
    request.body.institucion,
    request.body.posgrado,
    request.body.generacion,
    request.body.fechaPruebaGrupal + " " + request.body.horaPruebaGrupal,
    request.body.enlaceZoom
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
      response.status(200).json({ kostickTiempo })
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
      response.status(200).json({ P16PFTiempo })
    })
    .catch((error) => {
      response.status(500).json({ message: "Sin pruebas" });
    });
};