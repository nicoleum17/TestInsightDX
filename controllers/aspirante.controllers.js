const { response } = require("express");

exports.get_root = (request, response, next) => {
  response.render("inicio_aspirante");
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
  response.render("instrucciones_prueba");
};

exports.get_preguntasPrueba = (request, response, next) => {
  response.render("preguntas_prueba");
};

exports.formato_entrevista = (request, response, next) => {
  response.render("formato_entrevista");
};
