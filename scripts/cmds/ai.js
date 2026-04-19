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

  onStart: async function({ message }) {
    return;
  },

  onChat: async function({ event, message }) {
    const userMsg = event.body?.trim();
    if (!userMsg) return;

    const text = userMsg
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    if (text.startsWith("ai")) {
      return message.reply(
`࿇ ══━━✥🌸✥━━══ ࿇
⚡ IA INDISPONIBLE

🛠️ Pour accéder à l’intelligence artificielle :
👉 utilisez les commandes : neo ou flash

💡 Exemples :
• neo salut
• flash bonjour

✨ Système actif, mais accès direct bloqué
࿇ ══━━✥🌸✥━━══ ࿇`
      );
    }
  }
};
