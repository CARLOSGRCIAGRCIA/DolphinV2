const handler = async (m, { conn, args }) => {
    if (!m.isGroup) throw '❌ Este comando solo funciona en grupos';
    
    let chat = global.db.data.chats[m.chat];
    
    if (args[0] === 'on' || args[0] === 'enable') {
        chat.reactionCommands = true;
        await conn.reply(m.chat, '✅ *Sistema de comandos por reacción ACTIVADO*\n\n🎵 = play/ytmp3\n🎥 = ytmp4\n🖼️ = dalle\n📝 = ai\n🌐 = translate\n📊 = info\n🎲 = roll\n💰 = balance\n🎮 = game\n📱 = ig\n\n*Reacciona a cualquier mensaje con estos emojis para activar el comando*', m);
    } else if (args[0] === 'off' || args[0] === 'disable') {
        chat.reactionCommands = false;
        await conn.reply(m.chat, '❌ *Sistema de comandos por reacción DESACTIVADO*\n\nYa no se procesarán comandos mediante reacciones.', m);
    } else {
        await conn.reply(m.chat, `🔧 *Estado actual:* ${chat.reactionCommands ? 'ACTIVADO ✅' : 'DESACTIVADO ❌'}\n\n*Uso:*\n• \`#reacciones on\` - Activar\n• \`#reacciones off\` - Desactivar\n\n*Emojis disponibles:*\n🎵 = play/ytmp3\n🎥 = ytmp4\n🖼️ = dalle\n📝 = ai\n🌐 = translate\n📊 = info\n🎲 = roll\n💰 = balance\n🎮 = game\n📱 = ig`, m);
    }
};

handler.help = ['reacciones <on/off>'];
handler.tags = ['grupo'];
handler.command = ['reacciones', 'reactions', 'reactioncmds'];
handler.admin = true;
handler.group = true;

export default handler;