const preguntasCj = document.querySelector(".preguntasCaja");
const contadorTiempo = preguntasCj.querySelector(
  ".temporizadorOtis .tiempoRestante"
);
const respEnviadas = document.querySelector(".enviadasCaja");
const enviarRespuestas = document.querySelector("#enviarRespuestas");

let pregAcum = 0;
let pregNum = 1;
let contTiempo;
let valorTemporizador = 1800; //Segundos de 30 min
let tiempoInicioPregunta = null;

// Llamar a la funciónes
cargarPreguntas();
cronometro(valorTemporizador);

// Función del temporizador
function cronometro(tiempo) {
  contTiempo = setInterval(timer, 1000);
  function timer() {
    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;

    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    contadorTiempo.textContent = `${minutos}:${segundos}`;

    tiempo--;

    if (tiempo < 0) {
      clearInterval(contTiempo);
      contadorTiempo.textContent = "00:00";
    }
  }
  if (tiempo < 0) {
    clearInterval(contTiempo);
    contadorTiempo.textContent = "00:00";

    // Enviar las respuestas automáticamente
    sendRespuestas().then(() => {
      // Redirigir después de enviar
      window.location.href = "/prueba-completada";
    });
  }
}

// Tener un tope para no llegar a preguntas de más
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("sigbtn")) {
    const opciones = document.querySelectorAll(".option input:checked");
    const inputSeleccionado = opciones[0];
    const idPregunta = document
      .querySelector(".option")
      .getAttribute("data-idPregunta");

    const tiempoActual = Date.now();
    const tiempoRespuesta = Math.floor(
      (tiempoActual - tiempoInicioPregunta) / 1000
    ); // segundos

    let respuesta = respuestasSeleccionadas.find(
      (r) => r.idPreguntaOtis === idPregunta
    );

    if (respuesta) {
      respuesta.idOpcion = inputSeleccionado ? inputSeleccionado.value : null;
      respuesta.tiempoRespuesta = tiempoRespuesta;
    } else {
      respuestasSeleccionadas.push({
        idPreguntaOtis: idPregunta,
        idOpcion: inputSeleccionado ? inputSeleccionado.value : null,
        tiempoRespuesta: tiempoRespuesta,
      });
    }

    const botonSig = document.querySelector(".sigbtn");

    if (pregAcum < preguntas.length - 1) {
      pregAcum++;
      pregNum++;
      ensenarPregunta(pregAcum);
      pregContador(pregNum);
      verificarMostrarBoton();

      botonSig.style.visibility = "visible";
    }

    if (pregAcum === preguntas.length - 1) {
      botonSig.style.visibility = "hidden";
      console.log("Preguntas completadas");
    }
  }
});

// Función para verificar si mostrar el botón de enviar respuestas
function verificarMostrarBoton() {
  if (pregNum === preguntas.length) {
    enviarRespuestas.classList.remove("d-none");
  }
}

let preguntas = []; // Arreglo para poder tener las preguntas

// Función para cargar las preguntas desde la base de datos
async function cargarPreguntas() {
  try {
    const response = await fetch("/aspirante/prueba-otis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('input[name="_csrf"]').value,
      },
    });
    const data = await response.json();
    preguntas = data.preguntas;
    if (preguntas.length > 0) {
      ensenarPregunta(0);
      pregContador(1);
    } else {
      console.log("No se encontraron preguntas.");
    }
  } catch (error) {
    console.error("Error al cargar las preguntas:", error);
  }
}

// Función para enseñar cada pregunta junto con su número
function ensenarPregunta(index) {
  const areaTexto = document.querySelector(".areaTexto");
  const pregTexto = document.querySelector(".pregtext");
  const optLista = document.querySelector(".optionList");

  const pregunta = preguntas[index];

  tiempoInicioPregunta = Date.now();

  // Mostrar área
  areaTexto.innerHTML = `<h5>${pregunta.nombreAreaOtis}</h5><hr>`;

  // Mostrar la pregunta
  let pregTag = `<span>${pregunta.num}. ${pregunta.pregunta}</span>`;
  pregTexto.innerHTML = pregTag;

  // Mostrar las opciones
  let optTag = "";
  if (pregunta.opciones && pregunta.opciones.length > 0) {
    pregunta.opciones.forEach((opcion) => {
      optTag += `<div class="option" data-idPregunta="${pregunta.idPreguntaOtis}">
                <input type="radio" name="pregunta${index}" value="${opcion.idOpcionOtis}">
                <span>${opcion.descripcionOpcion}</span>
            </div>`;
    });
  } else {
    console.log("No se encontraron opciones para esta pregunta.");
  }
  optLista.innerHTML = optTag;

  // Asignar el evento onclick a cada opción
  const opcionSelec = optLista.querySelectorAll(".option");
  for (let i = 0; i < opcionSelec.length; i++) {
    opcionSelec[i].setAttribute("onclick", "opcionSeleccionada(this)");
  }

  // Ocultar el botón de siguiente si es la última pregunta
  const botonSiguiente = document.querySelector(".sigbtn");
  if (index === pregunta.length - 1) {
    botonSiguiente.classList.add("d-none");
  } else {
    botonSiguiente.classList.remove("d-none");
  }
}

// Función cuando se selecciona una opción
function opcionSeleccionada(element) {
  const opciones = document.querySelectorAll(".option");
  opciones.forEach((op) => op.classList.remove("selected"));

  element.classList.add("selected");

  const input = element.querySelector("input");
  if (input) {
    input.checked = true;
  }
}

// Tener un contador de en qué pregunta vas (progreso)
function pregContador(index) {
  const barra = document.getElementById("barraProgreso");
  const texto = document.getElementById("textoProgreso");

  if (!barra || !texto || preguntas.length === 0) {
    console.error("No se encontró el elemento de progreso o no hay preguntas.");
    return;
  }

  let porcentaje = Math.floor((index / preguntas.length) * 100);

  barra.style.width = porcentaje + "%";
  texto.textContent = `${porcentaje}% completado`;
}

let respuestasSeleccionadas = [];

// Ocultar el botón de enviar respuestas inicialmente
enviarRespuestas.classList.add("d-none");

const idUsuario = sessionStorage.getItem("idUsuario");
const idGrupo = sessionStorage.getItem("idGrupo");

function guardarUltimaRespuesta() {
  const contenedorPregunta = document
    .querySelector(".option input")
    ?.closest(".option");
  if (!contenedorPregunta) return;

  const idPregunta = contenedorPregunta.getAttribute("data-idPregunta");
  const inputSeleccionado = document.querySelector(".option input:checked");
  const idOpcion = inputSeleccionado ? inputSeleccionado.value : null;

  const tiempoActual = Date.now();
  const tiempoRespuesta = Math.floor(
    (tiempoActual - tiempoInicioPregunta) / 1000
  );

  let respuesta = respuestasSeleccionadas.find(
    (r) => r.idPreguntaOtis === idPregunta
  );
  if (respuesta) {
    respuesta.idOpcion = idOpcion;
    respuesta.tiempoRespuesta = tiempoRespuesta;
  } else {
    respuestasSeleccionadas.push({
      idPreguntaOtis: idPregunta,
      idOpcion: idOpcion,
      tiempoRespuesta: tiempoRespuesta,
    });
  }
}

// Función para enviar las respuestas seleccionadas
async function sendRespuestas() {
  if (respuestasSeleccionadas.length === 0) {
    console.log("No se seleccionaron respuestas.");
    return;
  }

  const datosRespuestas = respuestasSeleccionadas.map((respuesta) => ({
    idUsuario: idUsuario,
    idGrupo: idGrupo,
    idPrueba: 5,
    idPreguntaOtis: respuesta.idPreguntaOtis,
    idOpcionOtis: respuesta.idOpcion,
    tiempoRespuesta: respuesta.tiempoRespuesta,
  }));

  // Enviar las respuestas a la base de datos
  fetch("/aspirante/guardar-selecciones-otis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": document.querySelector('input[name="_csrf"]').value,
    },
    body: JSON.stringify(datosRespuestas),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Hubo un problema al enviar las respuestas.");
      }
    })
    .catch((error) => {
      console.error("Error al enviar las respuestas:", error);
      alert("Error al enviar las respuestas.");
    });
}

enviarRespuestas.addEventListener("click", function () {
  const confirmarEnvio = confirm(
    "¿Estás seguro de que deseas enviar tus respuestas? Una vez enviadas, no podrás cambiarlas."
  );

  if (confirmarEnvio) {
    guardarUltimaRespuesta();
    sendRespuestas();
  }
});
