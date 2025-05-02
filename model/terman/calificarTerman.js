// Modelos
const terman = require('./terman.model');
const modeloTerman = new terman();
const calificacionesTerman = require('../terman/calificacionesTerman.model');
const resultadosSeriesTerman = require('../terman/resultadosSeriesTerman.model');

async function calificarSerieTerman(idSerie, idUsuario, idGrupo, respuestas) {
    const calificacionesModel = new calificacionesTerman(idUsuario, idGrupo);

    // 1. Crear registro si es la primera serie
    if (idSerie === 1) {
        await calificacionesModel.save();
    }

    console.log("Llego a calificarTerman")

    // 2. Traer calificación actual
    const calificacion = await calificacionesModel.fetchCalificacionById(idUsuario, idGrupo);
    const idCalificacionTerman = calificacion[0].idCalificacionTerman;
    let totalAnterior = calificacion[0].puntosTotales;

    // 3. Traer opciones correctas de esa serie
    const opcionesCorrectas = await modeloTerman.fetchOpcionesCorrectasById(idSerie);

    // 4. Calificar según la serie
    let puntuacion = 0;
    let categoria = '';
    let rango = '';

    const seriesHandlers = {
        1: calificarSerie1,
        2: calificarSerie2,
        3: calificarSerie3,
        4: calificarSerie4,
        5: calificarSerie5,
        6: calificarSerie6,
        7: calificarSerie7,
        8: calificarSerie8,
        9: calificarSerie9,
        10: calificarSerie10
    };
    
    const handler = seriesHandlers[idSerie];
    
    if (!handler) {
        throw new Error(`No hay función de calificación definida para la serie ${idSerie}`);
    }
    
    ({ puntuacion, categoria, rango } = handler(respuestas, opcionesCorrectas));
    

    // 5. Guardar resultado de esta serie
    const resultadoModel = new resultadosSeriesTerman(
        idUsuario,
        idGrupo,
        idSerie,
        idCalificacionTerman,
        categoria,
        puntuacion,
        rango
    );
    await resultadoModel.save();

    // 6. Calcular nueva sumatoria
    const nuevoTotal = totalAnterior + puntuacion;
    const nuevoCI = calcularCI(nuevoTotal);
    const nuevoRango = calcularRangoCI(nuevoCI);

    // 7. Actualizar registro global
    await calificacionesModel.updateCalificacionById(
        nuevoTotal,
        nuevoRango,
        nuevoCI,
        idCalificacionTerman
    );

    // DEBUG
    // console.log('Serie', idSerie, '→', { puntuacion, categoria, rango });

    return { idSerie, nuevoTotal, nuevoRango, nuevoCI };
}
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//  Lógicas individuales de cada serie
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function calificarSerie1(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    // Convertimos las respuestas correctas en un Set para acceso rápido
    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    // Por cada respuesta del aspirante, verificamos si es correcta
    respuestas.forEach(resp => {
        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;
        if (correctas.has(clave)) {
            puntuacion += 1;
        }
    });

    const categoria = categoriaSerie(1);
    const rango = calcularRangoSerie(1, puntuacion);

    return { puntuacion, categoria, rango };
}

function calificarSerie2(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    respuestas.forEach(resp => {
        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;
        if (correctas.has(clave)) {
            puntuacion += 1;
        }
    });

    puntuacion *= 2;

    const categoria = categoriaSerie(2);
    const rango = calcularRangoSerie(2, puntuacion);

    return { puntuacion, categoria, rango };
}


function calificarSerie3(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    respuestas.forEach(resp => {
        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;

        if (Number(resp.respuestaAbierta) === 0) {
            // No contestada, no afecta
            return;
        }        

        // Correcta
        if (correctas.has(clave)) {
            puntuacion += 1; 
        // Incorrecta
        } else {
            puntuacion -= 1; 
        }
    });

    const categoria = categoriaSerie(3);
    const rango = calcularRangoSerie(3, puntuacion);

    return { puntuacion, categoria, rango };
}


function calificarSerie4(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    // Creamos un mapa con claves: idPreguntaTerman -> Set de opciones correctas
    const correctasMap = new Map();
    opcionesCorrectas.forEach(({ idPreguntaTerman, opcionTerman }) => {
        if (!correctasMap.has(idPreguntaTerman)) {
            correctasMap.set(idPreguntaTerman, new Set());
        }
        correctasMap.get(idPreguntaTerman).add(opcionTerman);
    });

    // Agrupar respuestas por pregunta
    const respuestasMap = new Map();
    respuestas.forEach(({ idPreguntaTerman, respuestaAbierta }) => {
        if (!respuestasMap.has(idPreguntaTerman)) {
            respuestasMap.set(idPreguntaTerman, []);
        }
        respuestasMap.get(idPreguntaTerman).push(Number(respuestaAbierta));
    });

    // Evaluar por pregunta
    respuestasMap.forEach((opcionesUsuario, idPreguntaTerman) => {
        if (opcionesUsuario.includes(0)) return;

        const opcionesCorrectas = correctasMap.get(idPreguntaTerman);
        if (!opcionesCorrectas) return;

        const setUsuario = new Set(opcionesUsuario);
        const setCorrecto = new Set(opcionesCorrectas);

        // Son correctas si ambas opciones coinciden (ignorar el orden)
        if (
            setUsuario.size === 2 &&
            setUsuario.size === setCorrecto.size &&
            [...setUsuario].every(o => setCorrecto.has(o))
        ) {
            puntuacion += 1;
        }
    });

    const categoria = categoriaSerie(4);
    const rango = calcularRangoSerie(4, puntuacion);

    return { puntuacion, categoria, rango };
}

function calificarSerie5(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Map();
    opcionesCorrectas.forEach(op => {
        // En esta serie la respuesta correcta está en descripcionTerman (como string)
        correctas.set(op.idPreguntaTerman, String(op.descripcionTerman).trim());
    });

    respuestas.forEach(({ idPreguntaTerman, respuestaAbierta }) => {
        if (String(respuestaAbierta).trim() === correctas.get(idPreguntaTerman)) {
            puntuacion += 1;
        }
    });

    puntuacion *= 2;

    const categoria = categoriaSerie(5);
    const rango = calcularRangoSerie(5, puntuacion);

    return { puntuacion, categoria, rango };
}

function calificarSerie6(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    respuestas.forEach(resp => {
        if (Number(resp.respuestaAbierta) === 0) return;

        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;
        if (correctas.has(clave)) {
            puntuacion += 1;
        } else {
            puntuacion -= 1;
        }
    });

    const categoria = categoriaSerie(6);
    const rango = calcularRangoSerie(6, puntuacion);

    return { puntuacion, categoria, rango };
}

function calificarSerie7(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    respuestas.forEach(resp => {
        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;
        if (correctas.has(clave)) {
            puntuacion += 1;
        }
    });

    const categoria = categoriaSerie(7);
    const rango = calcularRangoSerie(7, puntuacion);

    return { puntuacion, categoria, rango };
}

function calificarSerie8(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    respuestas.forEach(resp => {
        if (Number(resp.respuestaAbierta) === 0) {
            // No contestada, no afecta
            return;
        }        

        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;
        if (correctas.has(clave)) {
            puntuacion += 1;
        } else {
            puntuacion -= 1;
        }
    });

    const categoria = categoriaSerie(8);
    const rango = calcularRangoSerie(8, puntuacion);

    return { puntuacion, categoria, rango };
}


function calificarSerie9(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    const correctas = new Set(opcionesCorrectas.map(op => `${op.idPreguntaTerman}-${op.opcionTerman}`));

    respuestas.forEach(resp => {
        const clave = `${resp.idPreguntaTerman}-${resp.respuestaAbierta}`;
        if (correctas.has(clave)) {
            puntuacion += 1;
        }
    });

    const categoria = categoriaSerie(9);
    const rango = calcularRangoSerie(9, puntuacion);

    return { puntuacion, categoria, rango };
}


function calificarSerie10(respuestas, opcionesCorrectas) {
    let puntuacion = 0;

    /* ------------- helper de normalización ------------- */
    const normalizar = v => {
        return String(v ?? '')
            .split('-')          
            .map(s => s.trim())   
            .filter(Boolean)      
            .sort()              
            .join('-');           
    };

    const correctas = new Set(
        opcionesCorrectas.map(op => normalizar(op.descripcionTerman))
    );

    respuestas.forEach(resp => {
        if (!resp.respuestaAbierta || resp.respuestaAbierta === '0 - 0') return;

        if (correctas.has(normalizar(resp.respuestaAbierta))) {
            puntuacion += 1;
        }
    });

    puntuacion *= 2;

    const categoria = categoriaSerie(10);
    const rango = calcularRangoSerie(10, puntuacion);

    return { puntuacion, categoria, rango };
}

//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//  Funciones auxiliares para calcular los atributos de resultadosSeriesTerman
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function categoriaSerie(idSerie) {
    const categorias = {
        1: "Información",
        2: "Juicio",
        3: "Vocabulario",
        4: "Síntesis",
        5: "Concentración",
        6: "Análisis",
        7: "Abstracción",
        8: "Planeación",
        9: "Organización",
        10: "Atención"
    };

    return categorias[idSerie] || "Categoría desconocida";
}


const umbralesPorSerie = {
    1: [
        { limite: 0, rango: "Deficiente" },
        { limite: 8, rango: "Inferior" },
        { limite: 10, rango: "Inferior al termino medio" },
        { limite: 12, rango: "Termino medio" },
        { limite: 14, rango: "Superior al termino medio" },
        { limite: 15, rango: "Superior" },
        { limite: 16, rango: "Excelente" }
    ],
    2: [
        { limite: 0, rango: "Deficiente" },
        { limite: 8, rango: "Inferior" },
        { limite: 10, rango: "Inferior al termino medio" },
        { limite: 12, rango: "Termino medio" },
        { limite: 18, rango: "Superior al termino medio" },
        { limite: 20, rango: "Superior" },
        { limite: 22, rango: "Excelente" }
    ],
    3: [
        { limite: 0, rango: "Deficiente" },
        { limite: 8, rango: "Inferior" },
        { limite: 12, rango: "Inferior al termino medio" },
        { limite: 14, rango: "Termino medio" },
        { limite: 23, rango: "Superior al termino medio" },
        { limite: 27, rango: "Superior" },
        { limite: 29, rango: "Excelente" }
    ],
    4: [
        { limite: 0, rango: "Deficiente" },
        { limite: 6, rango: "Inferior" },
        { limite: 7, rango: "Inferior al termino medio" },
        { limite: 10, rango: "Termino medio" },
        { limite: 14, rango: "Superior al termino medio" },
        { limite: 16, rango: "Superior" },
        { limite: 18, rango: "Excelente" }
    ],
    5: [
        { limite: 0, rango: "Deficiente" },
        { limite: 5, rango: "Inferior" },
        { limite: 7, rango: "Inferior al termino medio" },
        { limite: 10, rango: "Termino medio" },
        { limite: 15, rango: "Superior al termino medio" },
        { limite: 21, rango: "Superior" },
        { limite: 24, rango: "Excelente" }
    ],
    6: [
        { limite: 0, rango: "Deficiente" },
        { limite: 5, rango: "Inferior" },
        { limite: 7, rango: "Inferior al termino medio" },
        { limite: 9, rango: "Termino medio" },
        { limite: 15, rango: "Superior al termino medio" },
        { limite: 18, rango: "Superior" },
        { limite: 20, rango: "Excelente" }
    ],
    7: [
        { limite: 0, rango: "Deficiente" },
        { limite: 5, rango: "Inferior" },
        { limite: 6, rango: "Inferior al termino medio" },
        { limite: 9, rango: "Termino medio" },
        { limite: 16, rango: "Superior al termino medio" },
        { limite: 18, rango: "Superior" },
        { limite: 19, rango: "Excelente" }
    ],
    8: [
        { limite: 0, rango: "Deficiente" },
        { limite: 6, rango: "Inferior" },
        { limite: 7, rango: "Inferior al termino medio" },
        { limite: 8, rango: "Termino medio" },
        { limite: 13, rango: "Superior al termino medio" },
        { limite: 15, rango: "Superior" },
        { limite: 17, rango: "Excelente" }
    ],
    9: [
        { limite: 0, rango: "Deficiente" },
        { limite: 7, rango: "Inferior" },
        { limite: 9, rango: "Inferior al termino medio" },
        { limite: 10, rango: "Termino medio" },
        { limite: 15, rango: "Superior al termino medio" },
        { limite: 17, rango: "Superior" },
        { limite: 18, rango: "Excelente" }
    ],
    10: [
        { limite: 0, rango: "Deficiente" },
        { limite: 5, rango: "Inferior" },
        { limite: 8, rango: "Inferior al termino medio" },
        { limite: 10, rango: "Termino medio" },
        { limite: 12, rango: "Superior al termino medio" },
        { limite: 17, rango: "Superior" },
        { limite: 20, rango: "Excelente" }
    ]
};

function calcularRangoSerie(idSerie, puntaje) {
    const umbrales = umbralesPorSerie[idSerie];

    if (!umbrales) return "Serie desconocida";

    let rangoFinal = "Deficiente";

    for (const { limite, rango } of umbrales) {
        if (puntaje >= limite) {
            rangoFinal = rango;
        } else {
            break;
        };
    };

    return rangoFinal;
};

//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//  Funciones auxiliares para calcular los atributos de calificacionesTerman
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function calcularRangoCI(puntaje) {
    if (puntaje >= 120) return 'Genio';
    if (puntaje >= 111 && puntaje <= 119) return 'Superior';
    if (puntaje >= 80 && puntaje <= 110) return 'Término medio';
    if (puntaje >= 62 && puntaje <= 79) return 'Inferior al término medio';
    if (puntaje >= 0 && puntaje <= 61) return 'Inferior';
    return 'Sin rango definido';
}

const CI_LOOKUP = [
    /*  0 */ 1, 41, 42, 43, 43, 44, 44, 45, 46, 46,
    /* 10 */ 47, 47, 48, 49, 49, 50, 50, 51, 52, 52,
    /* 20 */ 53, 53, 54, 55, 55, 56, 56, 57, 58, 58,
    /* 30 */ 59, 59, 60, 61, 61, 62, 62, 63, 64, 64,
    /* 40 */ 65, 65, 66, 67, 67, 68, 68, 69, 70, 70,
    /* 50 */ 71, 71, 72, 73, 73, 74, 80, 80, 80, 81,
    /* 60 */ 81, 82, 82, 82, 83, 83, 84, 84, 84, 84,
    /* 70 */ 85, 85, 86, 86, 86, 87, 88, 88, 88, 89,
    /* 80 */ 89, 89, 90, 90, 90, 90, 91, 91, 91, 92,
    /* 90 */ 92, 92, 93, 93, 94, 95, 95, 95, 95, 95,
    /*100 */ 96, 96, 96, 97, 97, 97, 98, 98, 99, 99,
    /*110 */ 99, 99,100,101,101,102,102,103,104,104,
    /*120 */102,102,102,103,103,103,103,104,104,104,
    /*130 */104,105,105,105,105,106,106,106,107,107,
    /*140 */107,107,108,108,108,109,109,109,110,110,
    /*150 */110,111,111,111,111,112,113,113,113,114,
    /*160 */114,114,115,115,116,116,117,117,117,118,
    /*170 */118,118,119,119,120            // hasta 174
];

function calcularCI(puntaje) {
    if (puntaje < 0) {
        puntaje = 0;
    };
    // Nadie puede sacar más de 207 puntos con TODAS las pruebas
    if (puntaje > 207) {
        throw new Error(`Puntaje fuera de rango: ${puntaje}`);
    };
    // Cualquier puntuación arriba de 174 y menor o igual a 207, se toma el máximo.
    if (puntaje >= 174) {
        puntaje = 174;
    };

    const nuevoCI = CI_LOOKUP[puntaje];

    console.log("El nuevo CI es: ", nuevoCI);

    return nuevoCI;
}


module.exports = calificarSerieTerman;