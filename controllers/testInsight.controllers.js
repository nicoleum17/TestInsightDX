const { response } = require("express");

exports.inicio_psicologa = (request, response, next) => {
  response.render("inicio_psicologa");
};

exports.get_aspirantes = (request, response, next) => {
  response.render("consulta_aspirante");
};

exports.get_respuestasA = (request, response, next) => {
  response.render("consulta_respuestas_aspirante");
};

exports.get_grupo = (request, response, next) => {
  response.render("consulta_grupo");
};

exports.get_respuestasG = (request, response, next) => {
  response.render("consulta_respuestas_grupo");
};

exports.crear_grupo = (request, response, next) => {
  response.render("crear_grupo");
};

exports.sesion_grupal = (request, response, next) => {
  response.render("sesion_grupal");
};

exports.sesion_individual = (request, response, next) => {
  response.render("sesion_individual");
};

exports.confirmar_creacion_grupo = (request, response, next) => {
  response.render("confirmar_creacion_grupo");
};
/*
{
    isLoggedIn: request.session.isLoggedIn || false,
    username: request.session.username || " ",
 }*/
