let handler = async (m, { conn, text, isAdmin, isOwner }) => {
  if (!isAdmin && !isOwner) 
    return m.reply('⚠️ Solo administradores pueden cambiar el mensaje de bienvenida.');

  if (!text) 
    return m.reply('📢 Proporciona un mensaje de bienvenida.\nEjemplo: #setwelcome Bienvenido @user al grupo *{group}*!');

  let chat = global.db.data.chats[m.chat];
  chat.customWelcome = text.trim();

  m.reply(`✅ Mensaje de bienvenida para este grupo actualizado:\n${chat.customWelcome}`);
};

handler.help = ['setwelcome <mensaje>'];
handler.tags = ['group'];
handler.command = /^setwelcome$/i;
handler.admin = true;

export default handler;
