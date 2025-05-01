const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN_INICIAL,
});

const sentFrom = new Sender(
  "testInsightdx@test-q3enl6kkdr842vwr.mlsender.net",
  "TestInsight DX"
);

const sendEmail = async (correo, nombre, usuario, contraseña) => {
  try {
    console.log("Sending email with parameters:", correo, nombre, usuario, contraseña);
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setSubject(`Hola ${nombre}.`)
      .setHtml(
        "<h5>Le enviamos un cordial saludo y por este medio le informamos la manera de acceder a nuestro sistema de pruebas psicométricas y psicológicas 'TestInsightDX' para su proceso de admisión al posgrado aplicado." 
        + "<br><br>Información para acceder: <br>" +
        "https://softsync.psicodx.com/login" + 
        "<br>Usuario: " + usuario + "<br>Contraseña: " + contraseña +  
        "<br><br> Dentro del sistema inicialmente, deberá subir sus documentos CV y kárdex, así como contestar nuestro formato entrevista. Posterior a eso debe contestar las pruebas que le fueron asignadas antes de la fecha establecida." + 
        "<br> Finalmente, le pedimos que en la sección de recordatorios consulte la fecha de la aplicación grupal de una prueba. Le pedimos su asistencia y puntualidad para no afectar la logística de la evaluación. " + 
        " <h6><br> ATENTAMENTE.  <br> Equipo de Psicólogas PSICODX <br> Proceso de admisión en la parte psicológica</h5>"
      )
      .setTo([new Recipient(correo)])
      .setPersonalization([
        {
          email: correo,
          data: {
            nombre: nombre,
            usuario: usuario,
            contraseña: contraseña,
          },
        },
      ]);
    const response = await mailerSend.email.send(emailParams);
    return response;
  } catch (error) {
    throw new Error("Error al enviar correo");
  }
};

module.exports = { sendEmail };
