const axios = require("axios");

const CREATOR_ID = "ID_CELESTIN_OLUA"; // 🔥 mets ton vrai ID
const memory = {};
const moods = {};
const moodList = ["fun", "cool", "froid", "sarcastique", "énergique"];
const lastMoodChange = {};

function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

function frameMessage(userName, content) {
  return `✧═════•❁❀❁•═════✧\n${content}\n👤 ${userName}\n✧═════•❁❀❁•═════✧`;
}

// 🧠 Réponses locales intelligentes
function localAI(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("salut") || msg.includes("bonjour"))
    return "👋 Salut ! Je suis Neo, prêt à t’aider 😎";

  if (msg.includes("ça va"))
    return "😎 Moi ça va toujours, je suis une IA ! Et toi ?";

  if (msg.includes("qui es tu"))
    return "🤖 Je suis Neo, l’IA créée par Célestin Olua 👑";

  if (msg.includes("merci"))
    return "😄 Avec plaisir !";

  if (msg.includes("aide"))
    return "⚡ Tape 'neo + ta question' pour me parler !";

  return null;
}

module.exports = {
  config: {
    name: "neo",
    version: "21.0",
    author: "Célestin Olua",
    role: 0,
    category: "ai",
    shortDescription: "Neo V21 PRO MAX",
  },

  onStart: async function ({ message }) {
    return message.reply("🤖 Neo V21 PRO activé ! Tape 'neo salut'");
  },

  onChat: async ({ event, message, usersData }) => {
    try {
      const userID = event.senderID;
      const userMsg = event.body?.trim();
      if (!userMsg) return;

      let userName = "Utilisateur";
      try {
        userName = await usersData.getName(userID);
      } catch {}

      const text = normalizeText(userMsg);

      // 🔒 Activation
      if (userID !== CREATOR_ID && !text.startsWith("neo")) return;

      // 👑 MODE GOD CRÉATEUR
      if (userID === CREATOR_ID && text === "neo") {
        return message.reply("👑 Bienvenue Célestin Olua\n⚡ Mode GOD activé !");
      }

      const args = userMsg.split(" ");
      const userPrompt = args.slice(1).join(" ") || "salut";

      // 🎭 humeur
      const now = Date.now();
      if (!moods[userID]) {
        moods[userID] = moodList[Math.floor(Math.random() * moodList.length)];
        lastMoodChange[userID] = now;
      }
      if (now - lastMoodChange[userID] > 120000) {
        moods[userID] = moodList[Math.floor(Math.random() * moodList.length)];
        lastMoodChange[userID] = now;
      }

      const mood = moods[userID];

      // 🧹 CLEAR
      if (userPrompt === "clear" && userID === CREATOR_ID) {
        memory[userID] = "";
        return message.reply(frameMessage(userName, "🧹 Mémoire reset !"));
      }

      // 🧠 IA LOCALE D'ABORD
      const localReply = localAI(userPrompt);
      if (localReply) {
        return message.reply(frameMessage(userName, localReply));
      }

      const memoryText = memory[userID] || "";

      const prompt = `
Tu es Neo 🤖 IA ultra intelligente.
Humeur: ${mood}
Créateur: Célestin Olua
Utilisateur: ${userName}
Mémoire: ${memoryText}
Message: ${userPrompt}

Réponds de façon naturelle, stylée et intelligente avec emojis.
`;

      try {
        const res = await axios.get(
          `https://arychauhann.onrender.com/api/gemini-proxy2?prompt=${encodeURIComponent(prompt)}`,
          { timeout: 10000 }
        );

        let reply = res.data?.reply || res.data?.result;

        if (!reply) throw new Error();

        memory[userID] = reply.slice(0, 300);

        return message.reply(frameMessage(userName, reply));

      } catch {

        // 🔥 FALLBACK
        const fallback = [
          "🤖 Je réfléchis encore...",
          "😅 Petite panne, mais je suis là !",
          "⚡ Reformule ta question 😎",
          "🧠 Intéressant... continue 👀"
        ];

        const randomReply = fallback[Math.floor(Math.random() * fallback.length)];

        return message.reply(frameMessage(userName, randomReply));
      }

    } catch {
      return message.reply("❌ Erreur critique Neo");
    }
  }
};
