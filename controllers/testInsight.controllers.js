exports.inicio_psicologa = (request, response, next) => {
  response.render("inicio_psicologa");
};

exports.get_aspirantes = (request, response, next) => {
  response.render("consulta_aspirante");
};
/*
{
    isLoggedIn: request.session.isLoggedIn || false,
    username: request.session.username || " ",
 }*/
