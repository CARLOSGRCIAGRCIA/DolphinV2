//youtube-ytv.js

import axios from 'axios';
import fetch from 'node-fetch';

const MAX_FILE_SIZE = 280 * 1024 * 1024; // 280 MB
const VIDEO_THRESHOLD = 70 * 1024 * 1024; // 70 MB
const HEAVY_FILE_THRESHOLD = 100 * 1024 * 1024; // 100 MB
const REQUEST_LIMIT = 3;
const REQUEST_WINDOW_MS = 10000;
const COOLDOWN_MS = 120000;
const MAX_AUDIO_DURATION = 6 * 60; // 6 minutos en segundos

const requestTimestamps = [];
let isCooldown = false;
let isProcessingHeavy = false;

const isValidYouTubeUrl = url =>
  /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(url);

function checkRequestLimit() {
  const now = Date.now();
  requestTimestamps.push(now);
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > REQUEST_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= REQUEST_LIMIT) {
    isCooldown = true;
    setTimeout(() => {
      isCooldown = false;
      requestTimestamps.length = 0;
    }, COOLDOWN_MS);
    return false;
  }
  return true;
}

async function ytdl(url, type = 'mp4') {
  const headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Chromium";v="132", "Not A(Brand";v="8"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    referer: 'https://id.ytmp3.mobi/',
    'referrer-policy': 'strict-origin-when-cross-origin'
  };

  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  if (!videoId) throw new Error('𝑽𝒊𝒅𝒆𝒐 𝑰𝑫 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅');

  const init = await (await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Date.now()}`, { headers })).json();
  const convert = await (await fetch(`${init.convertURL}&v=${videoId}&f=${type}&_=${Date.now()}`, { headers })).json();

  let info;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(convert.progressURL, { headers });
    info = await res.json();
    if (info.progress === 3) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!info || !convert.downloadURL) throw new Error('𝗧𝗵𝗲 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗨𝗥𝗟 𝗰𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗯𝗲 𝗼𝗯𝘁𝗮𝗶𝗻𝗲𝗱.');

  // Limitar duración de audio
  if (type === 'mp3' && info.duration > MAX_AUDIO_DURATION) {
    throw new Error('𝑻𝒉𝒆 𝒂𝒖𝒅𝒊𝒐 𝒊𝒔 𝒐𝒗𝒆𝒓 𝟔 𝒎𝒊𝒏𝒖𝒕𝒆𝒔 𝒍𝒐𝒏𝒈.');
  }

  return { url: convert.downloadURL, title: info.title || '𝑼𝒏𝒕𝒊𝒕𝒍𝒆𝒅 𝒇𝒊𝒍𝒆' };
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const react = emoji => m.react(emoji);

  if (!text) return conn.reply(m.chat, `⚡️ 𝑼𝒔𝒂𝒈𝒆: ${usedPrefix}${command} <𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑳𝒊𝒏𝒌>`, m);

  if (!isValidYouTubeUrl(text)) {
    await react('🔴');
    return m.reply('🚫 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑳𝒊𝒏𝒌');
  }

  if (isCooldown || !checkRequestLimit()) {
    await react('🔴');
    return conn.reply(m.chat, '⏳ 𝑻𝒐𝒐 𝒎𝒂𝒏𝒚 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔. 𝑾𝒂𝒊𝒕 2 𝒎𝒊𝒏𝒖𝒕𝒆𝒔.', m);
  }

  if (isProcessingHeavy) {
    await react('🔴');
    return conn.reply(m.chat, '⚠️ 𝑨 𝒉𝒆𝒂𝒗𝒚 𝒇𝒊𝒍𝒆 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒃𝒆𝒊𝒏𝒈 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕.', m);
  }


  await react('🔍');

  try {
    const type = command.toLowerCase().includes('audio') ? 'mp3' : 'mp4';
    const { url, title } = await ytdl(text, type);

    const buffer = await fetchBuffer(url);
    const size = buffer.length;

    if (size > MAX_FILE_SIZE) throw new Error('📦 𝑭𝒊𝒍𝒆 𝒆𝒙𝒄𝒆𝒆𝒅𝒔 280𝑴𝑩 𝒍𝒊𝒎𝒊𝒕');

    if (size > HEAVY_FILE_THRESHOLD) {
      isProcessingHeavy = true;
      await conn.reply(m.chat, '💾 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒂 𝒍𝒂𝒓𝒈𝒆 𝒇𝒊𝒍𝒆, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...', m);
    }

    const caption = `*𝑫𝑶𝑳𝑷𝑯𝑰𝑵𝑩𝑶𝑻 𝑫𝑶𝑾𝑳𝑶𝑨𝑫𝑺*`.trim();


    await conn.sendFile(
      m.chat,
      buffer,
      `${title}.${type}`,
      caption,
      m,
      null,
      {
        mimetype: type === 'mp4' ? 'video/mp4' : 'audio/mpeg',
        asDocument: size >= VIDEO_THRESHOLD,
        filename: `${title}.${type}`
      }
    );

    await react('✅');
    isProcessingHeavy = false;
  } catch (e) {
    await react('❌');
    isProcessingHeavy = false;
    return m.reply(`📌 *ERROR:* ${e.message}`);
  }
};

handler.help = ['ytmp4 <url>', 'ytaudio <url>', 'video <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4', 'ytaudio', 'video'];

export default handler; 