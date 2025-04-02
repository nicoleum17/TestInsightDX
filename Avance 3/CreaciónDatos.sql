CREATE DATABASE testInsight;
USE testInsight;
CREATE TABLE `grupo` (
  `idGrupo` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `posgrado` varchar(200) COLLATE utf8_spanish2_ci NOT NULL,
  `generacion` varchar(25) COLLATE utf8_spanish2_ci NOT NULL,
  `fechaLimitePrueba` DATETIME(3) NOT NULL,
  `fechaPruebaGrupal` DATETIME(3) NOT NULL,
  `enlaceZoom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

CREATE TABLE `tipoPrueba` (
  `idPrueba` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `nombrePrueba` varchar(150) COLLATE utf8_spanish2_ci NOT NULL,
  `instrucciones` varchar(1000) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

CREATE TABLE `pregunta` (
  `idPregunta` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `opcionA` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
	`opcionB` varchar(100) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

CREATE TABLE `respuesta` (
  `idRespuesta` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `valor` varchar(150) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

CREATE TABLE `seccion` (
  `idSeccion` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `tiempoMaximo` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

ALTER TABLE `respuesta` 
ADD COLUMN idPregunta int;

ALTER TABLE `seccion`
ADD COLUMN idPrueba int;

ALTER TABLE `pregunta`
ADD COLUMN idPrueba int;

ALTER TABLE `pregunta`
ADD COLUMN idSeccion int;

CREATE TABLE `asignado` (
`idGrupo` INT,
`idPrueba` INT);

ALTER TABLE `asignado`
  ADD PRIMARY KEY (`idGrupo`,`idPrueba`);
  
INSERT INTO `grupo` (`posgrado`, `generacion`, `fechaLimitePrueba`, `fechaPruebaGrupal`, `enlaceZoom`) VALUES
('Maestría en Administración', 'ENE-JUN 2023', '2025-06-15', '2025-06-20', 'https://zoom.us/j/1234567890'),
('Maestría en Finanzas', 'AGO-DIC 2022', '2024-05-10', '2024-05-15', 'https://zoom.us/j/0987654321'),
('Doctorado en Ingeniería', 'ENE-JUN 2021', '2025-07-01', '2025-07-05', 'https://zoom.us/j/1122334455'),
('Maestría en Educación', 'AGO-DIC 2025', '2025-08-10', '2025-08-15', 'https://zoom.us/j/6677889900'),
('Doctorado en Ciencias de la Computación', 'ENE-JUN 2020', '2024-09-05', '2024-09-10', 'https://zoom.us/j/5566778899'),
('Maestría en Psicología', 'AGO-DIC 2024', '2026-03-12', '2026-03-17', 'https://zoom.us/j/3344556677'),
('Maestría en Derecho', 'ENE-JUN 2023', '2025-04-25', '2025-04-30', 'https://zoom.us/j/2233445566'),
('Doctorado en Biotecnología', 'AGO-DIC 2022', '2026-02-20', '2026-02-25', 'https://zoom.us/j/4455667788'),
('Maestría en Inteligencia Artificial', 'ENE-JUN 2024', '2026-07-15', '2026-07-20', 'https://zoom.us/j/7788990011'),
('Doctorado en Matemáticas', 'AGO-DIC2021', '2025-10-30', '2025-11-05', 'https://zoom.us/j/9988776655'),
('Maestría en Mercadotecnia', 'ENE-JUN 2025', '2025-12-10', '2025-12-15', 'https://zoom.us/j/1234432111'),
('Doctorado en Física', 'ENE-JUN 2020', '2024-06-18', '2024-06-23', 'https://zoom.us/j/5432167890'),
('Maestría en Energías Renovables', 'AGO-DIC 2024', '2026-09-22', '2026-09-27', 'https://zoom.us/j/7654321987'),
('Doctorado en Economía', 'ENE-JUN 2022', '2026-05-14', '2026-05-19', 'https://zoom.us/j/2345678901'),
('Maestría en Ciencias de Datos', 'AGO-DIC 2023', '2025-11-05', '2025-11-10', 'https://zoom.us/j/8765432109'),
('Maestría en Gestión de Proyectos', 'ENE-JUN 2022', '2024-08-20', '2024-08-25', 'https://zoom.us/j/3456789012'),
('Doctorado en Química', 'ENE-JUN 2021', '2025-09-15', '2025-09-20', 'https://zoom.us/j/4567890123'),
('Maestría en Telecomunicaciones', 'AGO-DIC 2024', '2026-10-12', '2026-10-17', 'https://zoom.us/j/5678901234'),
('Doctorado en Medio Ambiente', 'ENE-JUN 2023', '2027-02-28', '2027-03-05', 'https://zoom.us/j/6789012345'),
('Maestría en Ciencias Políticas', 'AGO-DIC 2022', '2024-07-09', '2024-07-14', 'https://zoom.us/j/7890123456');

INSERT INTO `respuesta` (`valor`, `idPregunta`) VALUES
('a', 1),
('b', 1),
('a', 2),
('b', 2),
('a', 3),
('b', 3),
('a', 4),
('b', 4),
('a', 5),
('b', 5),
('a', 6),
('b', 6),
('a', 7),
('b', 7),
('a', 8),
('b', 8),
('a', 9),
('b', 9),
('a', 10),
('b', 10);

INSERT INTO `respuesta` (`valor`, `idPregunta`) VALUES
('a', 11),
('b', 11),
('a', 12),
('b', 12),
('a', 13),
('b', 13),
('a', 14),
('b', 14),
('a', 15),
('b', 15),
('a', 16),
('b', 16),
('a', 17),
('b', 17),
('a', 18),
('b', 18),
('a', 19),
('b', 19),
('a', 20),
('b', 20);

INSERT INTO tipoPrueba (`idPrueba`, `nombrePrueba`, `instrucciones`) VALUES 
(1, 'Kostic', 'Hay 90 pares de frases, Ud. debe escoger de cada par aquella frase que sea más afín con su forma
de ser o de pensar. A veces tendrá la impresión de que ninguna refleja esa afinidad o, al
contrario, que ambas lo hacen; en todo caso, Ud. debe optar por alguna de las dos.');

INSERT INTO Seccion (`tiempoMaximo`, `idPrueba`) VALUES
(30, 1);

ALTER TABLE `seccion`
ADD CONSTRAINT `seccion_ibfk_1` FOREIGN KEY (`idPrueba`) REFERENCES `tipoPrueba` (`idPrueba`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO pregunta (`opcionA`, `opcionB`, `idSeccion`,`idPrueba`) VALUES
( 'Soy trabajador tenaz', 'No soy de humor variable', 1, 1),
( 'Me gusta hacer el trabajo mejor que los demás', 'Me gusta seguir con lo que he empezado hasta terminarlo', 1, 1),
( 'Me gusta enseñar a la gente como hacer las cosas', 'Me gusta hacer las cosas lo mejor posible', 1, 1),
( 'Me gusta hacer cosas graciosas', 'Me gusta decir a la gente lo que tiene que hacer', 1, 1),
( 'Me gusta pertenecer a grupos', 'Me gusta ser tomado en cuenta en los grupos', 1, 1),
( 'Me gusta hacer un amigo íntimo', 'Me gusta hacer amistad con el grupo', 1, 1),
( 'Soy rápido en cambiar cuando lo creo necesario', 'Intento hacer amigos íntimos', 1, 1),
( 'Me gusta devolverla cuando alguien me ofende', 'Me gusta hacer cosas nuevas o diferentes', 1, 1),
( 'Quiero que mi jefe me estime', 'Me gusta decir a la gente cuando están equivocados', 1, 1),
( 'Me gusta seguir las instrucciones que se dan', 'Me gusta agradar a mis superiores', 1, 1),
( 'Me esfuerzo mucho', 'Soy ordenado, pongo todo en su sitio', 1, 1),
( 'Consigo que la gente haga lo que yo quiero', 'No me altero fácilmente', 1, 1),
( 'Me gusta decir al grupo lo que tiene que hacer', 'Siempre continúo un trabajo hasta que este hecho', 1, 1),
( 'Me gusta ser animado e interesante', 'Yo quiero tener mucho éxito', 1, 1),
( 'Me gusta ¨encajar¨ con grupos', 'Me gusta ayudar a las personas a tomar decisiones', 1, 1),
( 'Me preocupa cuando alguien no me estima', 'Me gusta que la gente note mi presencia', 1, 1),
( 'Me gusta probar cosas nuevas', 'Prefiero trabajar con otras personas que solo', 1, 1),
( 'Algunas veces culpo a otros cuando las cosas salen mal', 'Me molesta cuando no le gusto a alguien', 1, 1),
( 'Me gusta complacer a mis superiores', 'Me gusta intentar trabajos nuevos y diferentes', 1, 1),
( 'Me gusta tener instrucciones detalladas para hacer un trabajo', 'Me gusta decírselo a la gente cuando me enfada', 1, 1);

ALTER TABLE `respuesta`
ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`idPregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `asignado`
ADD CONSTRAINT `asignado_ibfk_1` FOREIGN KEY (`idGrupo`) REFERENCES `grupo` (`idGrupo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `asignado`
ADD CONSTRAINT `asignado_ibfk_2` FOREIGN KEY (`idPrueba`) REFERENCES `tipoPrueba` (`idPrueba`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `pregunta`
ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`idPrueba`) REFERENCES `tipoPrueba` (`idPrueba`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `pregunta`
ADD CONSTRAINT `pregunta_ibfk_2` FOREIGN KEY (`idSeccion`) REFERENCES `seccion` (`idSeccion`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO asignado (`idGrupo`, `idPrueba`) VALUES 
(1,1),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1),
(7,1),
(8,1),
(9,1),
(10,1);

SELECT * FROM grupo;
SELECT posgrado FROM grupo;
SELECT posgrado FROM grupo as G WHERE generacion = "ENE-JUN 2023";
SELECT * FROM respuesta WHERE valor = 'a'; 
SELECT fechaLimitePrueba FROM asignado as A, grupo as G, tipoPrueba as tp WHERE A.idGrupo = G.idGrupo AND A.idPrueba = tp.idPrueba AND G.generacion = "ENE-JUN 2023";
SELECT * FROM respuesta;

-- Psicologa
CREATE TABLE `Psicologa` (
`Usuario` VARCHAR(20) COLLATE utf8mb4_spanish_ci NOT NULL,
`Contrasena` VARCHAR(30) COLLATE utf8mb4_spanish_ci NOT NULL,
`NombrePsicologa` VARCHAR(100) COLLATE utf8mb4_spanish_ci NOT NULL,
`FechaDisponibilidad` DATE NOT NULL
);

INSERT INTO `Psicologa` (`Usuario`, `Contrasena`, `NombrePsicologa`, `FechaDisponibilidad`) VALUES
('clau_cook01', 'ClaudiaCook315', 'Claudia Cook', '2025-04-24'),
('claudia_clv02', 'ClauCalvo256', 'Claudia Calvo', '2025-04-25'),
('rosa_machuca03', 'RosaliaMachuca764', 'Rosalia Machuca', '2025-04-20');

-- Aspirantes
CREATE TABLE `Aspirante` (
    `Usuario` VARCHAR(20) COLLATE utf8mb4_spanish_ci NOT NULL,
    `Contrasena` VARCHAR(30) COLLATE utf8mb4_spanish_ci NOT NULL,
    `CodigoIdentidad` VARCHAR(20) COLLATE utf8mb4_spanish_ci NOT NULL,
    `Nombres` VARCHAR(100) COLLATE utf8mb4_spanish_ci NOT NULL,
    `ApellidoPaterno` VARCHAR(50) COLLATE utf8mb4_spanish_ci NOT NULL,
    `ApellidoMaterno` VARCHAR(50) COLLATE utf8mb4_spanish_ci NOT NULL,
    `NumTelefono` VARCHAR(20) NOT NULL,
    `LugarOrigen` VARCHAR(100) COLLATE utf8mb4_spanish_ci NOT NULL,
    `Correo` VARCHAR(100) COLLATE utf8mb4_spanish_ci NOT NULL,
    `UniversidadOrigen` VARCHAR(100) COLLATE utf8mb4_spanish_ci NOT NULL
);

INSERT INTO `Aspirante` (`Usuario`, `Contrasena`, `CodigoIdentidad`, `Nombres`, `ApellidoPaterno`, `ApellidoMaterno`, `NumTelefono`, `LugarOrigen`, `Correo`, `UniversidadOrigen`) VALUES
('veronica.mendoza', '830506VM!', 'MERV830506MDGNYR5', 'Verónica', 'Mendoza', 'Reyes', '6186490327', 'Durango', 'veronicamenre@gmail.com', 'UNAM'),
('andrea.velasquez', '840620AV@', 'VERA840620MHGLMN8', 'Andrea', 'Velásquez', 'Romero', '7716498731', 'Hidalgo', 'andreavero32@outlook.com', 'ITESM'),
('luna.chavez', '940522LC#', 'CACL940522MMNHRN2', 'Luna', 'Chávez', 'Cruz', '4493800167', 'Michoacán', 'lunachacru@hotmail.com', 'ITAM'),
('juan.carlos.castillo', '820203JCG@', 'CAJJ820203HMSSRN1', 'Juan Carlos', 'Castillo', 'González', '3712973496', 'Morelos', 'jcarloscasgonz55@outlook.com', 'UVM'),
('jorge.diaz', '010723JD!', 'DIRJ010723HOCZJR3', 'Jorge', 'Díaz', 'Rojas', '2108943716', 'Oaxaca', 'diazrojasjor99@yahoo.com', 'UNAM'),
('lucia.hernandez', '961104LH@', 'HEML961104MNTRRC0', 'Lucía', 'Hernández', 'Moreno', '1342263499', 'Nayarit', 'lucihrdzmo94@gmail.com', 'UAM'),
('matias.pina', '800422MP$', 'PIRM800422HPLNZT4', 'Matías', 'Piña', 'Ruíz', '4623261762', 'Puebla', 'matipiru24@yahoo.com', 'IPN'),
('emilio.hernandez', '881027EH!', 'HESE881027HQTRNM2', 'Emilio', 'Hernández', 'Sánchez', '2561349786', 'Querétaro', 'emihdsan642@hotmail.com', 'ITESM'),
('alejandra.garcia', '970509AG@', 'GAMA970509MQRRNL5', 'Alejandra', 'García', 'Mendoza', '345989553', 'Quintana Roo', 'alegarmen22@gmail.com', 'IPN'),
('pedro.gutierrez', '990504GT#', 'GUTP990504HCMTRD6', 'Pedro', 'Gutiérrez', 'Torres', '24495568984', 'Colima', 'gutitopedro33@hotmail.com', 'IBERO'),
('carlos.martinez', '740915CM!', 'MART740915HDFRTN8', 'Carlos', 'Martínez', 'Rodríguez', '5542368745', 'Ciudad de México', 'carlos.martinez@outlook.com', 'UAM'),
('maria.sanchez', '890725MS$', 'SANM890725MDFNRC9', 'María', 'Sánchez', 'Flores', '5572896341', 'Jalisco', 'maria.sanchez@gmail.com', 'ITESM'),
('fernando.lopez', '821230FL#', 'LOPE821230HDFPLN1', 'Fernando', 'López', 'Pérez', '3319824173', 'Nuevo León', 'fernando.lopez@hotmail.com', 'UNAM'),
('elena.garcia', '950615EG!', 'GARE950615MDFCLL5', 'Elena', 'García', 'Cortés', '4435173965', 'Michoacán', 'elena.garcia@outlook.com', 'UVM'),
('oscar.morales', '770419OM@', 'MORO770419HDFRLS6', 'Oscar', 'Morales', 'Sánchez', '7223875268', 'Estado de México', 'oscar.morales@gmail.com', 'IPN'),
('luisa.jimenez', '860507LJ#', 'JIML860507MDFMNS9', 'Luisa', 'Jiménez', 'Navarro', '5514769832', 'Veracruz', 'luisa.jimenez@yahoo.com', 'UAM'),
('julio.martinez', '940212JM$', 'MART940212HDFRTU2', 'Julio', 'Martínez', 'Gutiérrez', '6624187234', 'Sonora', 'julio.martinez@outlook.com', 'ITESM'),
('patricia.gomez', '750604PG!', 'GOMP750604MDFMNS0', 'Patricia', 'Gómez', 'Morales', '7146531209', 'Puebla', 'patricia.gomez@gmail.com', 'IPN'),
('luis.rodriguez', '810710LR#', 'RODL810710HDFDNN3', 'Luis', 'Rodríguez', 'Pérez', '7552619825', 'Guanajuato', 'luis.rodriguez@outlook.com', 'UNAM'),
('ana.perez', '890322AP@', 'PEZA890322MDFRSN8', 'Ana', 'Pérez', 'Sánchez', '6643897210', 'Baja California', 'ana.perez@yahoo.com', 'UAM');

-- Reporte

CREATE TABLE `Reporte` (
    `IDReporte` varchar(10) COLLATE utf8_spanish_ci NOT NULL,
    `urlReporte` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
    `FechaGeneracionReporte` date NOT NULL
);

INSERT INTO `Reporte` (`IDReporte`, `urlReporte`, `FechaGeneracionReporte`, `CodigoIdentidad`, `Usuario`) VALUES
('R000000001', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271c41', '2025-05-03', 'MERV830506MDGNYR5', 'clau_cook01'),
('R000000002', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271c92', '2024-08-12', 'VERA840620MHGLMN8', 'claudia_clv02'),
('R000000003', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271d73', '2024-11-25', 'CACL940522MMNHRN2', 'rosa_machuca03'),
('R000000004', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c1729c91', '2025-02-09','CAJJ820203HMSSRN1', 'clau_cook01' ),
('R000000005', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271cf4', '2024-07-17','DIRJ010723HOCZJR3', 'claudia_clv02'),
('R000000006', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f8b5c9271c91', '2025-01-30','HEML961104MNTRRC0', 'rosa_machuca03'),
('R000000007', 'https://www.psicometrixreport.com/resultado/5f8d9c16-381f-47e7-80c3-f5b8c9271c91', '2024-06-22','PIRM800422HPLNZT4', 'clau_cook01'),
('R000000008', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321g-47e7-80c3-f5b8c9271c91', '2022-03-14','HESE881027HQTRNM2', 'claudia_clv02'),
('R000000009', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-90c7-f5b8c9271c91', '2024-09-07','GAMA970509MQRRNL5', 'rosa_machuca03'),
('R000000010', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271c91', '2023-04-18','GUTP990504HCMTRD6', 'clau_cook01'),
('R000000011', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e12', '2021-12-28','MART740915HDFRTN8', 'claudia_clv02'),
('R000000012', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e23', '2023-11-05','SANM890725MDFNRC9', 'rosa_machuca03'),
('R000000013', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e34', '2022-08-19','LOPE821230HDFPLN1', 'clau_cook01'),
('R000000014', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e45', '2024-05-26','GARE950615MDFCLL5', 'claudia_clv02'),
('R000000015', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e56', '2021-07-13','MORO770419HDFRLS6', 'rosa_machuca03'),
('R000000016', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e67', '2023-09-02','JIML860507MDFMNS9', 'clau_cook01'),
('R000000017', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e78', '2022-02-21','MART940212HDFRTU2', 'claudia_clv02'),
('R000000018', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e89', '2024-10-15','GOMP750604MDFMNS0', 'rosa_machuca03'),
('R000000019', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e90', '2021-06-08','RODL810710HDFDNN3', 'clau_cook01'),
('R000000020', 'https://www.psicometrixreport.com/resultado/5f8d6c19-321f-47e7-80c3-f5b8c9271e91', '2023-04-24','PEZA890322MDFRSN8', 'claudia_clv02');

CREATE TABLE `rol` (
`idRol` int auto_increment PRIMARY KEY NOT NULL, 
`nombreRol` VARCHAR(50) NOT NULL ); 

INSERT INTO `rol` (`nombreRol`) VALUES 
('Psicologa'),
('Aspirante');

ALTER TABLE `psicologa`
ADD COLUMN idRol int;

ALTER TABLE `aspirante`
ADD COLUMN idRol int;

ALTER TABLE `aspirante`
ADD CONSTRAINT `aspirante_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `psicologa`
ADD CONSTRAINT `psicologa_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `responde` (
  `idPregunta` int NOT NULL,
  `CodigoIdentidad` VARCHAR(20) COLLATE utf8_spanish2_ci NOT NULL, 
  `idPrueba` int NOT NULL,
  `idRespuesta` int NOT NULL,
  `fecha` date NOT NULL,
  `tiempoRespuesta` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

ALTER TABLE `responde`
  ADD PRIMARY KEY (`idPregunta`,`CodigoIdentidad`,`idPrueba`,`idRespuesta`, `fecha`);

ALTER TABLE `Aspirante`
ADD PRIMARY KEY (`CodigoIdentidad`);

ALTER TABLE `responde`
MODIFY COLUMN CodigoIdentidad VARCHAR(20) COLLATE utf8mb4_spanish_ci NOT NULL;

ALTER TABLE `responde`
  ADD CONSTRAINT `responde_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`idPregunta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `responde_ibfk_2` FOREIGN KEY (`CodigoIdentidad`) REFERENCES `Aspirante` (`CodigoIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `responde_ibfk_3` FOREIGN KEY (`idPrueba`) REFERENCES `tipoPrueba` (`idPrueba`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `responde_ibfk_4` FOREIGN KEY (`idRespuesta`) REFERENCES `respuesta` (`idRespuesta`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Psicologa`
ADD PRIMARY KEY (`Usuario`);

ALTER TABLE `Reporte`
ADD COLUMN CodigoIdentidad VARCHAR(20);

ALTER TABLE `Reporte`
ADD COLUMN Usuario VARCHAR(20) COLLATE utf8mb4_spanish_ci NOT NULL;

ALTER TABLE `Reporte`
ADD PRIMARY KEY (`IDReporte`);

ALTER TABLE `Reporte`
modify COLUMN CodigoIdentidad VARCHAR(20) COLLATE utf8mb4_spanish_ci NOT NULL;

ALTER TABLE `Reporte`
ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`CodigoIdentidad`) REFERENCES `Aspirante` (`CodigoIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Reporte`
ADD CONSTRAINT `reporte_ibfk_2` FOREIGN KEY (`Usuario`) REFERENCES `Psicologa` (`Usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
