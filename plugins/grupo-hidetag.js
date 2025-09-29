import { generateWAMessageFromContent } from "@whiskeysockets/baileys";
import * as fs from "fs";

var handler = async (m, { conn, text, participants, isOwner, isAdmin, isSemiAdmin }) => {
  if (!m.quoted && !text)
    return conn.reply(
      m.chat,
      `⚠️ 𝒀𝒐𝒖 𝒎𝒖𝒔𝒕 𝒔𝒆𝒏𝒅 𝒂 𝒕𝒆𝒙𝒕 𝒕𝒐 𝒄𝒓𝒆𝒂𝒕𝒆 𝒂 𝒕𝒂𝒈`,
      m
    );

  try {
    let users = participants.map((u) => conn.decodeJid(u.id));
    let q = m.quoted ? m.quoted : m || m.text || m.sender;
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;
    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [m.quoted ? q.mtype : "extendedTextMessage"]: m.quoted
            ? c.message[q.mtype]
            : { text: "" || c },
        },
        { quoted: null, userJid: conn.user.id }
      ),
      (text || q.text) + `\n\n> *_DolphinBot 🐬_*`, 
      conn.user.jid,
      { mentions: users }
    );
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch {


    let users = participants.map((u) => conn.decodeJid(u.id));
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    let isMedia = /image|video|sticker|audio/.test(mime);
    let more = String.fromCharCode(8206);
    let masss = more.repeat(850);
    let htextos = `${text ? text : "*𝐇𝐈!!*"}\n\n> Dolphin 🐬`;
    if (isMedia && quoted.mtype === "imageMessage" && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        { image: mediax, mentions: users, caption: htextos },
        { quoted: null }
      );
    } else if (isMedia && quoted.mtype === "videoMessage" && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        {
          video: mediax,
          mentions: users,
          mimetype: "video/mp4",
          caption: htextos,
        },
        { quoted: null }
      );
    } else if (isMedia && quoted.mtype === "audioMessage" && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        {
          audio: mediax,
          mentions: users,
          mimetype: "audio/mp4",
          fileName: `Hidetag.mp3`,
        },
        { quoted: null }
      );
    } else if (isMedia && quoted.mtype === "stickerMessage" && htextos) {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        { sticker: mediax, mentions: users },
        { quoted: null }
      );
    } else {
      await conn.relayMessage(
        m.chat,
        {
          extendedTextMessage: {
            text: `${masss}\n${htextos}`,
            ...{
              contextInfo: {
                mentionedJid: users,
                externalAdReply: { thumbnail: icons, sourceUrl: redes },
              },
            },
          },
        },
        {}
      );
    }
  }
};

handler.help = ["hidetag"];
handler.tags = ["grupo"];
handler.command = ["hidetag", "notificar", "notify", "tag", "n"];
handler.group = true;
handler.admin = true;
handler.semiadmin = true;
handler.register = true;

export default handler;