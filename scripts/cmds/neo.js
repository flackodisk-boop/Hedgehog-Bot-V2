const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ================= MÉMOIRE =================
const memoryPath = path.join(__dirname, "neo_memory.json");

let memory = {};
if (fs.existsSync(memoryPath)) {
  try {
    memory = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
  } catch (e) {
    memory = {};
  }
}

function saveMemory() {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// ================= API =================
async function fetchFromAI(url, params) {
  try {
    const res = await axios.get(url, { params: params, timeout: 20000 });
    return res.data;
  } catch (e) {
    console.error("API error:", e.message);
    return null;
  }
}

async function getAIResponse(input, userName, userID) {
  if (!memory[userID]) memory[userID] = [];

  memory[userID].push(userName + ": " + input);
  if (memory[userID].length > 10) memory[userID].shift();
  saveMemory();

  const context = memory[userID].join("\n");

  const services = [
    {
      url: "https://arychauhann.onrender.com/api/gemini-proxy2",
      params: {
        prompt: "Tu es Neo 🤖, une IA multilingue.\nCréateur : Célestin Olua.\n" +
                "Historique :\n" + context + "\n\nRéponds avec naturel et emojis adaptés au ton."
      }
    },
    {
      url: "https://ai-chat-gpt-4-lite.onrender.com/api/hercai",
      params: {
        question: "Tu es Neo 🤖, une IA multilingue.\nCréateur : Célestin Olua.\n" +
                  "Conversation :\n" + context
      }
    }
  ];

  let response = "😿 Oups… le serveur ne répond pas.";

  for (let i = 0; i < services.length; i++) {
    const data = await fetchFromAI(services[i].url, services[i].params);
    if (!data) continue;

    const reply = data.result || data.reply || data.gpt4 || data.response;
    if (reply && reply.trim()) {
      response = reply.trim();
      break;
    }
  }

  memory[userID].push(response);
  if (memory[userID].length > 10) memory[userID].shift();
  saveMemory();

  // Ajouter emojis selon ton/humeur simple
  if (/heureux|cool|content|🙂|😄/i.test(input)) response += " 😄🌟";
  if (/triste|😢|mal/i.test(input)) response += " 😢💧";
  if (/interrogation|🤔|quoi/i.test(input)) response += " 🤔❓";

  return response;
}

// ================= CADRAGE FLORAL EN HAUT ET BAS =================
function frameResponse(text) {
  const flower = "🌸";
  const border = "࿇ ══━━✥◈✥━━══ ࿇";
  return `${flower} ${border} ${flower}\n\n${text}\n\n${flower} ${border} ${flower}`;
}

// ================= REGEX CRÉATEUR =================
const creatorRegex = /(qui\s+ta\s+cree|ton\s+createur|createur|qui\s+ta\s+fait)/i;

// ================= MODULE =================
module.exports = {
  config: {
    name: "neo",
    aliases: ["neo", "neo-bot"],
    author: "Célestin Olua",
    role: 0,
    category: "ai",
    shortDescription: "IA Neo multilingue avec mémoire et emojis",
    guide: { fr: "neo <message>" }
  },

  onStart: async function (ctx) {
    const api = ctx.api;
    const event = ctx.event;
    const args = ctx.args;

    const input = args.join(" ").trim();
    if (!input) return api.sendMessage(frameResponse("😿 Parle-moi !"), event.threadID, event.messageID);

    api.getUserInfo(event.senderID, async function (err, data) {
      if (err) return;
      const userName = data[event.senderID]?.name || "toi";

      if (creatorRegex.test(input)) {
        return api.sendMessage(frameResponse("😎 Mon créateur est **Célestin Olua** 💡"), event.threadID, event.messageID);
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const response = await getAIResponse(input, userName, event.senderID);

      api.sendMessage(frameResponse(response), event.threadID, event.messageID, () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      });
    });
  },

  onChat: async function (ctx) {
    const api = ctx.api;
    const event = ctx.event;
    const message = ctx.message;

    if (!event.body) return;
    const body = event.body.trim();
    if (/^ai\b/i.test(body)) return;

    const match = body.match(/^(neo|neo-bot)\s+(.*)/i);
    if (!match) return;
    const input = match[2].trim();
    if (!input) return;

    api.getUserInfo(event.senderID, async function (err, data) {
      if (err) return;
      const userName = data[event.senderID]?.name || "toi";

      if (creatorRegex.test(input)) {
        return message.reply(frameResponse("😎 Créateur : **Célestin Olua** 💡"));
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const response = await getAIResponse(input, userName, event.senderID);

      message.reply(frameResponse(response), () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      });
    });
  }
};
