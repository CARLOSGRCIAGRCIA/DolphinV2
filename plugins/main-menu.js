import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let Styles = (text, style = 1) => {
  let xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  let yStr = Object.freeze({
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  });
  let replacer = [];
  xStr.forEach((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split('')[i]
  }));
  return text
    .toLowerCase()
    .split('')
    .map(v => (replacer.find(x => x.original === v) || { convert: v }).convert)
    .join('');
};

let tags = {
  'juegos': ' JUEGOS ',
  'main': ' INFO ',
  'search': ' SEARCH ',
  'anime': ' ANIME ',
  'game': ' GAME ',
  'serbot': ' SUB BOTS ',
  'rpg': ' RPG ',
  'rg': ' REGISTRO ',
  'sticker': ' STICKER ',
  'img': ' IMAGE ',
  'group': ' GROUPS ',
  'nable': ' ON / OFF ', 
  'premium': ' PREMIUM ',
  'downloader': ' DOWNLOAD ',
  'tools': ' TOOLS ',
  'fun': ' FUN ',
  'nsfw': ' NSFW ', 
  'owner': ' OWNER ', 
};

let saludo
let hora = new Date().getUTCHours() - 6 

if (hora < 0) hora += 24 

if (hora >= 5 && hora < 13) {
  saludo = '🌊 ¡Chasquido matutino! Que las olas te traigan alegría hoy 🐠'
} else if (hora >= 13 && hora < 18) {
  saludo = '🌞 ¡Silbido soleado! ¿En qué puedas nadar junto a ti? 🌺'
} else {
  saludo = '🌙 ¡Burbujeo nocturno! ¿No deberías estar descansando en el arrecife? 💤'
}

const defaultMenu = {
  before: `--------[ *I N F O - U S E R* ]----------

▧ Nᴏᴍʙʀᴇ : %name
▧ Exᴘᴇʀɪᴇɴᴄɪᴀ: %exp
▧ Nɪᴠᴇʟ : %level

--------[ *I N F O - B OT Z* ]----------

▧ Esᴛᴀᴅᴏ : Modo Público
▧ Bᴀɪʟᴇʏs : Baileys MD
▧ Aᴄᴛɪᴠᴏ : %muptime
▧ Usᴜᴀʀɪᴏs : %totalreg

%readmore
`.trimStart(),
  header: '┏━━━━━━━━━━━━━━━━\n┃%category\n┣━━━━━━━━━━━━━━━━',
  body: '┃ %cmd',
  footer: '┗━━━━━━━━━━━━━━━━',
  after: `© Dolphin-MD`,
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let tag = `@${m.sender.split("@")[0]}`
    let mode = global.opts?.["self"] ? "Privado" : "Publico"
    
    if (!global.db?.data?.users?.[m.sender]) {
      global.db.data.users[m.sender] = {
        exp: 0,
        limit: 0,
        level: 0
      };
    }
    
    let { exp = 0, limit = 0, level = 0 } = global.db.data.users[m.sender] || {};
    
    let min = 0, xp = 0, max = 0;
    try {
      ({ min, xp, max } = xpRange(level, global.multiplier || 1));
    } catch (xpError) {
      min = 0; xp = 100; max = 100;
    }
    
    let name = '';
    try {
      name = await conn.getName(m.sender) || 'Usuario';
    } catch {
      name = 'Usuario';
    }
    
    let _uptime = process.uptime() * 1000;
    let muptime = clockString(_uptime);
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db?.data?.users || {}).length || 0;

    let help = [];
    try {
      help = Object.values(global.plugins || {})
        .filter(plugin => !plugin.disabled)
        .map(plugin => ({
            help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
            tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
            prefix: 'customPrefix' in plugin,
            limit: plugin.limit,
            premium: plugin.premium,
            enabled: !plugin.disabled,
          }))
        .filter(plugin => plugin.help && plugin.tags);
    } catch (pluginError) {
      console.log('⚠️ Error cargando plugins:', pluginError.message);
    }

    for (let plugin of help) {
      if (plugin && 'tags' in plugin) {
        for (let t of plugin.tags) {
          if (!(t in tags) && t) tags[t] = t;
        }
      }
    }

    let before = `

𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙤 𝙖 𝘿𝙤𝙡𝙥𝙝𝙞𝙣 𝘽𝙤𝙩 🐬

${saludo}, *${name}*!

--------[ *I N F O - U S E R* ]----------

▧ Nᴏᴍʙʀᴇ : ${name}
▧ Exᴘᴇʀɪᴇɴᴄɪᴀ: ${exp - min}
▧ Nɪᴠᴇʟ : ${level}

--------[ *I N F O - B O T* ]----------

▧ Esᴛᴀᴅᴏ : ${mode}
▧ Bᴀɪʟᴇʏs : Baileys MD
▧ Aᴄᴛɪᴠᴏ : ${muptime}
▧ Usᴜᴀʀɪᴏs : ${totalreg}

${readMore}
`;

    let header = '┏━━━━━━━━━━━━━━━━\n┃%category\n┣━━━━━━━━━━━━━━━━';
    let body = '┃ %cmd';
    let footer = '┗━━━━━━━━━━━━━━━━';
    let after = '© 𝘿𝙊𝙇𝙋𝙃𝙄𝙉 𝘽𝙊𝙏-MD';

    let _text = [
      before,
      ...Object.keys(tags).map(t => {
        return header.replace(/%category/g, tags[t]) + '\n' + [
          ...help
            .filter(menu => menu.tags && menu.tags.includes(t) && menu.help)
            .map(menu => menu.help
              .map(h => body
                .replace(/%cmd/g, menu.prefix ? h : _p + h)
                .replace(/%islimit/g, menu.limit ? '◜⭐◞' : '')
                .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '')
                .trim())
              .join('\n')
            ),
          footer
        ].join('\n')
      }),
      after
    ].join('\n');

    let menuText = _text.trim();

    await m.react('⚽️');

    try {
      let finalMenu = menuText + `

💡 *Tip:* Copia y pega cualquier comando para usarlo`;

      await conn.sendMessage(m.chat, {
        text: finalMenu
      }, { quoted: m });
      console.log('✅ Menú final enviado (diseño texto)');
      return;
    } catch (finalError) {
      console.log('❌ Error menú final:', finalError.message);
    }

    try {
      await conn.sendMessage(m.chat, {
        image: { url: 'https://qu.ax/OmQYc.png' },
        caption: menuText + "\n\n🔹 *Comandos disponibles arriba*"
      }, { quoted: m });
      console.log('✅ Menú con imagen enviado');
      return;
    } catch (imageError) {
      console.log('❌ Error con imagen:', imageError.message);
    }

    await conn.reply(m.chat, menuText, m);

  } catch (e) {
    console.error('❌ Error en menú:', e);
    await conn.reply(m.chat, '❎ Error en el menú: ' + e.message, m);
  }
};

handler.help = ['allmenu'];
handler.tags = ['main'];
handler.command = ['allmenu', 'menucompleto', 'menúcompleto', 'help', 'menu2'];
handler.register = true;
export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}