const OsangoMessie = require('os');
const moment = require('moment-timezone');

const styleMap = {
    'A': '𝘈','B': '𝘉','C': '𝘊','D': '𝘋','E': '𝘌','F': '𝘍',
    'G': '𝘎','H': '𝘏','I': '𝘐','J': '𝘑','K': '𝘒','L': '𝘓',
    'M': '𝘔','N': '𝘕','O': '𝘖','P': '𝘗','Q': '𝘘','R': '𝘙',
    'S': '𝘚','T': '𝘛','U': '𝘜','V': '𝘝','W': '𝘞','X': '𝘟',
    'Y': '𝘠','Z': '𝘡',
    'a': '𝘢','b': '𝘣','c': '𝘤','d': '𝘥','e': '𝘦','f': '𝘧',
    'g': '𝘨','h': '𝘩','i': '𝘪','j': '𝘫','k': '𝘬','l': '𝘭',
    'm': '𝘮','n': '𝘯','o': '𝘰','p': '𝘱','q': '𝘲','r': '𝘳',
    's': '𝘴','t': '𝘵','u': '𝘶','v': '𝘷','w': '𝘸','x': '𝘹',
    'y': '𝘺','z': '𝘻'
};

function applyStyle(text) {
    return text.split('').map(c => styleMap[c] || c).join('');
}

module.exports = {
    config: {
        name: "uptime",
        aliases: ["upt", "up"],
        version: "1.0",
        author: "𝙼𝚎𝚜𝚜𝚒𝚎 𝙾𝚜𝚊𝚗𝚐𝚘 👑",
        role: 0,
        shortDescription: {
            en: applyStyle("𝚂𝚢𝚜𝚝𝚎𝚖 𝚂𝚝𝚊𝚝𝚞𝚜")
        },
        longDescription: {
            en: applyStyle("𝙰𝚏𝚏𝚒𝚌𝚑𝚎 𝚕𝚎𝚜 𝚙𝚎𝚛𝚏𝚘𝚛𝚖𝚊𝚗𝚌𝚎𝚜 𝚍𝚞 𝚜𝚢𝚜𝚝𝚎𝚖𝚎")
        },
        category: "𝚜𝚢𝚜𝚝𝚎𝚖 👑",
        guide: {
            en: applyStyle(
`╭───────👑 ROYAL SYSTEM ───────╮
│
│   {p}uptime
│
╰────────────────────────────╯`)
        }
    },

    onStart: async function ({ api, event }) {
        try {

            const botUptime = process.uptime();
            const serverUptime = OsangoMessie.uptime();

            const format = (s) => ({
                d: Math.floor(s / 86400),
                h: Math.floor((s % 86400) / 3600),
                m: Math.floor((s % 3600) / 60),
                s: Math.floor(s % 60)
            });

            const bot = format(botUptime);
            const server = format(serverUptime);

            const cpuSpeed = (OsangoMessie.cpus()[0].speed / 1000).toFixed(2);

            const totalMem = OsangoMessie.totalmem() / (1024 ** 3);
            const usedMem = (OsangoMessie.totalmem() - OsangoMessie.freemem()) / (1024 ** 3);

            const now = moment().tz('Africa/Douala').format('🕒 HH:mm:ss | 📅 DD/MM/YYYY');

            const message =
`🇫🇷━━━━━━━━━━━━━━━━━━━━
👑 𝚂𝚈𝚂𝚃𝙴𝙼𝙴 𝚁𝙾𝚈𝙰𝙻 𝙼𝙴𝚂𝚂𝙸𝙴
━━━━━━━━━━━━━━━━━━━━

🤖 𝙱𝙾𝚃 𝚄𝙿𝚃𝙸𝙼𝙴
│ ${bot.d}j ${bot.h}h ${bot.m}m ${bot.s}s
│
🌐 𝚂𝙴𝚁𝚅𝙴𝚄𝚁
│ ${server.d}j ${server.h}h ${server.m}m ${server.s}s

━━━━━━━━━━━━━━━━━━━━
⚙️ 𝚁𝙴𝚂𝚂𝙾𝚄𝚁𝙲𝙴𝚂
│ CPU : ${cpuSpeed} GHz
│ RAM : ${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} GB

━━━━━━━━━━━━━━━━━━━━
⏰ 𝙷𝙴𝚄𝚁𝙴 𝚁𝙴𝙰𝙻𝙸𝚃𝙴
│ ${now}

━━━━━━━━━━━━━━━━━━━━
👑 Système actif • Royaume stable
🇫🇷━━━━━━━━━━━━━━━━━━━━`;

            api.sendMessage(message, event.threadID);

        } catch (error) {
            console.error(error);
            api.sendMessage(
`🇫🇷━━━━━━━━━━━━━━━━━━━━
❌ 𝙴𝚁𝚁𝙴𝚄𝚁 𝚂𝚈𝚂𝚃𝙴𝙼𝙴
━━━━━━━━━━━━━━━━━━━━

⚠️ Le système royal a rencontré un problème

🇫🇷━━━━━━━━━━━━━━━━━━━━`,
            event.threadID);
        }
    }
};
