const { response } = require("express");
const db = require("../util/database");

const Prueba = require("../model/prueba.model");
const Grupo = require("../model/grupo.model");

exports.inicio_psicologa = (request, response, next) => {
  response.render("inicio_psicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};
exports.notificaciones_psicologa = (request, response, next) => {
  response.render("notificaciones_psicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};
exports.calendario_psicologa = (request, response, next) => {
  response.render("calendario_psicologa", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};
exports.get_prueba = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("consulta_prueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      pruebas: rows,
    });
  });
};

exports.get_aspirantes = (request, response, next) => {
  response.render("consulta_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_respuestasA = (request, response, next) => {
  response.render("consulta_respuestas_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_respuestasG = (request, response, next) => {
  response.render("consulta_respuestas_grupo", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.sesion_grupal = (request, response, next) => {
  response.render("sesion_grupal", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.sesion_individual = (request, response, next) => {
  response.render("sesion_individual", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.crear_grupo = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("crear_grupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      pruebas: rows,
    });
  });
};

exports.confirmar_creacion_grupo = (request, response, next) => {
  response.render("confirmar_creacion_grupo", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.elegir_grupo = (request, response, next) => {
  Grupo.fetchAll().then(([rows]) => {
    response.render("elegir_grupo", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      grupos: rows,
    });
  });
};

exports.get_grupo = (request, response, next) => {
  const numGrupo = request.params.id;
  Grupo.fetchOne(numGrupo).then(([rows]) => {
    response.render("consulta_grupo", {
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

  Grupo.fetchOne(numGrupo).then(([rows]) => {
    response.render("registrar_reporte_grupo", {
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

  Grupo.fetchOne(numGrupo).then(([rows]) => {
    response.render("registrar_foda_grupo", {
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

exports.get_logout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect("/");
  });
};
