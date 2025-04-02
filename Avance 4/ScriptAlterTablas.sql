
ALTER TABLE `aspirantes`
  ADD PRIMARY KEY (`codigoIdentidad`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);
  
  ALTER TABLE `grupos`
  ADD PRIMARY KEY (`idGrupo`);
  
  ALTER TABLE `opciones16PF`
  ADD PRIMARY KEY (`idOpcion16PF`),
  ADD KEY `opciones16PF_ibfk_1` (`idPregunta16PF`);
  
  ALTER TABLE `opcionesKostick`
  ADD PRIMARY KEY (`idOpcionKostick`),
  ADD KEY `opcionesKostick_ibfk_1` (`idPreguntaKostick`);
  
  ALTER TABLE `permisos`
  ADD PRIMARY KEY (`idPermiso`);
  
  ALTER TABLE `perteneceGrupo`
  ADD PRIMARY KEY (`idUsuario`,`idGrupo`),
  ADD KEY `perteneceGrupo_ibfk_2` (`idGrupo`);
  
  ALTER TABLE `preguntas16PF`
  ADD PRIMARY KEY (`idPregunta16PF`),
  ADD KEY `preguntas16PF_ibfk_1` (`idPrueba`);
  
  ALTER TABLE `preguntasKostick`
  ADD PRIMARY KEY (`idPreguntaKostick`),
  ADD KEY `preguntasKostick_ibfk_1` (`idPrueba`);
  
  ALTER TABLE `pruebas`
  ADD PRIMARY KEY (`idPrueba`);
  
  ALTER TABLE `psicologas`
  ADD PRIMARY KEY (`idPsicologa`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);
  
  ALTER TABLE `responde16PF`
  ADD PRIMARY KEY (`idPregunta16PF`,`idGrupo`,`codigoIdentidad`),
  ADD KEY `responde16PF_ibfk_1` (`idGrupo`),
  ADD KEY `responde16PF_ibfk_2` (`codigoIdentidad`);
  
  ALTER TABLE `respondeKostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idGrupo`,`codigoIdentidad`),
  ADD KEY `respondeKostick_ibfk_1` (`idGrupo`),
  ADD KEY `respondeKostick_ibfk_2` (`codigoIdentidad`),
  ADD KEY `respondeKostick_ibfk_4` (`idOpcionKostick`);
  
  ALTER TABLE `roles`
  ADD PRIMARY KEY (`idRol`);
  
  ALTER TABLE `tiene16PF`
  ADD PRIMARY KEY (`idPregunta16PF`,`idPrueba`);
  
  ALTER TABLE `tieneKostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idPrueba`);
  
ALTER TABLE `tienePermiso`
  ADD PRIMARY KEY (`idRol`,`idPermiso`),
  ADD KEY `tienePermiso_ibfk_2` (`idPermiso`);
  
  ALTER TABLE `tienePruebas`
  ADD KEY `tienePruebas_ibfk_2` (`idPrueba`),
  ADD KEY `tienePruebas_ibfk_1` (`idGrupo`);
  
  ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`idRol`);
  
  ALTER TABLE `usuarios`
  ADD primary key (`idUsuario`);
  
  ALTER TABLE `respuestaspreguntasformatos`
  ADD PRIMARY KEY (`idFormato`,`idPregunta`);

ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`idPregunta`);
  
  ALTER TABLE `formatoentrevista`
  ADD PRIMARY KEY (`idFormato`);