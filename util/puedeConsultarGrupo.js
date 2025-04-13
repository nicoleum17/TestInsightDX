module.exports = (request, response, next) => {
  for (let privilegio of request.session.privilegios) {
    if (privilegio.permiso == "consultar grupo") {
      return next();
    }
  }
  return response
    .status(403)
    .send("Tus acciones han sido registradas y reportadas al superadmin");
};
