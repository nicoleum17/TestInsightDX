const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN,
});

const sentFrom = new Sender(
  "testinsightdx@softsync.psicodx.com",
  "TestInsight DX"
);

const sendEmail = async (correo, nombre, token) => {
  try {
    console.log("Sending email with parameters:", correo, nombre, token);
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setSubject(`${nombre}, Ingresa a TestInsight DX`)
      .setHtml(
        "<h1>TestInsight DX Access Token</h1><br><h4>Tu token de acceso es: " +
          token +
          "</h4><br><p>Tu token es personal y de un sólo uso, no lo compartas con nadie.</p><br><p>Tu token expira en 10 minutos</p>"
      )
      .setTo([new Recipient(correo)])
      .setPersonalization([
        {
          correo: correo,
          nombre: nombre,
          token: token,
        },
      ]);
    const response = await mailerSend.email.send(emailParams);
    return response;
  } catch (error) {
    console.error("Error sending email:", error); // Log the error
    throw new Error("Error al enviar correo");
  }
};

module.exports = { sendEmail };
