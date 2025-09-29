const handler = async (m, { conn, text, args, usedPrefix, command }) => {
    const sender = m.sender;
    const normalizedSender = sender.replace(/[^0-9]/g, "");

    const isROwner = global.owner.some(
        ([number]) => number.replace(/[^0-9]/g, "") === normalizedSender
    );

    const emoji = "🔧";
    const emoji2 = "🗑️";

    const why = `${emoji} 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒂 𝒖𝒔𝒆𝒓 𝒕𝒐 𝒂𝒅𝒅 𝒐𝒓 𝒓𝒆𝒎𝒐𝒗𝒆 𝒕𝒉𝒆𝒎 𝒂𝒔 𝒂 𝒔𝒆𝒎𝒊-𝒂𝒅𝒎𝒊𝒏.`;
    const who = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
            ? m.quoted.sender
            : text
                ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
                : false;

    if (!who) return conn.reply(m.chat, why, m, { mentions: [m.sender] });

    const normalizedWho = who.replace(/[^0-9]/g, "");

    if (!global.semiadmins) {
        global.semiadmins = [];
    }

    switch (command) {
        case "addsemiadmin":
        case "addsemi":
            const alreadyExists = global.semiadmins.some(
                (number) => number.replace(/[^0-9]/g, "") === normalizedWho
            );

            if (alreadyExists) {
                return conn.reply(m.chat, `${emoji} 𝑻𝒉𝒊𝒔 𝒖𝒔𝒆𝒓 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂 𝒔𝒆𝒎𝒊-𝒂𝒅𝒎𝒊𝒏.`, m);
            }

            const isOwner = global.owner.some(
                ([number]) => number.replace(/[^0-9]/g, "") === normalizedWho
            );

            if (isOwner) {
                return conn.reply(m.chat, `${emoji} 𝐓𝐡𝐢𝐬 𝐮𝐬𝐞𝐫 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐚𝐧 𝐨𝐰𝐧𝐞𝐫 𝐚𝐧𝐝 𝐜𝐚𝐧𝐧𝐨𝐭 𝐛𝐞 𝐚 𝐬𝐞𝐦𝐢-𝐚𝐝𝐦𝐢𝐧.`, m);
            }

            global.semiadmins.push(normalizedWho);
            await conn.reply(
                m.chat,
                `${emoji} 𝐔𝐬𝐞𝐫 𝐚𝐝𝐝𝐞𝐝 𝐭𝐨 𝐭𝐡𝐞 𝐥𝐢𝐬𝐭 𝐨𝐟 𝐬𝐞𝐦𝐢-𝐚𝐝𝐦𝐢𝐧𝐬.\n\n*𝑷𝒆𝒓𝒎𝒊𝒕𝒔 𝒈𝒓𝒂𝒏𝒕𝒆𝒅:*\n• 𝒀𝒐𝒖 𝒄𝒂𝒏 𝒖𝒔𝒆 𝒎𝒐𝒅𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔\n• 𝑷𝒖𝒆𝒅𝒆 𝒖𝒔𝒂𝒓 𝒉𝒊𝒅𝒆𝒕𝒂𝒈𝒔\n• 𝑨𝒄𝒄𝒆𝒔𝒐 𝒂 𝒇𝒖𝒏𝒄𝒊𝒐𝒏𝒆𝒔 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒊𝒗𝒂𝒔 𝒍𝒊𝒎𝒊𝒕𝒂𝒅𝒂𝒔`,
                m
            );
            break;

        case "delsemiadmin":
        case "delsemi":
            const index = global.semiadmins.findIndex(
                (number) => number.replace(/[^0-9]/g, "") === normalizedWho
            );

            if (index !== -1) {
                global.semiadmins.splice(index, 1);
                await conn.reply(
                    m.chat,
                    `${emoji2} 𝑼𝒔𝒆𝒓 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒍𝒊𝒔𝒕 𝒐𝒇 𝒔𝒆𝒎𝒊-𝒂𝒅𝒎𝒊𝒏𝒔.`,
                    m
                );
            } else {
                await conn.reply(
                    m.chat,
                    `${emoji2} 𝑻𝒉𝒆 𝒖𝒔𝒆𝒓 𝒊𝒔 𝒏𝒐𝒕 𝒐𝒏 𝒕𝒉𝒆 𝒍𝒊𝒔𝒕 𝒐𝒇 𝒔𝒆𝒎𝒊-𝒂𝒅𝒎𝒊𝒏𝒔.`,
                    m
                );
            }
            break;

        case "listsemiadmin":
        case "listsemi":
            if (!global.semiadmins || global.semiadmins.length === 0) {
                return conn.reply(m.chat, `${emoji} 𝑻𝒉𝒆𝒓𝒆 𝒂𝒓𝒆 𝒏𝒐 𝒓𝒆𝒈𝒊𝒔𝒕𝒆𝒓𝒆𝒅 𝒔𝒆𝒎𝒊-𝒂𝒅𝒎𝒊𝒏𝒔.`, m);
            }

            let listMessage = `${emoji} *𝑳𝒊𝒔𝒕 𝒐𝒇 𝑺𝒆𝒎𝒊𝒂𝒅𝒎𝒊𝒏𝒔:*\n\n`;
            for (let i = 0; i < global.semiadmins.length; i++) {
                const number = global.semiadmins[i];
                listMessage += `${i + 1}. @${number}\n`;
            }

            const mentions = global.semiadmins.map(num => num + "@s.whatsapp.net");

            await conn.reply(m.chat, listMessage, m, { mentions });
            break;
    }
};

handler.help = ["addsemiadmin", "delsemiadmin", "listsemiadmin"];
handler.tags = ["owner"];
handler.command = [
    "addsemiadmin", "addsemi",
    "delsemiadmin", "delsemi",
    "listsemiadmin", "listsemi"
];
handler.rowner = true;

export default handler;