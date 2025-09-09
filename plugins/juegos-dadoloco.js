let handler = async (m, { conn }) => {
  const dados = ['🎲 1', '🎲 2', '🎲 3', '🎲 4', '🎲 5', '🎲 6'];
  const elegido = dados[Math.floor(Math.random() * dados.length)];

  conn.reply(m.chat, `Tirando el dado...\n`, m);
  await new Promise(res => setTimeout(res, 2000));
  conn.reply(m.chat, `Resultado: *${elegido}*`, m);
};
handler.command = /^dadoloco$/i;
handler.help = ['dadoloco'];
handler.tags = ['juegos'];
export default handler;