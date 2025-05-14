const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (correo, nombre, token) => {
  try {
    console.log("Sending email with parameters:", correo, nombre, token);
    const response = await resend.emails.send({
      from: "testinsightdx@pruebas.psicodx.com",
      to: correo,
      subject: `${nombre}, Ingresa a TestInsight DX`,
      html: `
      <h1>TestInsight DX Access Token</h1><br><h4>Tu token de acceso es: ${token}</h4><br><p>Tu token es personal y de un sólo uso, no lo compartas con nadie.</p><br><p>Tu token expira en 10 minutos</p>
      `,
    })
    return response;
  } catch (error) {
    throw new Error("Error al enviar correo");
  }
};

module.exports = { sendEmail };
