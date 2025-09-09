import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://qu.ax/OmQYc.png'

  if (chat.welcome) {
    let img
    try {
      let pp = await conn.profilePictureUrl(who, 'image')
      img = await (await fetch(pp)).buffer()
    } catch {
      img = await (await fetch(defaultImage)).buffer()
    }

    let defaultWelcome = `┏━〔 *Nuevo Pez* 〕━┓
 Usuario: ${taguser}
 Grupo: *${groupMetadata.subject}*

  ¡Un nuevo pez llega al acuario!
 Dolphin dice: "Te estaré vigilando"
 No hagas mmds o te al dejo caer
`

    let defaultLeave = `┏━〔 *Se Rajó* 〕━┓
 Usuario: ${taguser}
 Grupo: *${groupMetadata.subject}*

 🐬 ${taguser} no aguantó la presión
 Se fue nadando como delfín homosexual
`

    let defaultKick = `┏━〔 *Baneado* 〕━┓
 Usuario: ${taguser}
 Grupo: *${groupMetadata.subject}*

 ${taguser} fue baneado!
 Adiós pescadito" 🐬
 Ya valió Verga, se lo llevó la corriente
`

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = chat.customWelcome || defaultWelcome
      bienvenida = bienvenida
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })

    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let leave = chat.customLeave || defaultLeave
      leave = leave
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: leave, mentions: [who] })

    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      let kick = chat.customKick || defaultKick
      kick = kick
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: kick, mentions: [who] })
    }
  }

  return true
}