const handler = async (m, { conn, usedPrefix, command }) => {
  const texto = `
🌐 *Grupos Oficiales de DolphinBotV3* 🚀

✨ Únete a nuestra comunidad, comparte ideas, reporta errores, o simplemente charla con otros usuarios. ¡Eres bienvenido!

📂 *Lista de grupos:*
1️⃣  *Soporte General*  
https://chat.whatsapp.com/C7B0xV6SZLvEQ6sBfEZCSD

2️⃣  *canal principal*  
https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W

3️⃣  *Testers & Beta*  
https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W

⚠️ Respeta las normas de cada grupo. DolphinBotV3 ama la paz 🎋

─
📌 Usa *.menu* para ver todos los comandos.
`

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    contextInfo: {
      externalAdReply: {
        title: "DolphinBot 🌌",
        body: "Únete a nuestros grupos oficiales",
        thumbnailUrl: 'https://qu.ax/OmQYc.png', // Puedes cambiar la imagen
        sourceUrl: "https://github.com/CARLOSGRCIAGRCIA/DolphinBot",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = /^grupos$/i

export default handler