let handler = async (m, { conn }) => {
  const emojis = ['😀', '😎', '😣', '🤩', '😡', '😢', '😴'];
  const elegido = emojis[Math.floor(Math.random() * emojis.length)];

  await conn.sendMessage(m.chat, { react: { text: elegido, key: m.key } });

  conn.reply(m.chat, `Adivina cuál emoji salió:\n${emojis.join(" ")}\n\nEscribe tu respuesta en 5 segundos...`, m);

  let respuesta = elegido;
  setTimeout(() => {
    conn.reply(m.chat, `¡Tiempo! La respuesta correcta era: ${respuesta}`, m);
  }, 5000);
};
handler.command = /^caritafeliz$/i;
handler.help = ['caritafeliz'];
handler.tags = ['juegos'];
export default handler;