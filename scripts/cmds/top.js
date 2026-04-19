module.exports = {
  config: {
    name: "top",
    version: "2.0",
    author: "XxGhostxX 👑",
    role: 0,
    shortDescription: {
      en: "🏆 Classement royal des utilisateurs riches 💵"
    },
    longDescription: {
      en: "👑 Affiche le Top 50 des utilisateurs les plus riches du royaume"
    },
    category: "👑 royal-system",
    guide: {
      en: "{pn} [page]"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {

    const allUsers = await usersData.getAll();

    const topUsers = allUsers
      .sort((a, b) => b.money - a.money)
      .slice(0, 50);

    if (topUsers.length === 0) {
      return api.sendMessage(
`❌━━━━━━━━━━━━━━━━━━━━
⚠️ Aucune donnée disponible
━━━━━━━━━━━━━━━━━━━━`,
      event.threadID, event.messageID);
    }

    let page = args[0] ? parseInt(args[0]) : 1;
    const perPage = 10;
    const totalPages = Math.ceil(topUsers.length / perPage);

    if (page < 1 || page > totalPages) {
      return api.sendMessage(
`❌━━━━━━━━━━━━━━━━━━━━
📜 Page invalide
💡 Pages disponibles : ${totalPages}
━━━━━━━━━━━━━━━━━━━━`,
      event.threadID, event.messageID);
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;

    const pageUsers = topUsers.slice(start, end);

    const list = pageUsers.map((u, i) => {
      return `🏅 ${start + i + 1}. ${u.name}
💰 Argent : ${u.money || 0} 💵`;
    }).join("\n━━━━━━━━━━━━\n");

    const champion = topUsers[0];

    const messageText =
`🇫🇷━━━━━━━━━━━━━━━━━━━━
👑 𝚃𝙾𝙿 𝟻𝟶 𝚁𝙾𝚈𝙰𝙻 𝙻𝙴𝙰𝙳𝙴𝚁𝚂
━━━━━━━━━━━━━━━━━━━━

📊 Page : ${page} / ${totalPages}

━━━━━━━━━━━━━━━━━━━━
${list}
━━━━━━━━━━━━━━━━━━━━

🏆 👑 𝙲𝙷𝙰𝙼𝙿𝙸𝙾𝙽 𝙳𝚄 𝚁𝙾𝚈𝙰𝚄𝙼𝙴
👤 ${champion.name}
💰 ${champion.money || 0} 💵

━━━━━━━━━━━━━━━━━━━━
⚜️ Système royal actif
🇫🇷━━━━━━━━━━━━━━━━━━━━`;

    return api.sendMessage(messageText, event.threadID, event.messageID);
  }
};
