const { response } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const preguntasFormato = require("../model/preguntasFormato.model");
const formatoEntrevistaDA = require("../model/formatoEntrevistaDA.model");
const formatoEntrevistaDL = require("../model/formatoEntrevistaDL.model");
const Pregunta16PF = require("../model/preguntas16pf.model");

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
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    Pregunta16PF.fetchAll().then(([rows1]) => {
      response.render("datos_aspirante", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        prueba: rows[0],
        pregunta: rows1[0],
      });
    });
  });
};

exports.get_instrucciones = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("instrucciones_prueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      prueba: rows[0],
    });
  });
};

exports.get_preguntasPrueba = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([prueba]) => {
    Pregunta16PF.fetchAll().then(async ([preguntas16PF]) => {
      for (let pregunta of preguntas16PF) {
        let opciones_pregunta = await Pregunta16PF.getOpciones(
          pregunta.idPregunta16PF
        );
        pregunta.opciones = opciones_pregunta[0];
      }

      console.log(preguntas16PF);

      request.session.preguntas = preguntas16PF;
      request.session.currentQuestionIndex = 0;
      response.render("preguntas_prueba", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        prueba: prueba[0],
        preguntas: preguntas16PF,
      });
    });
  });
};

exports.formato_entrevista = (request, response, next) => {
  response.render("formato_entrevista", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    privilegios: request.session.privilegios || [],
  });
};

exports.post_formato_entrevista = (request, response, next) => {
  const newFormato = new formatoEntrevista(
      request.body.apellidoP,
      request.body.apellidoM,
      request.body.nombre,
      request.body.fechaNacimiento,
      request.body.genero,
      request.body.edad,
      request.body.nacionalidad,
      request.body.origen,
      request.body.estadoCivil,
      request.body.direccionA,
      request.body.celular,
      request.body.telefono,
      request.body.correo
    );
    newFormato
      .save()
      .then((uuid) => {
        request.session.idFormato = uuid;
        response.redirect("formato_entrevista_preguntasP");
      })
      .catch((error) => {
        console.log(error);
      });
};

exports.formato_entrevista_preguntasP = (request, response, next) => {
  response.render("formato_entrevista_preguntasP", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
  });
};

exports.post_formato_entrevista_preguntasP = (request, response, next) => {
  let numPregunta = 1;
  for (const a in request.body) {
    if (a == "_csrf") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.session.idFormato || ""
    );
    numPregunta += 1;
    newPregunta
      .save()
      .then(() => {
        response.redirect("formato_entrevista_DA");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.get_logout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect("/");
  });
};

exports.formato_entrevista_DA = (request, response, next)=> {
  response.render("formato_entrevista_DA", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
    formato: request.session.idFormato
  });
};

exports.post_formato_entrevista_DA = (request, response, next)=>{
  formatoEntrevista.saveDA(
  
    request.body.nombreLicenciatura,
    request.body.institucion,
    request.body.promedio,
    request.body.generacion,
    request.body.gradoMax,
    request.body.maestria,
    request.body.institucionMaestria,
    request.body.promedioMaestria,
    request.body.cursos,
    request.body.idiomas,
    request.body.idFormato,
  ).then(()=>{
    response.redirect("formato_entrevista_preguntasDA");
    console.log("Datos_academicos_Guardados");
  })
  .catch((error) => {
    console.log(error);
  });
};

exports.formato_entrevista_preguntasDA = (request, response, next)=>{
  response.render("formato_entrevista_preguntasDA", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
  });
};

exports.post_formato_entrevista_preguntasDA = (request, response, next)=>{
  let numPregunta = 7;
  for (const a in request.body) {
    if (a == "_csrf") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.session.idFormato || ""
    );
    numPregunta += 1;
    newPregunta
      .save()
      .then(() => {
        response.redirect("formato_entrevista_DL");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_DL = (request, response, next)=>{
  response.render("formato_entrevista_DL", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
  });
};

exports.post_formato_entrevista_DL = (request, response, next)=>{
  console.log(request.body)
  const newFormatoDL = new formatoEntrevistaDL(
  
    request.body.lugarTrabajo, 
    request.body.empresa, 
    request.body.puesto, 
    request.body.tiempo, 
    request.body.actividades, 
    request.body.sueldo, 
    request.body.personal,
    request.session.idFormato)

    newFormatoDL.save().then(()=>{
      response.redirect("formato_entrevista_preguntasDL");
      console.log("Datos_Laborales_Guardados");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.formato_entrevista_preguntasDL = (request, response, next) => {
  response.render("formato_entrevista_preguntasDL", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
  });
};

exports.post_formato_entrevista_preguntasDL = (request, response, next)=>{
  let numPregunta = 14;
  for (const a in request.body) {
    if (a == "_csrf") {
      continue;
    }
    const newPregunta = new preguntasFormato(
      request.body[a],
      numPregunta,
      request.session.idFormato || ""
    );
    numPregunta += 1;
    newPregunta
      .save()
      .then(() => {
        response.redirect("inicio");
        console.log("Pregunta_Guardada");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};