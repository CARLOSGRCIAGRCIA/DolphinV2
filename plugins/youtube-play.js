//youtube-play.js

import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix: prefijo }) => {
    try {
        if (!text) throw `🎋 Ingresa el nombre de la música`;
        
        const results = await yts(text);
        const video = results.videos[0];
        if (!video) throw '❌ *No se encontraron resultados*';

        const cleanUrl = video.url;
        


        const listMessage = {
            text: `🎵 *${video.title}*\n⏱️ ${video.duration.timestamp} | 👤 ${video.author.name}\n👀 ${video.views.toLocaleString()} vistas`,
            footer: global.dev || 'Bot Music',
            title: "Selecciona formato de descarga",
            buttonText: "📋 Ver opciones",
            sections: [
                {
                    title: "🎵 Formatos de Audio",
                    rows: [
                        {
                            title: "🎵 Descargar MP3",
                            description: "Audio en formato MP3 estándar",
                            rowId: `${prefijo}ytmp3 ${cleanUrl}`
                        },
                        {
                            title: "📄 MP3 como Documento",
                            description: "Audio MP3 enviado como archivo adjunto",
                            rowId: `${prefijo}ytmp3doc ${cleanUrl}`
                        }
                    ]
                },
                {
                    title: "🎥 Formatos de Video",
                    rows: [
                        {
                            title: "🎥 Descargar MP4",
                            description: "Video en formato MP4 estándar",
                            rowId: `${prefijo}ytmp4 ${cleanUrl}`
                        },
                        {
                            title: "📁 MP4 como Documento",
                            description: "Video MP4 enviado como archivo adjunto",
                            rowId: `${prefijo}ytmp4doc ${cleanUrl}`
                        }
                    ]
                }
            ]
        };

        await conn.sendMessage(m.chat, listMessage, { quoted: m });

    } catch (error) {
        console.error("Error en handler play:", error);
        await conn.reply(m.chat, `❌ Error: ${error.message}`, m);
    }
};

handler.help = ['play <búsqueda>'];
handler.tags = ['downloader'];
handler.command = ['play', 'music', 'youtube'];
handler.register = true;

export default handler;