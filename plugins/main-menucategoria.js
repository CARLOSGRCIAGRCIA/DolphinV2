let handler = async (m, { conn, usedPrefix }) => {
  let name = await conn.getName(m.sender);
  let number = m.sender.split("@")[0];
  let user = global.db.data.users[m.sender];
  let creatorName = "Bienvenido al bot disfrutalo✨️🎄";

  let info = `
╭━━〔 𝗜𝗡𝗙𝗢 𝗗𝗘𝗟 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 〕━━⬣
┃ 👤 *Nombre:* ${name}
┃ 🪪 *Número:* wa.me/${number}
┃ 🧬 *Experiencia:* ${user.exp}
┃ 💎 *Diamantes:* ${user.diamond || 0}
┃ 🎟 *Tokens:* ${user.joincount || 0}
┃ 🔋 *Nivel:* ${user.level}
┃ 🧪 *Rango:* ${user.role}
╰━━━━━━━━━━━━━━━━⬣

📱 *Bienvenido al Panel del Bot*
Selecciona una opción con los botones de abajo:`.trim();

  const imagen = "https://imgur.com/a/fBZChOx";

  await conn.sendMessage(
    m.chat,
    {
      image: { url: imagen },
      caption: info,
      footer: "Bot de Carlos 😼🍁",
      buttons: [
        {
          buttonId: `${usedPrefix}help`,
          buttonText: { displayText: "📜 Menú Principal" },
          type: 1,
        },
        {
          buttonId: `${usedPrefix}grupos`,
          buttonText: { displayText: "🎋 Grupos" },
          type: 1,
        },
        {
          buttonId: `${usedPrefix}reg soyGay.444`,
          buttonText: { displayText: "🌐 auto verificar" },
          type: 1,
        },
      ],
      headerType: 4,
    },
    { quoted: m }
  );
};

handler.command = ["menux", "menúx", "abrirmenux"];
export default handler;
