const { response } = require("express");

const Pruebas = require("../models/prueba.model");

exports.inicio_psicologa = (request, response, next) => {
  response.render("inicio_psicologa");
};

exports.get_prueba = (request, response, next) => {
  /* Pruebas.fetchAll()
    .then(([Pruebas, fieldData]) => {*/
  response.render("consulta_prueba"); //, {
  /*  Pruebas: Pruebas,
      });
    })
    .catch((error) => {
      console.log(error);
    });*/
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

exports.confirmar_creacion_grupo = (request, response, next) => {
  response.render("confirmar_creacion_grupo");
};

exports.sesion_grupal = (request, response, next) => {
  response.render("sesion_grupal");
};

exports.sesion_individual = (request, response, next) => {
  response.render("sesion_individual");
};

exports.registra_reporte_grupo = (request, response, next) => {
  response.render("registrar_reporte_grupo");
};
