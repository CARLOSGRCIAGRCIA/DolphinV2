let handler = async (m, { conn, args, text }) => {
  if (!text) throw `Usa: .lucha @usuario`;

  const usuario1 = m.sender.split('@')[0];
  const usuario2 = text.replace('@', '');
  const resultado = ['ganó', 'perdió', 'empató'][Math.floor(Math.random() * 3)];
  const emojis = ['🥊', '🤕', '💥', '🥇', '👊', '🔥'];

  conn.reply(m.chat, `⚔️ *Lucha épica* ⚔️\n\n@${usuario1} vs @${usuario2}\n\n*Resultado:* @${usuario1} ${resultado} contra @${usuario2} ${emojis[Math.floor(Math.random() * emojis.length)]}`, m, {
    mentions: [m.sender, `${usuario2}@s.whatsapp.net`]
  });
};
handler.command = /^lucha$/i;
handler.help = ['lucha @usuario'];
handler.tags = ['juegos'];
export default handler;