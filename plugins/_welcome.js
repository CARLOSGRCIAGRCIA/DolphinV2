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

    let defaultWelcome = `┏━〔 *𝑵𝒆𝒘 𝑭𝒊𝒔𝒉* 〕━┓
 𝑼𝒔𝒆𝒓: ${taguser}
 𝐆𝐫𝐨𝐮𝐩: *${groupMetadata.subject}*

  ¡𝐀 𝐧𝐞𝐰 𝐟𝐢𝐬𝐡 𝐚𝐫𝐫𝐢𝐯𝐞𝐬 𝐚𝐭 𝐭𝐡𝐞 𝐚𝐪𝐮𝐚𝐫𝐢𝐮𝐦!
  𝐃𝐨𝐥𝐩𝐡𝐢𝐧: “𝐈'𝐥𝐥 𝐛𝐞 𝐰𝐚𝐭𝐜𝐡𝐢𝐧𝐠 𝐲𝐨𝐮.”
`

    let defaultLeave = `┏━〔 *𝑯𝒆 𝒄𝒉𝒊𝒄𝒌𝒆𝒏𝒆𝒅 𝒐𝒖𝒕* 〕━┓
 𝑼𝒔𝒆𝒓: ${taguser}
 𝐆𝐫𝐨𝐮𝐩: *${groupMetadata.subject}*

 🐬 ${taguser} 𝑯𝒆 𝒄𝒐𝒖𝒍𝒅𝒏'𝒕 𝒉𝒂𝒏𝒅𝒍𝒆 𝒕𝒉𝒆 𝒑𝒓𝒆𝒔𝒔𝒖𝒓𝒆. 
 𝑯𝒆 𝒔𝒘𝒂𝒎 𝒂𝒘𝒂𝒚 𝒍𝒊𝒌𝒆 𝒂 𝒈𝒂𝒚 𝒅𝒐𝒍𝒑𝒉𝒊𝒏.
`

    let defaultKick = `┏━〔 *𝐁𝐚𝐧𝐧𝐞𝐝* 〕━┓
 𝑼𝒔𝒆𝒓: ${taguser}
 𝐆𝐫𝐨𝐮𝐩: *${groupMetadata.subject}*

 ${taguser} 𝑯𝒆 𝒘𝒂𝒔 𝒃𝒂𝒏𝒏𝒆𝒅!
 𝑮𝒐𝒐𝒅𝒃𝒚𝒆 𝒍𝒊𝒕𝒕𝒍𝒆 𝒇𝒊𝒔𝒉" 🐬
 𝐼𝑡'𝑠 𝑜𝑣𝑒𝑟, 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑡𝑜𝑜𝑘 𝑖𝑡 𝑎𝑤𝑎𝑦.
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