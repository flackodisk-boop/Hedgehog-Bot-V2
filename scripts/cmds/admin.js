const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

// 🌸 STYLE CADRE
function neo(text) {
	return `
🌸 ══━━✥🌺✥━━══ 🌸

✨ ${text}

🌸 ══━━✥🌺✥━━══ 🌸
`;
}

module.exports = {
	config: {
		name: "admin",
		version: "2.0",
		author: "NTKhang + Celestin 👑",
		countDown: 5,
		role: 2,
		description: {
			en: "Manage admin system"
		},
		category: "system"
	},

	langs: {
		en: {
			added: "👑 Accès accordé à %1 élu(x) :\n%2",
			alreadyAdmin: "\n⚠️ Déjà dans l'élite :\n%2",
			missingIdAdd: "⚠️ Donne un UID ou tag",
			removed: "❌ Pouvoir retiré à %1 membre(s) :\n%2",
			notAdmin: "⚠️ Non membre du système :\n%2",
			missingIdRemove: "⚠️ Donne un UID ou tag",
			listAdmin: "👑 Les Boss du Système :\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {

		switch (args[0]) {

			// ================= ADD =================
			case "add":
			case "-a": {
				if (!args[1])
					return message.reply(neo(getLang("missingIdAdd")));

				let uids = [];
				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				const notAdminIds = [];
				const adminIds = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						adminIds.push(uid);
					else
						notAdminIds.push(uid);
				}

				config.adminBot.push(...notAdminIds);

				const getNames = await Promise.all(
					uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(neo(
					(notAdminIds.length > 0
						? getLang("added", notAdminIds.length, getNames.map(i => `• ${i.name} (${i.uid})`).join("\n"))
						: "") +
					(adminIds.length > 0
						? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n"))
						: "")
				));
			}

			// ================= REMOVE =================
			case "remove":
			case "-r": {
				if (!args[1])
					return message.reply(neo(getLang("missingIdRemove")));

				let uids = [];
				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else
					uids = args.filter(arg => !isNaN(arg));

				const notAdminIds = [];
				const adminIds = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						adminIds.push(uid);
					else
						notAdminIds.push(uid);
				}

				for (const uid of adminIds)
					config.adminBot.splice(config.adminBot.indexOf(uid), 1);

				const getNames = await Promise.all(
					adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(neo(
					(adminIds.length > 0
						? getLang("removed", adminIds.length, getNames.map(i => `• ${i.name} (${i.uid})`).join("\n"))
						: "") +
					(notAdminIds.length > 0
						? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n"))
						: "")
				));
			}

			// ================= LIST =================
			case "list":
			case "-l": {
				const getNames = await Promise.all(
					config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				return message.reply(neo(
					getLang("listAdmin",
						getNames.map(i => `• ${i.name} (${i.uid})`).join("\n")
					)
				));
			}

			// ================= DEFAULT =================
			default:
				return message.reply(neo("⚠️ Commande inconnue"));
		}
	}
};
