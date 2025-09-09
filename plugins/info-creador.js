let handler = async (m, { conn, usedPrefix }) => {
  let creatorNumber = '5219516526675'
  let creatorName = '𝘾𝙖𝙧𝙡𝙤𝙨 𝙂'
  let channelLink = 'https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W'

  let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${creatorName};;;
FN:${creatorName}
TEL;type=CELL;type=VOICE;waid=${creatorNumber}:${creatorNumber}
END:VCARD`.trim()

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: creatorName,
      contacts: [{ vcard }]
    }
  }, { quoted: m })

  let sections = [
    {
      title: "Opciones del Creador",
      rows: [
        { title: "📞 Contactar por WhatsApp", rowId: `https://wa.me/${creatorNumber}` },
        { title: "📣 Ir al Canal Oficial", rowId: channelLink }
      ]
    }
  ]

  let listMessage = {
    text: '👑 *Creador del Bot*',
    footer: 'Selecciona una opción 👇',
    title: `${creatorName}`,
    buttonText: "📋 Ver opciones",
    sections
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

handler.command = ['owner', 'creador', 'dueño']
export default handler