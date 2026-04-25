const axios = require("axios");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const { client } = global;

const { configCommands } = global.GoatBot;
const { log, loading, removeHomeDir } = global.utils;

// ================= UTILS =================
function getDomain(url) {
	const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
	const match = url.match(regex);
	return match ? match[1] : null;
}

function isURL(str) {
	try {
		new URL(str);
		return true;
	}
	catch (e) {
		return false;
	}
}

// ================= COMMAND =================
module.exports = {
	config: {
		name: "cmd",
		version: "2.0",
		author: "NTKhang + Royal Edit",
		countDown: 5,
		role: 2,
		description: {
			vi: "👑 Gestion royale des commandes",
			en: "👑 Royal command manager"
		},
		category: "owner"
	},

	// ================= LANGS =================
	langs: {
		vi: {
			missingFileName: "🌸 ══━━✥⚠️✥━━══ 🌸\n📜 Nom de commande requis\n🌸 ══━━✥📜✥━━══ 🌸",
			loaded: "🌸 ══━━✥👑✥━━══ 🌸\n✅ Commande \"%1\" chargée\n🌸 ══━━✥📜✥━━══ 🌸",
			loadedError: "🌸 ══━━✥❌✥━━══ 🌸\n💥 Échec \"%1\"\n%2: %3\n🌸 ══━━✥📜✥━━══ 🌸",
			loadedSuccess: "🌸 ══━━✥👑✥━━══ 🌸\n⚡ %1 commandes chargées\n🌸 ══━━✥📜✥━━══ 🌸",
			loadedFail: "🌸 ══━━✥❌✥━━══ 🌸\n💥 %1 échecs\n%2\n🌸 ══━━✥📜✥━━══ 🌸",
			openConsoleToSeeError: "👀 Consulte la console",
			missingCommandNameUnload: "🌸 ══━━✥⚠️✥━━══ 🌸\n📜 Nom requis\n🌸 ══━━✥📜✥━━══ 🌸",
			unloaded: "🌸 ══━━✥⚡✥━━══ 🌸\nCommande \"%1\" retirée\n🌸 ══━━✥📜✥━━══ 🌸",
			unloadedError: "🌸 ══━━✥❌✥━━══ 🌸\nÉchec \"%1\"\n%2: %3\n🌸 ══━━✥📜✥━━══ 🌸",
			missingUrlCodeOrFileName: "🌸 ══━━✥⚠️✥━━══ 🌸\nURL/code + nom requis\n🌸 ══━━✥📜✥━━══ 🌸",
			missingUrlOrCode: "🌸 ══━━✥⚠️✥━━══ 🌸\nURL ou code requis\n🌸 ══━━✥📜✥━━══ 🌸",
			missingFileNameInstall: "🌸 ══━━✥⚠️✥━━══ 🌸\nNom fichier (.js)\n🌸 ══━━✥📜✥━━══ 🌸",
			invalidUrl: "🌸 ══━━✥❌✥━━══ 🌸\nURL invalide\n🌸 ══━━✥📜✥━━══ 🌸",
			invalidUrlOrCode: "🌸 ══━━✥❌✥━━══ 🌸\nCode introuvable\n🌸 ══━━✥📜✥━━══ 🌸",
			alreadExist: "🌸 ══━━✥⚠️✥━━══ 🌸\nFichier déjà existant\nRéagis pour écraser\n🌸 ══━━✥📜✥━━══ 🌸",
			installed: "🌸 ══━━✥👑✥━━══ 🌸\nCommande \"%1\" installée\n📂 %2\n🌸 ══━━✥📜✥━━══ 🌸",
			installedError: "🌸 ══━━✥❌✥━━══ 🌸\nÉchec installation \"%1\"\n%2: %3\n🌸 ══━━✥📜✥━━══ 🌸",
			missingFile: "🌸 ══━━✥❌✥━━══ 🌸\nFichier \"%1\" introuvable\n🌸 ══━━✥📜✥━━══ 🌸",
			invalidFileName: "🌸 ══━━✥❌✥━━══ 🌸\nNom invalide\n🌸 ══━━✥📜✥━━══ 🌸",
			unloadedFile: "🌸 ══━━✥⚡✥━━══ 🌸\nCommande \"%1\" supprimée\n🌸 ══━━✥📜✥━━══ 🌸"
		}
	},

	// ================= MAIN =================
	onStart: async ({ args, message, getLang }) => {
		if (!args[0]) {
			return message.reply(
"🌸 ══━━✥👑✥━━══ 🌸\n📜 Commande CMD\n\n• load <nom>\n• unload <nom>\n• loadAll\n\n🌸 ══━━✥📜✥━━══ 🌸"
			);
		}
	}
};

// ================= FIX BUG =================
function unloadScripts(folder, fileName, configCommands, getLang) {
	const pathCommand = `${process.cwd()}/scripts/${folder}/${fileName}.js`;
	if (!fs.existsSync(pathCommand)) {
		const err = new Error(getLang("missingFile", `${fileName}.js`));
		err.name = "FileNotFound";
		throw err;
	}

	const command = require(pathCommand);
	const commandName = command.config?.name;

	const { GoatBot } = global;
	const { onEvent: allOnEvent } = GoatBot;

	// 🔥 FIX ICI (ancien bug comman)
	const indexOnEvent = allOnEvent.findIndex(item => item == commandName);
	if (indexOnEvent != -1)
		allOnEvent.splice(indexOnEvent, 1);

	return { status: "success", name: fileName };
}
