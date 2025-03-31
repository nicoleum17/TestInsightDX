const { response } = require("express");
const Prueba = require("../model/prueba.model");
const formatoEntrevista = require("../model/formatoEntrevista.model");
const preguntasFormato = require("../model/preguntasFormato.model");
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
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    Pregunta16PF.fetchAll().then(([rows1]) => {
      request.session.preguntas = rows;
      request.session.currentQuestionIndex = 0;
      response.render("preguntas_prueba", {
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
exports.post_empezarPrueba = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows1]) => {
    Pregunta16PF.fetchAll().then(([rows]) => {
      request.session.preguntas = rows;
      request.session.currentQuestionIndex = 0;
      response.render("preguntas_prueba", {
        isLoggedIn: request.session.isLoggedIn || false,
        usuario: request.session.usuario || "",
        csrfToken: request.csrfToken(),
        privilegios: request.session.privilegios || [],
        prueba: rows1[0],
        pregunta: rows[0],
      });
    });
  });
};

exports.post_siguientePregunta = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows1]) => {
    Pregunta16PF.fetchAll().then(([rows]) => {
      const preguntas = request.session.preguntas;
      const indice = request.session.currentQuestionIndex;
      if (indice < preguntas.length - 1) {
        request.session.currentQuestionIndex++;
        const siguientePregunta =
          preguntas[request.session.currentQuestionIndex];
        response.render("preguntas_prueba", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          prueba: rows1[0],
          pregunta: rows[0],
        });
      } else {
        response.render("prueba_completada", {
          prueba: rows1[0],
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
        });
      }
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
  console.log(request.body);
  let correcto = true;
  for (const a in request.body) {
    if (request.body[a] == undefined || request.body[a] == "") {
      correcto = false;
      response.redirect("formato_entrevista");
    }
  }
  if (correcto == true) {
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
        console.log("Formato guardado con id", uuid);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.formato_entrevista_preguntasP = (request, response, next) => {
  response.render("formato_entrevista_preguntasP", {
    isLoggedIn: request.session.isLoggedIn || false,
    usuario: request.session.usuario || "",
    csrfToken: request.csrfToken(),
  });
};

exports.post_formato_entrevista_preguntasP = (request, response, next) => {
  console.log(request.body);
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
  });
};