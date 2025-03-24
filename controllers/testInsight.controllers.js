const { response } = require("express");

exports.sesion_grupal = (request, response, next) => {
    response.render("sesion_grupal");
  };
  
  exports.sesion_individual = (request, response, next) => {
    response.render("sesion_individual");
  };
  