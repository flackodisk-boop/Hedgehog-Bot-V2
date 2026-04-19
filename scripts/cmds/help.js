const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

function applyFont(text) {
  const fontMap = {
    'A': '𝙰','B': '𝙱','C': '𝙲','D': '𝙳','E': '𝙴','F': '𝙵',
    'G': '𝙶','H': '𝙷','I': '𝙸','J': '𝙹','K': '𝙺','L': '𝙻',
    'M': '𝙼','N': '𝙽','O': '𝙾','P': '𝙿','Q': '𝚀','R': '𝚁',
    'S': '𝚂','T': '𝚃','U': '𝚄','V': '𝚅','W': '𝚆','X': '𝚇',
    'Y': '𝚈','Z': '𝚉',
    'a': '𝚊','b': '𝚋','c': '𝚌','d': '𝚍','e': '𝚎','f': '𝚏',
    'g': '𝚐','h': '𝚑','i': '𝚒','j': '𝚓','k': '𝚔','l': '𝚕',
    'm': '𝚖','n': '𝚗','o': '𝚘','p': '𝚙','q': '𝚚','r': '𝚛',
    's': '𝚜','t': '𝚝','u': '𝚞','v': '𝚟','w': '𝚠','x': '𝚡',
    'y': '𝚢','z': '𝚣'
  };
  return text.split('').map(c => fontMap[c] || c).join('');
}

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Camille 💙",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View commands list" },
    longDescription: { en: "Show all commands and details" },
    category: "info",
    guide: { en: "{pn} [command_name]" },
    priority: 1
  },

  onStart: async ({ message, args, event, role }) => {
    const prefix = await getPrefix(event.threadID);

    // =========================
    // 📌 MENU PRINCIPAL
    // =========================
    if (!args[0]) {
      const categories = {};
      let msg = `࿇ ══━━✥🌸✥━━══ ࿇
        🌸 MENU D’AIDE ROYAL
࿇ ══━━✥🌸✥━━══ ࿇

`;

      for (const [name, cmd] of commands) {
        if (cmd.config.role > role) continue;
        const cat = cmd.config.category || "SANS CATÉGORIE";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
      }

      for (const cat of Object.keys(categories).sort()) {
        msg += `\n╔═══🌸 ${applyFont(cat.toUpperCase())} 🌸═══╗\n`;
        for (const name of categories[cat].sort()) {
          msg += `┃ ✦ ${applyFont(name)}\n`;
        }
        msg += `╚════════════════════╝\n`;
      }

      msg += `
࿇ ══━━✥🌸✥━━══ ࿇
📊 TOTAL : ${commands.size}
🔑 PREFIX : ${prefix}
࿇ ══━━✥🌸✥━━══ ࿇

💬 ${prefix}help <commande>
`;

      return message.reply(msg);
    }

    // =========================
    // 📌 DÉTAIL COMMANDE
    // =========================
    const commandName = args[0].toLowerCase();
    const command =
      commands.get(commandName) ||
      commands.get(aliases.get(commandName));

    if (!command) {
      return message.reply(
`࿇ ══━━✥🌸✥━━══ ࿇
❌ COMMANDE INTROUVABLE
࿇ ══━━✥🌸✥━━══ ࿇`
      );
    }

    const cfg = command.config;
    const roleText = {0:"Tous les utilisateurs",1:"Administrateurs",2:"Bot Admin"}[cfg.role] || "Inconnu";
    const usage = (cfg.guide?.en || "{pn} " + cfg.name).replace("{pn}", prefix);

    const resp = `࿇ ══━━✥🌸✥━━══ ࿇
🌸 ${applyFont(cfg.name.toUpperCase())}
࿇ ══━━✥🌸✥━━══ ࿇

📌 Version : ${cfg.version || "1.0"}
👤 Auteur : ${cfg.author}
🔐 Rôle : ${roleText}
⏳ Cooldown : ${cfg.countDown || 2}s

📖 Description :
${cfg.longDescription?.en || "Aucune description"}

💡 Utilisation :
${usage}

࿇ ══━━✥🌸✥━━══ ࿇`;

    return message.reply(resp);
  }
};
