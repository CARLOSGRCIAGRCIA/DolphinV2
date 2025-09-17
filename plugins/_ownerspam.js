import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

var handler = async (m, { conn, text, isROwner }) => {
  if (!isROwner) {
    return conn.reply(m.chat, "❌ Este comando es exclusivo para owners.", m);
  }

  if (!text) {
    return conn.reply(
      m.chat,
      "📝 Debes proporcionar un mensaje para enviar.\n\n*Ejemplo:* .spam Hola a todos los grupos!",
      m
    );
  }

  try {
    let chats = Object.keys(conn.chats).filter(
      (chat) =>
        chat.endsWith("@g.us") && 
        conn.chats[chat].id &&
        !conn.chats[chat].read_only
    );

    if (chats.length === 0) {
      return conn.reply(m.chat, "⚠️ No se encontraron grupos activos.", m);
    }

    await conn.reply(
      m.chat,
      `🚀 Iniciando envío masivo a ${chats.length} grupos...\n\n*Mensaje:* ${text}`,
      m
    );

    let enviados = 0;
    let errores = 0;
    const more = String.fromCharCode(8206);
    const masss = more.repeat(850);

    for (let chat of chats) {
      try {
        let groupMetadata = await conn.groupMetadata(chat).catch(() => null);
        if (!groupMetadata) continue;

        let participants = groupMetadata.participants || [];
        let users = participants.map((u) => conn.decodeJid(u.id));

        await conn.relayMessage(
          chat,
          {
            extendedTextMessage: {
              text: `${masss}\n${text}\n`,
              contextInfo: {
                mentionedJid: users,
              },
            },
          },
          {}
        );

        enviados++;

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error enviando a ${chat}:`, error);
        errores++;
      }
    }

    const reporte = `
📊 *REPORTE DE ENVÍO MASIVO*

✅ *Enviados:* ${enviados}
❌ *Errores:* ${errores}  
📱 *Total grupos:* ${chats.length}
📝 *Mensaje:* ${text}

${enviados > 0 ? "🎉 Envío completado exitosamente" : "⚠️ No se pudo enviar a ningún grupo"}
        `.trim();

    await conn.reply(m.chat, reporte, m);
  } catch (error) {
    console.error("Error en spam global:", error);
    await conn.reply(
      m.chat,
      "❌ Error al ejecutar el comando spam:\n\n" + error.message,
      m
    );
  }
};

handler.help = ["spam"];
handler.tags = ["owner"];
handler.command = ["spam", "spamglobal", "broadcast"];
handler.rowner = true;
handler.register = false;

export default handler;
