const { response } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const preguntasFormato = require("../model/preguntasFormato.model");

exports.get_root = (request, response, next) => {
  Prueba.fetchAll().then(([rows]) => {
    response.render("inicio_aspirante", {
      pruebas: rows,
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
    });
  });
};

exports.get_notificacionA = (request, response, next) => {
  response.render("notificaciones_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_documentosA = (request, response, next) => {
  response.render("documentos_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_calendarioA = (request, response, next) => {
  response.render("calendario_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_datosA = (request, response, next) => {
  response.render("datos_aspirante", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.get_instrucciones = (request, response, next) => {
  console.log(request.params.idPrueba);
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    console.log(rows);
    response.render("instrucciones_prueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      prueba: rows[0],
    });
  });
};

exports.get_preguntasPrueba = (request, response, next) => {
  response.render("preguntas_prueba", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.formato_entrevista = (request, response, next) => {
  response.render("formato_entrevista",{
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  }
);
};

exports.formato_entrevista_preguntasP = (request, response, next) => {
  response.render("formato_entrevista_preguntasP", {isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),});
};

exports.post_formato_entrevista_preguntasP = (request, response, next)=>{
  console.log(request.body);
  let numPregunta = 1;
  for (const a in request.body){
    if (a=='_csrf'){
      continue
    }
    const newPregunta = new preguntasFormato(request.body[a],numPregunta,(request.session.idFormato||''));
    numPregunta+=1;
    newPregunta.save()
  .then(()=>{
    response.redirect('inicio_aspirante');
    console.log("Pregunta_Guardada");
  }) 
  .catch((error)=>{
    console.log(error);
  });
  }
};
