import fetch from 'node-fetch';
import crypto from 'crypto';

const NEVI_API_KEY = 'ellen'; // creditos a nevi-dev 

const newsletterJid = '120363418071540900@newsletter';
const newsletterName = '𝑫𝑶𝑳𝑷𝑯𝑰𝑵𝑩𝑶𝑻 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑺';


var handler = async (m, { conn, args, usedPrefix, command }) => {
    const name = conn.getName(m.sender);

    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid,
            newsletterName,
            serverMessageId: -1
        },
        externalAdReply: {
            title: '𝑫𝑶𝑳𝑷𝑯𝑰𝑵𝑩𝑶𝑻 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑺',
            body: `✦ Esperando tu solicitud, ${name}.`,
            thumbnail: global.icons,
            sourceUrl: global.redes,
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    if (!args[0]) {
        return conn.reply(
            m.chat,
            `Necesito el enlace de un video para continuar. Por favor, proporciona un enlace de YouTube.\n\n_Ejemplo: ${usedPrefix + command} https://youtu.be/KHgllosZ3kA`,
            m,
            { contextInfo, quoted: m }
        );
    }

    await conn.reply(
        m.chat,
        `Procesando la solicitud de audio. Esto puede tardar unos momentos.`,
        m,
        { contextInfo, quoted: m }
    );

    const url = args[0];

    try {
        const neviApiUrl = `http://neviapi.ddns.net:5000/download`;
        const res = await fetch(neviApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': NEVI_API_KEY,
            },
            body: JSON.stringify({
                url: url,
                format: "mp3"
            }),
        });

        const json = await res.json();
        
        if (json.status === "success" && json.download_link) {
            const titleFromApi = json.title || 'Título Desconocido';
            
            await conn.sendMessage(
                m.chat, {
                    audio: { url: json.download_link },
                    mimetype: 'audio/mpeg',
                    fileName: titleFromApi + '.mp3',
                    ptt: false,
                    caption: `
*¡Audio descargado con éxito!*
🎵 *Título:* ${titleFromApi}
`
                }, { contextInfo, quoted: m }
            );

        } else {
            throw new Error(`No se pudo descargar el audio. Razón: ${json.message || 'Respuesta inválida del servidor.'}`);
        }

    } catch (e) {
        console.error(e);

        await conn.reply(
            m.chat,
            `⚠️ Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.\nDetalles: ${e.message}`,
            m,
            { contextInfo, quoted: m }
        );
    }
};

handler.help = ['ytmp3'].map(v => v + ' <link>');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'mp3'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;