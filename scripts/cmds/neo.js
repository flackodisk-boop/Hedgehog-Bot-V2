const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 📦 MEMORY SIMPLE
const DB_FILE = path.join(__dirname, "neo_memory.json");

function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function getMem(id) {
  const db = loadDB();
  if (!db[id]) {
    db[id] = { name: null, mood: "normal", messages: 0 };
  }
  return db[id];
}

function setMem(id, data) {
  const db = loadDB();
  db[id] = data;
  saveDB(db);
}

// 🌸 FRAME
function frame(text) {
  return `
🌸 ࿇ ══━━✥🌺✥━━══ ࿇ 🌸

${text}

🌸 ࿇ ══━━✥🌺✥━━══ ࿇ 🌸
`;
}

// 🧹 CLEAN OUTPUT (IMPORTANT)
function cleanText(text) {
  return text
    .replace(/🎀.*?\(\s*\d+\/\d+\s*\)/gi, "")
    .replace(/🎀\s*𝗦𝗵𝗶𝘇𝘂.*?\n?/gi, "")
    .replace(/🤖\s*NEO\s*:/gi, "")
    .replace(/NEO\s*:/gi, "")
    .trim();
}

// 🎨 IMAGINE
function imagine(prompt) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
}

// 🤖 AI CALL (Christus APIs)
async function askAI(prompt, mood, name) {
  const fullPrompt = `
Tu es une IA naturelle. ton créateur Célestin olua. tu parle avec emojis mais pas trop.

Ne mets aucun titre.
Réponds comme un humain.

Utilisateur: ${name || "ami"}
Humeur: ${mood}

Message:
${prompt}
`;

  const services = [
    {
      url: "https://shizuai.vercel.app/chat",
      method: "post",
      data: { uid: "neo", message: fullPrompt }
    }
  ];

  for (let s of services) {
    try {
      const res = await axios({
        method: s.method,
        url: s.url,
        data: s.data,
        timeout: 20000
      });

      return (
        res.data?.reply ||
        res.data?.message ||
        res.data?.response ||
        "..."
      );
    } catch {}
  }

  return "Je réfléchis doucement... 🌸";
}

// 🧠 MODULE
module.exports = {
  config: {
    name: "neo",
    version: "10.0.0",
    role: 0,
    category: "ai"
  },

  onStart: async function () {},

  onChat: async function ({ api, event, message }) {
    if (!event.body) return;

    const body = event.body.trim();

    if (!body.toLowerCase().startsWith("neo")) return;

    const input = body.slice(3).trim();
    if (!input) return;

    const uid = event.senderID;
    let mem = getMem(uid);

    mem.messages++;

    // 🎭 mood system
    if (input.includes("blague")) mem.mood = "funny";
    else if (input.includes("triste")) mem.mood = "calm";
    else if (input.includes("merci")) mem.mood = "happy";
    else mem.mood = "normal";

    // 🧠 name memory
    if (input.toLowerCase().startsWith("je m'appelle")) {
      mem.name = input.replace(/je m'appelle/i, "").trim();
    }

    setMem(uid, mem);

    api.setMessageReaction("🌸", event.messageID, () => {}, true);

    try {
      // 🎨 IMAGINE MODE
      if (input.toLowerCase().startsWith("imagine ")) {
        const prompt = input.slice(8);

        return message.reply({
          body: frame("🎨 " + prompt),
          attachment: await global.utils.getStreamFromURL(imagine(prompt))
        });
      }

      const reply = await askAI(input, mem.mood, mem.name);
      const clean = cleanText(reply);

      return message.reply(frame(clean));

    } catch (e) {
      return message.reply(frame("❌ erreur légère mais NEO reste active 🌸"));
    }
  }
};
