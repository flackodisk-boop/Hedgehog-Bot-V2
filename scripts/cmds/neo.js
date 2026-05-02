const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 📦 MEMORY SIMPLE
const DB_FILE = path.join(__dirname, "neo_memory.json");

// 🔒 SAFE LOAD DB
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 🧠 MEMORY USER
function getMem(id) {
  const db = loadDB();

  if (!db[id]) {
    db[id] = {
      name: null,
      mood: "normal",
      messages: 0,
      uid: id,
      history: []
    };
  }

  if (!Array.isArray(db[id].history)) {
    db[id].history = [];
  }

  return db[id];
}

function setMem(id, data) {
  const db = loadDB();
  db[id] = data;
  saveDB(db);
}

// 🌸 FRAME AVEC TON CADRE
function frame(text) {
  return `
❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜

🌸 ࿇ ══━━✥🌺✥━━══ ࿇ 🌸

${text}

🌸 ࿇ ══━━✥🌺✥━━══ ࿇ 🌸

❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜
`;
}

// 🕒 HEURE
function getTime() {
  return new Date().toLocaleString("fr-FR", {
    timeZone: "Africa/Kinshasa"
  });
}

// 🎨 IMAGE
function imagine(prompt) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
}

// 🔧 SAFE STREAM
const getStream =
  global.utils?.getStreamFromURL ||
  (async (url) =>
    await axios.get(url, { responseType: "stream" }).then(r => r.data)
  );

// 🧹 CLEAN TEXT
function cleanText(text) {
  return text
    .replace(/🤖\s*NEO\s*:/gi, "")
    .replace(/NEO\s*:/gi, "")
    .trim();
}

// 🤖 AI PROMPT
async function askAI(prompt, mood, name, uid) {
  const fullPrompt = `
Tu es NEO, IA créée par Célestin Olua 🇨🇩.

Utilisateur :
Nom: ${name || "inconnu"}
UID: ${uid}
Humeur: ${mood}
Heure: ${getTime()}

Réponds naturellement avec emojis légers 🌸

Message:
${prompt}
`;

  const services = [
    {
      url: "https://shizuai.vercel.app/chat",
      method: "post",
      data: { uid, message: fullPrompt }
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

      return res.data?.reply || res.data?.message || "…";
    } catch {}
  }

  return "Je réfléchis doucement... 🌸";
}

// 🧠 MODULE
module.exports = {
  config: {
    name: "neo",
    version: "10.0.2",
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

    // 🧠 history
    mem.history.push({
      text: input,
      time: getTime()
    });

    if (mem.history.length > 20) mem.history.shift();

    setMem(uid, mem);

    api.setMessageReaction("🌸", event.messageID, () => {}, true);

    try {
      // 🎨 IMAGINE MODE
      if (input.toLowerCase().startsWith("imagine ")) {
        const prompt = input.slice(8);

        return message.reply({
          body: frame("🎨 " + prompt),
          attachment: await getStream(imagine(prompt))
        });
      }

      const reply = await askAI(input, mem.mood, mem.name, uid);
      const clean = cleanText(reply);

      const moodText = {
        funny: "😂 humeur : drôle",
        calm: "😌 humeur : calme",
        happy: "😊 humeur : heureux",
        normal: "🌸 humeur : normale"
      };

      return message.reply(
        frame(
          `${moodText[mem.mood] || "🌸 humeur inconnue"}\n\n${clean}`
        )
      );

    } catch (e) {
      return message.reply(frame("❌ erreur légère mais NEO reste active 🌸"));
    }
  }
};
