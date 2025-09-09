const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const sender = m.sender;
  const normalizedSender = sender.replace(/[^0-9]/g, "");

  const isROwner = global.owner.some(
    ([number]) => number.replace(/[^0-9]/g, "") === normalizedSender
  );

  const why = `${emoji} Por favor, menciona a un usuario para agregar o quitar como owner.`;
  const who = m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
      ? m.quoted.sender
      : text
        ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        : false;

  if (!who) return conn.reply(m.chat, why, m, { mentions: [m.sender] });

  const normalizedWho = who.replace(/[^0-9]/g, "");

  switch (command) {
    case "addowner":
      const alreadyExists = global.owner.some(
        ([number]) => number.replace(/[^0-9]/g, "") === normalizedWho
      );

      if (alreadyExists) {
        return conn.reply(m.chat, `${emoji} Este usuario ya es owner.`, m);
      }

      global.owner.push([normalizedWho, "", false]);
      await conn.reply(
        m.chat,
        `${emoji} Usuario agregado a la lista de owners.`,
        m
      );
      break;

    case "delowner":
      const index = global.owner.findIndex(
        ([number]) => number.replace(/[^0-9]/g, "") === normalizedWho
      );

      if (index !== -1) {
        global.owner.splice(index, 1);
        await conn.reply(
          m.chat,
          `${emoji2} Usuario eliminado de la lista de owners.`,
          m
        );
      } else {
        await conn.reply(
          m.chat,
          `${emoji2} El usuario no está en la lista de owners.`,
          m
        );
      }
      break;
  }
};

handler.command = ["addowner", "delowner"];
handler.rowner = true;
export default handler;
