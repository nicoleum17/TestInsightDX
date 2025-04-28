// -----------------------------
// VARIABLES GLOBALES DE CONTROL
// -----------------------------
let serieActual = 1;
const totalSeries = 10;

// Barra de progreso
const preguntasTotales = 173;
let preguntasRespondidas = 0;

// Duración de la serie en segundos (recibido del backend)
let tiempoSerie;
// Control del cronómetro global
let tiempoRestante;
// Intervalo del setInterval
let intervalo;

// Arrays y contadores para las preguntas de la serie
let preguntasActuales = [];
let indicePregunta = 0;
// Almacena respuestas: [{ idPregunta, opcion, tiempo }, ...]
let tiemposRespuestas = [];
// Marca el inicio de cada pregunta
let tiempoInicio;

// ----------------------------
// PREVENCIÓN DE RECARGA Y RETROCESO
// ----------------------------

// Handler referenciable para beforeunload
const handlerBeforeUnload = function (e) {
  e.preventDefault();
  e.returnValue = "";
};

function activarBloqueoDeSalida() {
  window.addEventListener("beforeunload", handlerBeforeUnload);
}

function desactivarBloqueoDeSalida() {
  window.removeEventListener("beforeunload", handlerBeforeUnload);
}

// Handler referenciable para popstate
const handlerPopstate = function (event) {
  history.pushState(null, null, location.href);
};

function prevenirBotonAtras() {
  history.pushState(null, null, location.href);
  window.addEventListener("popstate", handlerPopstate);
}

function permitirBotonAtras() {
  window.removeEventListener("popstate", handlerPopstate);
}

// ----------------------------
// INICIO DEL CRONÓMETRO GLOBAL
// ----------------------------

function iniciarCronometro(callbackFin) {
  clearInterval(intervalo);
  const cronometroElem = document.getElementById("cronometro");

  // Asigna la duración recibida de la serie
  tiempoRestante = tiempoSerie;
  cronometroElem.innerText = `Tiempo restante: ${tiempoRestante}s`;
  cronometroElem.style.display = "block";

  intervalo = setInterval(() => {
    tiempoRestante--;
    cronometroElem.innerText = `Tiempo restante: ${tiempoRestante}s`;
    if (tiempoRestante <= 0) {
      clearInterval(intervalo);

      // Llama a la función que finaliza la serie si se agotó el tiempo
      callbackFin();
    }
  }, 1000);
}

// ----------------------------
// BARRA DE PROGRESO
// ----------------------------
function actualizarProgresoGlobal() {
  const barra = document.getElementById("barra-progreso");
  const texto = document.getElementById("progreso-texto");

  const porcentaje = Math.round(
    (preguntasRespondidas / preguntasTotales) * 100
  );

  barra.value = porcentaje;
  texto.innerText = `${porcentaje}% completado`;
}

function aumentarProgreso() {
  preguntasRespondidas++;
  actualizarProgresoGlobal();
}

// ---------------------
// TRAER DATOS DE LA SERIE
// ---------------------
function traerSerie(idSerie) {
  fetch(`/aspirante/pruebas/responder/terman/serie/${idSerie}`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((info) => {
      // Muestra las instrucciones + botón "Comenzar"
      mostrarSerie(info);
    })
    .catch((error) => {
      console.error("Error al traer la serie:", error);
    });
}

// ----------------------------
// OBTENER RESPUESTAS RESTANTES
// (para las preguntas que faltan cuando se acaba el tiempo)
// ----------------------------
function completarRespuestasFaltantes() {
  // Marcar las preguntas no respondidas con opcion=0
  // Esto es útil si se acaba el tiempo o el usuario no contestó.
  const preguntasFaltantes = preguntasActuales.slice(indicePregunta);
  const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);
  // Barra de progreso
  preguntasRespondidas += preguntasFaltantes.length;
  actualizarProgresoGlobal();

  preguntasFaltantes.forEach((p) => {
    tiemposRespuestas.push({
      idPregunta: p.idPreguntaTerman,
      opcion: 0,
      tiempo: tiempoRespuesta,
    });
  });
}

// ----------------------------
// ENVIAR RESPUESTAS AL SERVIDOR
// ----------------------------
function enviarRespuestas(respuestas) {
  const csrfToken = document.getElementById("_csrf").value;
  console.log("Token CSRF:", csrfToken);

  return fetch(`/aspirante/pruebas/responder/terman/serie/${serieActual}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken,
    },
    body: JSON.stringify({ respuestas }),
  });
}

// ------------------------------------
// MOSTRAR INSTRUCCIONES DE LA SERIE
// ------------------------------------
function mostrarSerie(info) {
  // Recibimos data con { id, nombreSeccion, duracion, instruccion, preguntas[] }

  // Valor en segundos para esta serie
  tiempoSerie = info.duracion;

  const cronometroElem = document.getElementById("cronometro");
  cronometroElem.innerText = "";
  cronometroElem.style.display = "none";

  const instruccionesElem = document.getElementById("instrucciones-serie");
  instruccionesElem.innerHTML = `
            <h3>Serie ${info.id}: ${info.nombreSeccion}</h3>
            <p>${info.instruccion}</p>
            <p><strong>TIP</strong>: Si no deseas responder la pregunta, solo da click en <strong>"No contestar"</strong>.<p>
            <div id="tiempo-boton">
            <p><strong>Tiempo para esta serie: </strong>${info.duracion} segundos</p>
            <button id="comenzar-serie" class="button is-large has-text-white">Comenzar serie</button>
            </div>
        `;

  // Limpia el contenedor de preguntas
  document.getElementById("preguntas-serie").innerHTML = "";

  // Al hacer clic en "Comenzar serie", se ocultan las instrucciones, se muestra el cronómetro y se inician las preguntas
  document.getElementById("comenzar-serie").addEventListener("click", () => {
    document.getElementById("tiempo-boton").remove();
    iniciarPreguntas(info.preguntas);
  });
}

// -------------------------------
// INICIAR LAS PREGUNTAS DE LA SERIE
// -------------------------------
function iniciarPreguntas(preguntas) {
  preguntasActuales = preguntas;
  indicePregunta = 0;
  tiemposRespuestas = [];

  // Iniciamos el cronómetro global
  iniciarCronometro(() => {
    // Se acabó el tiempo => forzamos terminar la serie y marcar pendientes con 0
    completarRespuestasFaltantes();
    finalizarSerie();
  });

  // Dependiendo de la serieActual, usamos una función distinta
  if (serieActual === 4) {
    mostrarPreguntaActualSerie4();
  } else if (serieActual === 5) {
    // Un input text (una sola)
    mostrarPreguntaActualSerie5();
  } else if (serieActual === 10) {
    // Dos inputs text
    mostrarPreguntaActualSerie10();
  } else {
    // Lógica genérica: radio
    mostrarPreguntaActual();
  }
}

// -----------------------------------
// MOSTRAR PREGUNTAS SERIE GENÉRICA (RADIO)
// -----------------------------------
function mostrarPreguntaActual() {
  const pregunta = preguntasActuales[indicePregunta];
  const contenedor = document.getElementById("preguntas-serie");

  contenedor.innerHTML = `
            <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
            ${pregunta.opciones
              .map(
                (op) => `
                <label>
                    <input type="radio" name="respuesta_${pregunta.idPreguntaTerman}" value="${op.opcionTerman}">
                    ${op.descripcionTerman}
                </label>
            `
              )
              .join("<br>")}
            <p id="error-seleccion" style="color: red; margin-top: 10px;"></p>
            <div class="botones-preguntas">
                <button id="no-contestar" class="button is-large has-text-white">No contestar</button>
                <button id="siguiente-pregunta" class="button is-large has-text-white" disabled>Siguiente</button>
            </div>
        `;

  tiempoInicio = Date.now();

  const errorSeleccion = document.getElementById("error-seleccion");
  const siguienteBtn = document.getElementById("siguiente-pregunta");
  const radios = document.querySelectorAll(
    `input[name="respuesta_${pregunta.idPreguntaTerman}"]`
  );

  // Habilita el botón si se selecciona algo
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const seleccionado = document.querySelector(
        `input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`
      );
      siguienteBtn.disabled = !seleccionado;
      errorSeleccion.textContent = "";
    });
  });

  function procesarRespuesta(usandoSeleccion) {
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);
    const seleccion = document.querySelector(
      `input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`
    );

    if (usandoSeleccion) {
      if (!seleccion) {
        errorSeleccion.textContent =
          'Por favor selecciona una opción o usa "No contestar".';
        return;
      }
    }

    tiemposRespuestas.push({
      idPregunta: pregunta.idPreguntaTerman,
      opcion: seleccion ? seleccion.value : 0,
      tiempo: tiempoRespuesta,
    });

    aumentarProgreso();
    indicePregunta++;
    if (indicePregunta < preguntasActuales.length) {
      mostrarPreguntaActual();
    } else {
      finalizarSerie();
    }
  }

  document
    .getElementById("siguiente-pregunta")
    .addEventListener("click", () => procesarRespuesta(true));
  document
    .getElementById("no-contestar")
    .addEventListener("click", () => procesarRespuesta(false));
}

// --------------------------------
// MOSTRAR PREGUNTAS SERIE 4 (2 OPC)
// --------------------------------
function mostrarPreguntaActualSerie4() {
  const pregunta = preguntasActuales[indicePregunta];
  const contenedor = document.getElementById("preguntas-serie");
  const maxSelections = 2;

  contenedor.innerHTML = `
            <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
            ${pregunta.opciones
              .map(
                (op) => `
                <label>
                    <input type="checkbox" name="respuesta_${pregunta.idPreguntaTerman}" value="${op.opcionTerman}">
                    ${op.descripcionTerman}
                </label>
            `
              )
              .join("<br>")}
            <p id="error-seleccion"></p>
            <div class="botones-preguntas">
                <button id="no-contestar" class="button is-large has-text-white">No contestar</button>
                <button id="siguiente-pregunta" class="button is-large has-text-white" disabled>Siguiente</button>
            </div>
        `;

  const checkboxes = contenedor.querySelectorAll(
    `input[name="respuesta_${pregunta.idPreguntaTerman}"]`
  );
  const errorSeleccion = document.getElementById("error-seleccion");
  const siguienteBtn = document.getElementById("siguiente-pregunta");

  tiempoInicio = Date.now();

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const seleccionados = contenedor.querySelectorAll(
        `input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`
      );

      if (seleccionados.length > maxSelections) {
        this.checked = false;
        errorSeleccion.textContent = `Solo puedes seleccionar un máximo de ${maxSelections} opciones.`;
        return;
      }

      // Feedback visual y control de botón
      if (seleccionados.length === 1) {
        siguienteBtn.disabled = false;
      } else if (seleccionados.length === 2) {
        errorSeleccion.textContent = "";
        siguienteBtn.disabled = false;
      } else {
        errorSeleccion.textContent = "";
        siguienteBtn.disabled = true;
      }
    });
  });

  function procesarRespuesta(conSeleccion) {
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);
    const seleccionados = conSeleccion
      ? contenedor.querySelectorAll(
          `input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`
        )
      : [];

    if (seleccionados.length === 1) {
      errorSeleccion.textContent = `Debes seleccionar ${maxSelections} opciones o usar "No contestar".`;
      return;
    }

    if (seleccionados.length === 2) {
      seleccionados.forEach((cb) => {
        tiemposRespuestas.push({
          idPregunta: pregunta.idPreguntaTerman,
          opcion: parseInt(cb.value, 10),
          tiempo: tiempoRespuesta,
        });
      });
    } else {
      tiemposRespuestas.push({
        idPregunta: pregunta.idPreguntaTerman,
        opcion: 0,
        tiempo: tiempoRespuesta,
      });
    }

    aumentarProgreso();
    indicePregunta++;
    if (indicePregunta < preguntasActuales.length) {
      mostrarPreguntaActualSerie4();
    } else {
      finalizarSerie();
    }
  }

  document
    .getElementById("siguiente-pregunta")
    .addEventListener("click", () => procesarRespuesta(true));
  document
    .getElementById("no-contestar")
    .addEventListener("click", () => procesarRespuesta(false));
}

// --------------------------------
// MOSTRAR PREGUNTAS SERIE 5 (Cuadro de texto)
// --------------------------------

function mostrarPreguntaActualSerie5() {
  const pregunta = preguntasActuales[indicePregunta];
  const contenedor = document.getElementById("preguntas-serie");

  contenedor.innerHTML = `
            <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
            <input type="text" id="respuestaTexto" placeholder="Escribe tu respuesta..." pattern="[0-9.\\/]*" inputmode="decimal" autocomplete="off">
            <p id="error-seleccion"></p>
            <div class="botones-preguntas">
                <button id="no-contestar" class="button is-large has-text-white">No contestar</button>
                <button id="siguiente-pregunta" class="button is-large has-text-white" disabled>Siguiente</button>
            </div>
        `;

  const input = document.getElementById("respuestaTexto");
  const errorSeleccion = document.getElementById("error-seleccion");
  const siguienteBtn = document.getElementById("siguiente-pregunta");

  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9./]/g, "");
    const tieneValor = this.value.trim().length > 0;

    // Habilita o deshabilita el botón según el contenido
    siguienteBtn.disabled = !tieneValor;

    // Limpia el mensaje de error si había uno
    if (tieneValor) {
      errorSeleccion.textContent = "";
    }
  });

  tiempoInicio = Date.now();

  function procesarRespuesta(texto) {
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

    tiemposRespuestas.push({
      idPregunta: pregunta.idPreguntaTerman,
      opcion: texto || 0,
      tiempo: tiempoRespuesta,
    });

    aumentarProgreso();
    indicePregunta++;
    if (indicePregunta < preguntasActuales.length) {
      mostrarPreguntaActualSerie5();
    } else {
      finalizarSerie();
    }
  }

  siguienteBtn.addEventListener("click", () => {
    const textoIngresado = input.value.trim();
    if (!textoIngresado) {
      errorSeleccion.textContent =
        'Debes ingresar un valor o usar "No contestar".';
      return;
    }
    procesarRespuesta(textoIngresado);
  });

  document.getElementById("no-contestar").addEventListener("click", () => {
    procesarRespuesta(null);
  });
}

// ---------------------------------------------
// SERIE 10: DOS CUADROS DE TEXTO
// ---------------------------------------------
function mostrarPreguntaActualSerie10() {
  const pregunta = preguntasActuales[indicePregunta];
  const contenedor = document.getElementById("preguntas-serie");

  contenedor.innerHTML = `
            <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
            <div id="serie10-input">
                <input type="text" id="respuestaTextoA" placeholder="[ número 1 ]" pattern="[0-9.\\/]*" inputmode="decimal" autocomplete="off">
                <span class="separador"> - </span>
                <input type="text" id="respuestaTextoB" placeholder="[ número 2 ]" pattern="[0-9.\\/]*" inputmode="decimal" autocomplete="off">
            </div>
            <p id="error-seleccion"></p>
            <div class="botones-preguntas">
                <button id="no-contestar" class="button is-large has-text-white">No contestar</button>
                <button id="siguiente-pregunta" class="button is-large has-text-white" disabled>Siguiente</button>
            </div>
        `;

  const inputA = document.getElementById("respuestaTextoA");
  const inputB = document.getElementById("respuestaTextoB");
  const siguienteBtn = document.getElementById("siguiente-pregunta");
  const errorSeleccion = document.getElementById("error-seleccion");

  tiempoInicio = Date.now();

  // Validación de caracteres permitidos
  [inputA, inputB].forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9./]/g, "");

      const a = inputA.value.trim();
      const b = inputB.value.trim();

      // Habilita el botón si hay algo escrito en al menos uno
      siguienteBtn.disabled = !(a || b);

      // Limpia el mensaje de error mientras escribe
      errorSeleccion.textContent = "";
    });
  });

  function procesarRespuesta(usandoValores) {
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

    if (usandoValores) {
      const textoA = inputA.value.trim();
      const textoB = inputB.value.trim();

      if (!textoA || !textoB) {
        errorSeleccion.textContent =
          'Debes escribir ambos números o usar "No contestar".';
        return;
      }

      const textoFinal = `${textoA} - ${textoB}`;

      tiemposRespuestas.push({
        idPregunta: pregunta.idPreguntaTerman,
        opcion: textoFinal,
        tiempo: tiempoRespuesta,
      });
    } else {
      // En caso de no contestar
      tiemposRespuestas.push({
        idPregunta: pregunta.idPreguntaTerman,
        opcion: "0 - 0",
        tiempo: tiempoRespuesta,
      });
    }

    aumentarProgreso();
    indicePregunta++;
    if (indicePregunta < preguntasActuales.length) {
      mostrarPreguntaActualSerie10();
    } else {
      finalizarSerie();
    }
  }

  document
    .getElementById("siguiente-pregunta")
    .addEventListener("click", () => procesarRespuesta(true));
  document
    .getElementById("no-contestar")
    .addEventListener("click", () => procesarRespuesta(false));
}

// ------------------------------------
// FINALIZAR SERIE: ENVÍA RESPUESTAS
// ------------------------------------
function finalizarSerie() {
  clearInterval(intervalo);
  enviarRespuestas(tiemposRespuestas)
    .then(() => {
      serieActual++;
      if (serieActual <= totalSeries) {
        document.getElementById("preguntas-serie").innerHTML = "";
        document.getElementById("instrucciones-serie").innerHTML = "";
        document.getElementById("cronometro").innerText = "";
        document.getElementById("cronometro").style.display = "none";

        mostrarInstruccionesSiguienteSerie(serieActual);
      } else {
        desactivarBloqueoDeSalida();
        permitirBotonAtras();

        setTimeout(() => {
          alert("¡Has terminado la prueba!");
          window.location.href = "/inicio/aspirante";
        }, 100);
      }
    })
    .catch((error) => {
      console.error("Error al enviar respuestas:", error);
      alert("Hubo un error al guardar tus respuestas.");
    });
}

// -----------------------------------------------------
// MOSTRAR INSTRUCCIONES DE LA SIGUIENTE SERIE (FETCH)
// -----------------------------------------------------
function mostrarInstruccionesSiguienteSerie(idSerie) {
  fetch(`/aspirante/pruebas/responder/terman/serie/${idSerie}`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      const instruccionesElem = document.getElementById("instrucciones-serie");
      const cronometroElem = document.getElementById("cronometro");
      cronometroElem.innerText = "";
      cronometroElem.style.display = "none";

      if (serieActual === 4) {
        instruccionesElem.innerHTML = `
                <h3>Serie ${data.id}: ${data.nombreSeccion}</h3>
                <p>${data.instruccion}</p>
                <p><strong>TIP</strong>: Si no deseas responder la pregunta, solo da click en <strong>"No contestar"</strong>.<p>
                <p><strong>SELECCIONA 2 OPCIONES POR CADA PREGUNTA</strong></p>
                <div id="tiempo-boton">
                <p><strong>Tiempo para esta serie: </strong>${data.duracion} segundos</p>
                <button id="comenzar-serie" class="button is-large has-text-white">Comenzar serie</button>
                </div>
            `;
      } else {
        instruccionesElem.innerHTML = `
                    <h3>Serie ${data.id}: ${data.nombreSeccion}</h3>
                    <p>${data.instruccion}</p>
                    <p><strong>TIP</strong>: Si no deseas responder la pregunta, solo da click en <strong>"No contestar"</strong>.<p>
                    <div id="tiempo-boton">
                    <p><strong>Tiempo para esta serie: </strong>${data.duracion} segundos</p>
                    <button id="comenzar-serie" class="button is-large has-text-white">Comenzar serie</button>
                    </div>
                `;
      }
      document
        .getElementById("comenzar-serie")
        .addEventListener("click", () => {
          document.getElementById("tiempo-boton").remove();
          tiempoSerie = data.duracion;
          iniciarPreguntas(data.preguntas);
        });
    })
    .catch((error) => {
      console.error(
        "Error al traer instrucciones de la siguiente serie:",
        error
      );
    });
}

// ----------------------------------
// EVENTOS INICIALES AL CARGAR LA VISTA
// ----------------------------------
document.getElementById("iniciar-prueba").addEventListener("click", () => {
  document.getElementById("advertencia-inicial").style.display = "none";
  document.getElementById("contenedor-serie").style.display = "block";

  activarBloqueoDeSalida();
  prevenirBotonAtras();

  traerSerie(serieActual);
});

document.getElementById("volver-prueba").addEventListener("click", () => {
  window.history.back();
});

document.getElementById("siguiente-serie") &&
  document.getElementById("siguiente-serie").addEventListener("click", () => {
    const respuestas = [];
    enviarRespuestas(respuestas)
      .then(() => {
        serieActual++;
        if (serieActual <= totalSeries) {
          traerSerie(serieActual);
        } else {
          desactivarBloqueoDeSalida();
          permitirBotonAtras();

          setTimeout(() => {
            alert("¡Has terminado la prueba!");
            window.location.href = "/inicio/aspirante";
          }, 100);
        }
      })
      .catch((error) => {
        console.error("Error al enviar respuestas:", error);
        alert("Hubo un error al guardar tus respuestas.");
      });
  });
