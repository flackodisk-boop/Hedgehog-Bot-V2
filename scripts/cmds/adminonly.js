const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

// 🌸 CADRE NEO
function frameNeo(text) {
  return `
🌸 ࿇ ══━━✥🌺✥━━══ ࿇ 🌸

👑  — 𝐒𝐘𝐒𝐓𝐄̀𝐌𝐄 𝐑𝐎𝐘𝐀𝐋

${text}

🌸 ࿇ ══━━✥🌺✥━━══ ࿇ 🌸
`;
}

module.exports = {
config: {
name: "adminonly",
aliases: ["adonly", "onlyad", "onlyadmin"],
version: "2.0",
author: "Célestin Olua",
countDown: 5,
role: 2,
description: {
fr: "Activer/désactiver le mode admin uniquement"
},
category: "owner",
guide: {
fr:
"   {pn} on/off : activer ou désactiver le mode admin\n" +
"   {pn} noti on/off : activer ou désactiver les notifications"
}
},

langs: {
fr: {
turnedOn: frameNeo("👑 Le mode ROYAL est activé.\n✨ Seuls les administrateurs peuvent utiliser le bot."),
turnedOff: frameNeo("🌿 Le mode royal est désactivé.\n✨ Tous les membres peuvent utiliser le bot."),
turnedOnNoti: frameNeo("🔔 Les notifications sont activées.\n👑 Les non-admins seront avertis."),
turnedOffNoti: frameNeo("🔕 Les notifications sont désactivées.\n🌿 Le silence règne à nouveau.")
}
},

onStart: function ({ args, message, getLang }) {
let isSetNoti = false;
let value;
let indexGetVal = 0;

if (args[0] == "noti") {
	isSetNoti = true;
	indexGetVal = 1;
}

if (args[indexGetVal] == "on")
	value = true;
else if (args[indexGetVal] == "off")
	value = false;
else
	return message.reply(frameNeo("⚠️ Commande invalide.\n👑 Utilise : adminonly on/off"));

if (isSetNoti) {
	config.hideNotiMessage.adminOnly = !value;
	message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
}
else {
	config.adminOnly.enable = value;
	message.reply(getLang(value ? "turnedOn" : "turnedOff"));
}

fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
}

};
