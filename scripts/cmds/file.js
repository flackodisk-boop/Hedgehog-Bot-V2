const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.0",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {

		const permission = ["61561648169981"];

		if (!permission.includes(event.senderID)) {
			return api.sendMessage(
`࿇ ══━━✥👑✥━━══ ࿇
   ⚜️ ACCÈS REFUSÉ ⚜️
࿇ ══━━✥👑✥━━══ ࿇

💥 Tu n’es pas autorisé à utiliser cette commande.
🔐 Seul le ROI peut accéder à ce pouvoir.

࿇ ══━━✥👑✥━━══ ࿇`,
				event.threadID,
				event.messageID
			);
		}

		const fileName = args[0];

		if (!fileName) {
			return api.sendMessage(
`࿇ ══━━✥👑✥━━══ ࿇
   ⚜️ COMMANDE INCOMPLÈTE ⚜️
࿇ ══━━✥👑✥━━══ ࿇

📂 Donne le nom du fichier à invoquer.
💡 Exemple : .file help

࿇ ══━━✥👑✥━━══ ࿇`,
				event.threadID,
				event.messageID
			);
		}

		const filePath = __dirname + `/${fileName}.js`;

		if (!fs.existsSync(filePath)) {
			return api.sendMessage(
`࿇ ══━━✥👑✥━━══ ࿇
   ⚜️ FICHIER INTROUVABLE ⚜️
࿇ ══━━✥👑✥━━══ ࿇

❌ Le fichier "${fileName}.js" n’existe pas.
📁 Vérifie le nom et réessaie.

࿇ ══━━✥👑✥━━══ ࿇`,
				event.threadID,
				event.messageID
			);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');

		return api.sendMessage(
{
	body:
`࿇ ══━━✥👑✥━━══ ࿇
      ⚜️ ARCHIVES DU ROI ⚜️
࿇ ══━━✥👑✥━━══ ࿇

📜 Fichier : ${fileName}.js
✨ Transmission du savoir royal...

࿇ ══━━✥👑✥━━══ ࿇

${fileContent}

࿇ ══━━✥👑✥━━══ ࿇`,
},
			event.threadID
		);
	}
};
