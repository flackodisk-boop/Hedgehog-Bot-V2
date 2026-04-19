const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "callad",
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "gửi báo cáo, góp ý, báo lỗi,... của bạn về admin bot",
			en: "send report, feedback, bug,... to admin bot"
		},
		category: "contacts admin",
		guide: {
			en: "{pn} <message>"
		}
	},

	langs: {
		en: {
			missingMessage:
`࿇ ══━━✥👑✥━━══ ࿇
⚜️ MESSAGE MANQUANT

💬 Écris un message à envoyer au ROI (admin)
࿇ ══━━✥👑✥━━══ ࿇`,

			sendByGroup:
`\n🏰 Provenance : %1\n🆔 ID Groupe : %2`,

			sendByUser:
`\n👤 Message envoyé en privé`,

			content:
`\n\n📜 CONTENU ROYAL
═══════════════════
%1
═══════════════════
💬 Réponds à ce message pour répondre à l’utilisateur`,

			success:
`࿇ ══━━✥👑✥━━══ ࿇
✅ TRANSMISSION RÉUSSIE

📡 Message envoyé à %1 admin(s)
%2
࿇ ══━━✥👑✥━━══ ࿇`,

			failed:
`࿇ ══━━✥❌✥━━══ ࿇
⚠️ ÉCHEC PARTIEL

❌ Impossible d’envoyer à %1 admin(s)
%2
📌 Vérifie la console
࿇ ══━━✥❌✥━━══ ࿇`,

			reply:
`࿇ ══━━✥👑✥━━══ ࿇
📩 RÉPONSE DU ROI %1
═══════════════════
%2
═══════════════════
💬 Réponds pour continuer la discussion
࿇ ══━━✥👑✥━━══ ࿇`,

			replySuccess:
`࿇ ══━━✥👑✥━━══ ࿇
✅ MESSAGE ENVOYÉ AU ROI
࿇ ══━━✥👑✥━━══ ࿇`,

			feedback:
`࿇ ══━━✥📜✥━━══ ࿇
📝 MESSAGE DU SUJET %1

🆔 ID : %2%3

═══════════════════
%4
═══════════════════
💬 Réponds pour envoyer une réponse
࿇ ══━━✥📜✥━━══ ࿇`,

			replyUserSuccess:
`࿇ ══━━✥👑✥━━══ ࿇
✅ RÉPONSE ENVOYÉE AU SUJET
࿇ ══━━✥👑✥━━══ ࿇`,

			noAdmin:
`࿇ ══━━✥❌✥━━══ ࿇
🚫 AUCUN ADMIN

⚠️ Aucun ROI n’est défini pour ce bot
࿇ ══━━✥❌✥━━══ ࿇`
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;

		if (!args[0])
			return message.reply(getLang("missingMessage"));

		if (config.adminBot.length == 0)
			return message.reply(getLang("noAdmin"));

		const { senderID, threadID, isGroup } = event;
		const senderName = await usersData.getName(senderID);

		const msg =
`࿇ ══━━✥👑✥━━══ ࿇
📨 APPEL AU ROI
࿇ ══━━✥👑✥━━══ ࿇

👤 Nom : ${senderName}
🆔 ID : ${senderID}`
			+ (isGroup
				? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID)
				: getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [];
		const failedIDs = [];

		const adminNames = await Promise.all(config.adminBot.map(async item => ({
			id: item,
			name: await usersData.getName(item)
		})));

		for (const uid of config.adminBot) {
			try {
				const messageSend = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);

				global.GoatBot.onReply.set(messageSend.messageID, {
					commandName,
					messageID: messageSend.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			}
			catch (err) {
				failedIDs.push({ adminID: uid, error: err });
			}
		}

		let msg2 = "";

		if (successIDs.length > 0)
			msg2 += getLang("success", successIDs.length,
				adminNames
					.filter(item => successIDs.includes(item.id))
					.map(item => ` <@${item.id}> (${item.name})`)
					.join("\n")
			);

		if (failedIDs.length > 0) {
			msg2 += getLang("failed", failedIDs.length,
				failedIDs.map(item =>
					` <@${item.adminID}> (${adminNames.find(a => a.id == item.adminID)?.name || item.adminID})`
				).join("\n")
			);
			log.err("CALL ADMIN", failedIDs);
		}

		return message.reply({
			body: msg2,
			mentions: adminNames.map(item => ({
				id: item.id,
				tag: item.name
			}))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const { isGroup } = event;

		switch (type) {

			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", senderName, args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);

					message.reply(getLang("replyUserSuccess"));

					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}

			case "adminReply": {
				let sendByGroup = "";

				if (isGroup) {
					const { threadName } = await api.getThreadInfo(event.threadID);
					sendByGroup = getLang("sendByGroup", threadName, event.threadID);
				}

				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);

					message.reply(getLang("replySuccess"));

					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
		}
	}
};
