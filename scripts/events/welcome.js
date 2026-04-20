const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;

// 🌸 CADRE STYLE
function neo(text) {
	return `
🌸 ══━━✥🌺✥━━══ 🌸

✨ ${text}

🌸 ══━━✥🌺✥━━══ 🌸
`;
}

module.exports = {
	config: {
		name: "welcome",
		version: "3.1",
		author: "Saimx69x x Célestin 👑",
		category: "events"
	},

	onStart: async function ({ api, event }) {
		if (event.logMessageType !== "log:subscribe") return;

		const { threadID, logMessageData } = event;
		const { addedParticipants } = logMessageData;

		const prefix = getPrefix(threadID);
		const botID = api.getCurrentUserID();

		// 🤖 BOT JOIN
		if (addedParticipants.some(u => u.userFbId === botID)) {
			return api.sendMessage(
				neo(
`🤖 SYSTÈME CONNECTÉ

⚡ Bot activé avec succès
💠 Préfixe : ${prefix}

👑 Statut : OPÉRATIONNEL
🔥 Prêt à servir le groupe`
				),
				threadID
			);
		}

		// 👤 USER JOIN
		const threadInfo = await api.getThreadInfo(threadID);
		const groupName = threadInfo.threadName;
		const memberCount = threadInfo.participantIDs.length;

		for (const user of addedParticipants) {
			const userId = user.userFbId;
			const name = user.fullName;

			try {
				const time = new Date().toLocaleString("fr-FR");

				// IMAGE API
				const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/welcome?name=${encodeURIComponent(name)}&uid=${userId}&threadname=${encodeURIComponent(groupName)}&members=${memberCount}`;

				const cacheDir = path.join(__dirname, "..", "cache");
				await fs.ensureDir(cacheDir);

				const imgPath = path.join(cacheDir, `welcome_${userId}.png`);

				const res = await axios.get(apiUrl, { responseType: "arraybuffer" });
				fs.writeFileSync(imgPath, res.data);

				// MESSAGE
				await api.sendMessage({
					body: neo(
`👋 BIENVENUE ${name}

🏷️ Groupe : ${groupName}
👥 Membres : ${memberCount}

💬 Respect • Fun • Bonne ambiance
🔥 Tu es maintenant membre officiel

🕒 ${time}`
					),
					attachment: fs.createReadStream(imgPath),
					mentions: [{ tag: name, id: userId }]
				}, threadID);

				fs.unlinkSync(imgPath);

			} catch (err) {
				console.log("❌ welcome error:", err);
			}
		}
	}
};
