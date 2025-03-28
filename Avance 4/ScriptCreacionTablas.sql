CREATE DATABASE testInsight;
USE testInsight;

CREATE TABLE `permisos` (
  `idPermiso` int(11) NOT NULL,
  `permiso` varchar(80) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tienePermiso` (
  `idRol` int(11) NOT NULL,
  `idPermiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `roles` (
  `idRol` int(11) NOT NULL,
  `nombreRol` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `idUsuario` varchar(36) NOT NULL,
  `usuario` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `contraseña` varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `aspirantes` (
  `codigoIdentidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idUsuario` varchar(36) DEFAULT NULL,
  `nombres` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `apellidoPaterno` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `apellidoMaterno` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `numTelefono` bigint(20) NOT NULL,
  `lugarOrigen` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `universidadOrigen` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `psicologas` (
  `idPsicologa` varchar(36) NOT NULL,
  `idUsuario` varchar(36) DEFAULT NULL,
  `nombrePsicologa` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `fechaDisponibilidad` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `perteneceGrupo` (
  `idUsuario` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idGrupo` varchar(36) NOT NULL,
  `fechaZoomIndividual` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE grupos (
  idGrupo varchar(36) NOT NULL,
  posgrado varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  generacion varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  archivoPdf varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NULL,
  archivoFoda varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tienePruebas` (
  `idGrupo` varchar(36) NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `fechaLimitePrueba` datetime(3) NOT NULL,
  `fechaPruebaGrupal` datetime(3) NOT NULL,
  `enlaceZoom` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pruebas` (
  `idPrueba` int(11) NOT NULL,
  `duracion` int(5) NOT NULL,
  `instrucciones` text CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `nombrePrueba` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntasKostick` (
  `idPreguntaKostick` varchar(36) NOT NULL,
  `numeroPreguntaKostick` int(11) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opcionesKostick` (
  `idOpcionKostick` varchar(36) NOT NULL,
  `opcionKostick` varchar(1) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `descripcionOpcionKostick` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPreguntaKostick` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tieneKostick` (
  `idPreguntaKostick` varchar(36) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `respondeKostick` (
  `idPreguntaKostick` varchar(36) NOT NULL,
  `idGrupo` varchar(36) NOT NULL,
  `codigoIdentidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idOpcionKostick` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntas16PF` (
  `idPregunta16PF` varchar(36) NOT NULL,
  `pregunta16PF` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `numeroPregunta16PF` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opciones16pf` (
  `idOpcion16PF` int(11) NOT NULL,
  `opcion16PF` varchar(5) NOT NULL,
  `descripcionOpcion16PF` varchar(250) NOT NULL,
  `idPregunta16PF` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tiene16PF` (
  `idPregunta16PF` varchar(36) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responde16pf` (
  `idPregunta16PF` varchar(36) NOT NULL,
  `idGrupo` varchar(36) NOT NULL,
  `codigoIdentidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `respuestaspreguntasformatos` (
  `idFormato` varchar(36) NOT NULL,
  `idPregunta` int(3) NOT NULL,
  `respuesta` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pregunta` (
  `idPregunta` int(3) NOT NULL,
  `Pregunta` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `formatoentrevista` (
  `idFormato` varchar(36) NOT NULL,
  `nombre` text DEFAULT NULL,
  `apellidoP` varchar(50) DEFAULT NULL,
  `apellidoM` varchar(50) DEFAULT NULL,
  `fechaActual` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fechaNacimiento` date DEFAULT NULL,
  `genero` varchar(50) DEFAULT NULL,
  `nacionalidad` text DEFAULT NULL,
  `edad` int(2) DEFAULT NULL,
  `estadoCivil` text DEFAULT NULL,
  `origen` text DEFAULT NULL,
  `telefono` int(15) DEFAULT NULL,
  `celular` int(15) DEFAULT NULL,
  `correo` text DEFAULT NULL,
  `direccionA` text DEFAULT NULL,
  `codigoIdentidad` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
