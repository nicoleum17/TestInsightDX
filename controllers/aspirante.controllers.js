const { response } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const preguntasFormato = require("../model/preguntasFormato.model");

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
  response.render("instrucciones_prueba");
};

exports.get_preguntasPrueba = (request, response, next) => {
  response.render("preguntas_prueba");
};

exports.formato_entrevista = (request, response, next) => {
  response.render("formato_entrevista", {isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),});
};

exports.post_formato_entrevista = (request, response, next) => {
  console.log(request.body)
  const newFormato = new formatoEntrevista(request.body.apellidoP,request.body.apellidoM, 
    request.body.nombre,request.body.fechaNacimiento,request.body.genero,request.body.edad, 
    request.body.nacionalidad, request.body.origen, request.body.estadoCivil,request.body.direccionA, request.body.celular,
    request.body.telefono, request.body.correo);
  newFormato.save()
  .then(uuid=>{
    request.session.idFormato=uuid;
    response.redirect('formato_entrevista_preguntasP');
    console.log("Formato guardado con id", uuid);
  }) 
  .catch((error)=>{
    console.log(error);
  });
};

exports.formato_entrevista_preguntasP = (request, response, next) => {
  response.render("formato_entrevista_preguntasP", {isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),});
};

exports.post_formato_entrevista_preguntasP = (request, response, next)=>{
  console.log(request.body);
  for (const a in request.body){
    const newPregunta = new preguntasFormato("AAA")
  }
};
