const { response } = require("express");
const Prueba = require("../model/prueba.model");

exports.get_root = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("inicio_aspirante", {
      pruebas: rows,
      sLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
    });
  });
};

exports.get_notificacionA = (request, response, next) => {
  response.render("notificaciones_aspirante");
};

exports.get_documentosA = (request, response, next) => {
  response.render("documentos_aspirante");
};

exports.get_calendarioA = (request, response, next) => {
  response.render("calendario_aspirante");
};

exports.get_datosA = (request, response, next) => {
  response.render("datos_aspirante");
};

exports.get_instrucciones = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("instrucciones_prueba", {
      sLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      prueba: rows[0],
    });
  });
};

exports.get_preguntasPrueba = (request, response, next) => {
  response.render("preguntas_prueba");
};

exports.formato_entrevista = (request, response, next) => {
  response.render("formato_entrevista");
};
