const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "2.0",
		author: "Royal System",
		countDown: 5,
		role: 2,
		description: "Envoie un communiqué officiel à tous les groupes",
		category: "owner",
		guide: {
			en: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, usersData }) {
		const { delayPerGroup } = envCommands[commandName];

		if (!args[0])
			return message.reply("⚠️ Veuillez écrire un message.");

		const now = new Date();
		const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
		const date = now.toLocaleDateString("fr-FR");

		const allThreadID = (await threadsData.getAll())
			.filter(t => t.isGroup);

		const adminName = await usersData.getName(api.getCurrentUserID());

		const formSend = {
			body:
`‎🇫🇷━━━━━━━━━━━━━━━━━━━━
👑 𝘾𝙊𝙈𝙈𝙐𝙉𝙄𝙌𝙐𝙀́ 𝙊𝙁𝙁𝙄𝘾𝙄𝙀𝙇
━━━━━━━━━━━━━━━━━━━━

🏷️ Groupe : %GROUP_NAME%
👥 Membres : %MEMBERS%
🕒 Heure : ${time} | 📅 ${date}

━━━━━━━━━━━━━━━━━━━━
📝 ${args.join(" ")}

━━━━━━━━━━━━━━━━━━━━
🤝 Liberté • Égalité • Respect
👤 Responsable : @${adminName}
━━━━━━━━━━━━━━━━━━━━`
		};

		message.reply(`📡 Envoi du communiqué à ${allThreadID.length} groupes...`);

		let success = 0;

		for (const thread of allThreadID) {
			try {
				const info = await api.getThreadInfo(thread.threadID);

				const msg = {
					body: formSend.body
						.replace("%GROUP_NAME%", info.threadName)
						.replace("%MEMBERS%", info.participantIDs.length),
					mentions: [
						{
							tag: adminName,
							id: api.getCurrentUserID()
						}
					]
				};

				await api.sendMessage(msg, thread.threadID);
				success++;

				await new Promise(r => setTimeout(r, delayPerGroup));
			} catch (e) {
				console.log("Erreur envoi:", e.message);
			}
		}

		return message.reply(
`👑 COMMUNIQUÉ TERMINÉ

✅ Envoyé avec succès à ${success} groupes
⚡ Système royal actif`
		);
	}
};
