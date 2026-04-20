module.exports = {
	// Tu peux personnaliser les textes ici ou directement dans les commandes
	autoUpdateThreadInfo: {},

	checkwarn: {
		text: {
			warn:
`🌸 ══━━✥👑✥━━══ 🌸
💥 𝐉𝐔𝐆𝐄𝐌𝐄𝐍𝐓 𝐑𝐎𝐘𝐀𝐋 💥

⚠️ Le membre %1 a atteint 3 avertissements
🚫 Expulsion automatique du groupe

👤 Nom : %1
🆔 UID : %2

🔓 Débannir :
%3warn unban <uid>

🌸 ══━━✥👑✥━━══ 🌸`,

			needPermission:
`🌸 ══━━✥👑✥━━══ 🌸
❌ 𝐄𝐑𝐑𝐄𝐔𝐑 𝐑𝐎𝐘𝐀𝐋 ❌

Le bot n’a pas les permissions administrateur
pour exécuter cette action

🌸 ══━━✥👑✥━━══ 🌸`
		}
	},

	leave: {
		text: {
			session1: "matin",
			session2: "midi",
			session3: "après-midi",
			session4: "soir",
			leaveType1: "a quitté le royaume",
			leaveType2: "a été banni du royaume"
		}
	},

	logsbot: {
		text: {
			title:
`🌸 ══━━✥🤖✥━━══ 🌸
👑 𝐉𝐎𝐔𝐑𝐍𝐀𝐋 𝐑𝐎𝐘𝐀𝐋 👑
🌸 ══━━✥🤖✥━━══ 🌸`,

			added:
`
🌸 ══━━✥✨✥━━══ 🌸
🤖 𝐀𝐋𝐋𝐈𝐀𝐍𝐂𝐄 𝐀𝐂𝐓𝐈𝐕𝐄

Le bot a été invoqué dans un nouveau groupe
👤 Par : %1

🌸 ══━━✥✨✥━━══ 🌸`,

			kicked:
`
🌸 ══━━✥💥✥━━══ 🌸
🚫 𝐄𝐗𝐈𝐋 𝐃𝐔 𝐁𝐎𝐓

Expulsé par : %1

🌸 ══━━✥💥✥━━══ 🌸`,

			footer:
`
━━━━━━━━━━━━━━━━━━━━
🆔 ID User : %1
💬 Royaume : %2
🆔 ID Groupe : %3
🕒 Heure : %4
━━━━━━━━━━━━━━━━━━━━`
		}
	},

	onEvent: {},

	welcome: {
		text: {
			session1: "matin",
			session2: "midi",
			session3: "après-midi",
			session4: "soir",

			welcomeMessage:
`🌸 ══━━✥👑✥━━══ 🌸
✨ 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐔𝐄 𝐑𝐎𝐘𝐀𝐋𝐄 ✨

🤖 Le bot a rejoint le royaume
🔑 Préfixe : %1
💬 Tape %1help pour les commandes

🌸 ══━━✥👑✥━━══ 🌸`,

			multiple1: "toi",
			multiple2: "vous"
		}
	}
};
