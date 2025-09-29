
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const pesan = args.join` `;
  const oi = `*» 𝐈𝐍𝐅𝐎 :* ${pesan}`;
  let teks = `*!  𝐺𝐸𝑁𝐸𝑅𝐴𝐿 𝑀𝐸𝑁𝑇𝐼𝑂𝑁  !*\n  *𝑭𝑶𝑹 ${participants.length} 𝐌𝐄𝐌𝐁𝐄𝐑𝐒* 🗣️\n\n ${oi}\n\n╭  ┄ 𝅄 ۪꒰ \`⡞᪲=͟͟͞${botname} ≼᳞ׄ\` ꒱ ۟ 𝅄 ┄\n`;
  for (const mem of participants) {
    teks += `┊${customEmoji} @${mem.id.split('@')[0]}\n`;
  }
  teks += `╰⸼ ┄ ┄ ┄ ─  ꒰  ׅ୭ *${vs}* ୧ ׅ ꒱  ┄  ─ ┄ ⸼`;

  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};

handler.help = ['everyone *<𝐨𝐩𝐭𝐢𝐨𝐧𝐚𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐞>*'];
handler.tags = ['group'];
handler.command = ['all','everyone','todos', 'invocar', 'tagall']
handler.admin = true;
handler.group = true;

export default handler;