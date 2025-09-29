import fetch from 'node-fetch';
import yts from 'yt-search';

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const newsletterName = '𝑫𝑶𝑳𝑷𝑯𝑰𝑵𝑩𝑶𝑻 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑺';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const name = conn.getName(m.sender);

    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterName,
            serverMessageId: -1
        },
        externalAdReply: {
            title: '𝑫𝑶𝑳𝑷𝑯𝑰𝑵𝑩𝑶𝑻 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑺',
            body: `✦ ᴛʜᴇ ʙᴇꜱᴛ ʙᴏᴛ`,
            thumbnail: global.icons,
            sourceUrl: global.redes,
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    if (!args[0]) {
        return conn.reply(
            m.chat,
            `𝑰 𝒏𝒆𝒆𝒅 𝒕𝒉𝒆 𝒍𝒊𝒏𝒌 𝒐𝒓 𝒏𝒂𝒎𝒆 𝒐𝒇 𝒂 𝒗𝒊𝒅𝒆𝒐 𝒕𝒐 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒍𝒊𝒏𝒌 𝒐𝒓 𝒕𝒉𝒆 𝒏𝒂𝒎𝒆 𝒐𝒇 𝒕𝒉𝒆 𝒗𝒊𝒅𝒆𝒐.\n\n_𝑬𝒙𝒂𝒎𝒑𝒍𝒆: ${usedPrefix + command} https://youtu.be/KHgllosZ3kA_`,
            m,
            { contextInfo, quoted: m }
        );
    }

    await conn.reply(
        m.chat,
        `𝐃𝐨𝐥𝐩𝐡𝐢𝐧 𝐢𝐬 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐚 𝐦𝐨𝐦𝐞𝐧𝐭.`,
        m,
        { contextInfo, quoted: m }
    );

    const text = args.join(' ');

    try {
        let videoIdToFind = text.match(youtubeRegexID) || null;
        let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);

        if (videoIdToFind) {
            const videoId = videoIdToFind[1];  
            ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId);
        } 
        ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;  

        if (!ytplay2 || ytplay2.length == 0) {
            return conn.reply(
                m.chat,
                `🤖 𝑵𝒐 𝒓𝒆𝒔𝒖𝒍𝒕𝒔 𝒘𝒆𝒓𝒆 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒔𝒆𝒂𝒓𝒄𝒉.`,
                m,
                { contextInfo, quoted: m }
            );
        }

        let { title, thumbnail, url } = ytplay2;
        title = title || '𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐚𝐮𝐝𝐢𝐨';
        url = url || '𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅';

        const fuentes = [
            { api: 'ZenzzXD', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
            { api: 'ZenzzXD v2', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3v2?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
            { api: 'Vreden', endpoint: `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url },
            { api: 'Delirius', endpoint: `https://api.delirius.my.id/download/ymp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url }
        ];

        let audioUrl = null;
        let fuenteUsada = '';

        for (let fuente of fuentes) {
            try {
                const response = await fetch(fuente.endpoint);
                if (!response.ok) continue;
                const data = await response.json();
                const link = fuente.extractor(data);
                if (link) {
                    audioUrl = link;
                    fuenteUsada = fuente.api;
                    break;
                }
            } catch (err) {
                console.log(`⚠️ 𝑬𝒓𝒓𝒐𝒓 𝒘𝒊𝒕𝒉 ${fuente.api}:`, err.message);
            }
        }

        if (!audioUrl) {
            return conn.reply(
                m.chat,
                `🥲 𝐓𝐡𝐞 𝐚𝐮𝐝𝐢𝐨 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐟𝐫𝐨𝐦 𝐚𝐧𝐲 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐏𝐈.`,
                m,
                { contextInfo, quoted: m }
            );
        }

        // Enviar como audio normal (se reproduce directamente)
        await conn.sendMessage(
            m.chat, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                fileName: title + '.mp3',
                ptt: false,
                caption: `
*¡𝑨𝒖𝒅𝒊𝒐 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅!*
🎵 *𝑻𝒊𝒕𝒍𝒆:* ${title}
🔧 *𝑺𝒐𝒖𝒓𝒄𝒆:* ${fuenteUsada}
✨ *𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒆𝒅 𝒃𝒚:* ${name}
                `
            }, { 
                contextInfo, 
                quoted: m 
            }
        );

    } catch (e) {
        console.error(e);

        await conn.reply(
            m.chat,
            `⚠️ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐭𝐡𝐞 𝐫𝐞𝐪𝐮𝐞𝐬𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.\n𝑫𝒆𝒕𝒂𝒊𝒍𝒔: ${e.message}`,
            m,
            { contextInfo, quoted: m }
        );
    }
};

handler.help = ['ytmp3'].map(v => v + ' <𝐥𝐢𝐧𝐤 𝐨𝐫 𝐧𝐚𝐦𝐞>');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'mp3', 'play'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;