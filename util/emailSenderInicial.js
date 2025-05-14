const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


const sendEmail = async (correo, nombre, usuario, contraseña) => {
  try {
    console.log("Sending email with parameters:", correo, nombre, usuario, contraseña);
    const response = await resend.emails.send({
        from: "testinsightdx@pruebas.psicodx.com",
        to: correo,
        subject: `Hola ${nombre}.`,
        html: `
        <h5>Le enviamos un cordial saludo y por este medio le informamos la manera de acceder a nuestro sistema de pruebas psicométricas y psicológicas 'TestInsightDX' para su proceso de admisión al posgrado aplicado.</h5>
        <br>
        <br>
        Información para acceder: 
        <br>
        <a href="https://softsync.psicodx.com/login">https://softsync.psicodx.com/login</a>
        <br>
        Usuario: ${usuario}
        <br>
        Contraseña: ${contraseña}
        <br>
        <br>
        Dentro del sistema inicialmente, deberá subir sus documentos CV y kárdex, así como contestar nuestro formato entrevista. Posterior a eso debe contestar las pruebas que le fueron asignadas antes de la fecha establecida.
        <br>
        <br>
        Finalmente, le pedimos que en la sección de recordatorios consulte la fecha de la aplicación grupal de una prueba. Le pedimos su asistencia y puntualidad para no afectar la logística de la evaluación.
        <br>
        <br>
        <h6>ATENTAMENTE.  <br> Equipo de Psicólogas PSICODX <br> Proceso de admisión en la parte psicológica</h5>
        `,
    });
    return response;
  } catch (error) {
    throw new Error("Error al enviar correo");
  }
};

module.exports = { sendEmail };
