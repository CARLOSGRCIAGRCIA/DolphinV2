import axios from "axios";

// Función para generar imagen a partir de un prompt
async function generarImagen(prompt) {
  try {
    const response = await axios.post(
      "https://hf.space/embed/Asahina2K/animagine-xl-3.1/api/predict/",
      {
        data: [prompt],
        fn_index: 0
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const salida = response.data?.data?.[0]?.name;
    if (!salida) throw new Error("No se pudo obtener la imagen de la respuesta");

    return {
      url: "https://huggingface.co" + salida,
      err: false
    };
  } catch (error) {
    console.error("Error al generar imagen:", error.message);
    return {
      err: true,
      msg: "Error al generar imagen. Intenta de nuevo más tarde."
    };
  }
}

// Manejador del comando
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `Por favor ingresa un *prompt* para generar una imagen.\nEjemplo:\n${usedPrefix + command} chica anime cabello blanco ojos rojos`
    );

  await m.react("🎨");
  await m.reply("⏳ Generando imagen...");

  const resultado = await generarImagen(text);

  if (resultado.err) return m.reply(resultado.msg);

  try {
    await conn.sendMessage(
      m.chat,
      {
        image: { url: resultado.url },
        caption: `*Animagine XL 3.1*\nPrompt: ${text}`
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error al enviar imagen:", e.message);
    return m.reply("No se pudo enviar la imagen al chat.");
  }
};

handler.help = ['animagine <prompt>'];
handler.tags = ['ai', 'herramientas'];
handler.command = /^(animagine)$/i;

handler.limit = true;
handler.register = true;

export default handler;