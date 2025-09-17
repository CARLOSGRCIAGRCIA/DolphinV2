import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, isOwner, isROwner }) => {
  
  if (!isROwner && !isOwner) {
    return conn.reply(m.chat, `❌ *This command is only for the bot owner.*`, m)
  }
  
  if (!text) {
    return conn.reply(m.chat, `📢 *Correct usage:* .spam <message>\n\n*Example:* .spam Hi, everyone in all the groups.`, m)
  }
  
  try {
    let chats = Object.keys(conn.chats).filter(jid => jid.endsWith('@g.us'))
    
    if (chats.length === 0) {
      return conn.reply(m.chat, `❌ *No groups were found where the bot is located.*`, m)
    }
    
    await conn.reply(m.chat, `📊 *Massive spam campaign launched...*\n• Groups found: ${chats.length}\n• Message: "${text}"\n\n⏳ Sending...`, m)
    
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < chats.length; i++) {
      let chatId = chats[i]
      
      try {
        let groupMetadata = await conn.groupMetadata(chatId).catch(() => null)
        
        if (!groupMetadata) {
          failCount++
          continue
        }
        
        let participants = groupMetadata.participants.map(u => conn.decodeJid(u.id))
        
        let more = String.fromCharCode(8206)
        let masss = more.repeat(850)
        
        await conn.relayMessage(chatId, {
          extendedTextMessage: {
            text: `${masss}\n${text}\n`, 
            contextInfo: { 
              mentionedJid: participants,
              externalAdReply: { 
                thumbnail: global.icons || null, 
                sourceUrl: global.redes || ''
              }
            }
          }
        }, {})
        
        successCount++
        
        if (i < chats.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
      } catch (error) {
        console.error(`Error sending to ${chatId}:`, error)
        failCount++
      }
    }
    
    let report = `✅ *Spam completed*\n\n📊 *Statistics:*\n• Total groups: ${chats.length}\n• Successful submissions: ${successCount}\n• Failures: ${failCount}\n• Message: "${text}"`
    
    await conn.reply(m.chat, report, m)
    
  } catch (error) {
    console.error('Error in spam command:', error)
    await conn.reply(m.chat, `❌ *Error sending mass spam:* ${error.message}`, m)
  }
}

handler.help = ['spam']
handler.tags = ['owner']
handler.command = ['spam', 'spamall', 'broadcast']
handler.rowner = true
handler.register = true

export default handler