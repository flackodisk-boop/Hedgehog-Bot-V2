module.exports = {
  config: {
    name: "ai",
    version: "1.0",
    author: "Célestin Olua",
    role: 0,
    category: "ai",
    shortDescription: "Intercepte 'Ai' et informe sur les préfixes",
    guide: "Écrivez simplement Ai pour recevoir le message"
  },

  onStart: async function({ message, event }) {
    // Obligatoire pour Smill, même vide
    return;
  },

  onChat: async function({ event, message, usersData }) {
    const userMsg = event.body?.trim();
    if (!userMsg) return;

    // Normalisation pour éviter accents et casse
    const text = userMsg.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

    if (text.startsWith("ai")) {
      return message.reply(
        `✧═════•❁❀❁•═════✧\n` +
        `⚡ Oups, IA indisponible !\n` +
        `🛠️ Pour discuter avec une IA, utilisez les préfixes **neo** ou **flash**.\n` +
        `💡 Exemple : \`neo Bonjour\` ou \`flash Salut\`\n` +
        `✨ Laissez-moi vous surprendre avec mon style et mes emojis 😎\n` +
        `✧═════•❁❀❁•═════✧`
      );
    }
  }
};
