const { response } = require("express");
const db = require("../util/database");

const Prueba = require("../model/prueba.model");
const Grupo = require("../model/grupo.model");

exports.inicio_psicologa = (request, response, next) => {
  response.render("inicio_psicologa");
};
exports.notificaciones_psicologa = (request, response, next) => {
  response.render("notificaciones_psicologa");
};
exports.calendario_psicologa = (request, response, next) => {
  response.render("calendario_psicologa");
};
exports.get_prueba = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("consulta_prueba", {
      pruebas: rows,
    });
  });
};

exports.get_aspirantes = (request, response, next) => {
  response.render("consulta_aspirante");
};

exports.get_respuestasA = (request, response, next) => {
  response.render("consulta_respuestas_aspirante");
};

exports.get_respuestasG = (request, response, next) => {
  response.render("consulta_respuestas_grupo");
};

exports.sesion_grupal = (request, response, next) => {
  response.render("sesion_grupal");
};

exports.sesion_individual = (request, response, next) => {
  response.render("sesion_individual");
};

exports.crear_grupo = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("crear_grupo", {
      pruebas: rows,
    });
  });
};

exports.confirmar_creacion_grupo = (request, response, next) => {
  response.render("confirmar_creacion_grupo");
};

exports.elegir_grupo = (request, response, next) => {
  Grupo.fetchAll().then(([rows]) => {
    response.render("elegir_grupo", {
      grupos: rows,
    });
  });
};

exports.get_grupo = (request, response, next) => {
  const numGrupo = request.query.grupoSeleccionado;
  response.render("consulta_grupo", { numGrupo });
};

exports.registra_reporte_grupo = (request, response, next) => {
  const numGrupo = request.params.id;
  //response.render("registrar_reporte_grupo");

  Grupo.fetchOne(numGrupo).then(([rows]) => {
    response.render("registrar_reporte_grupo", { grupo: rows });
  });
};
