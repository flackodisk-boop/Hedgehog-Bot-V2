module.exports = {

  onlyadminbox: {
    description: "turn on/off only admin box can use bot",
    guide: "   {pn} [on | off]",
    text: {
      turnedOn: `Turned on the mode only admin of group can use bot`,
      turnedOff: `Turned off the mode only admin of group can use bot`,
      syntaxError: `Syntax error, only use {pn} on or {pn} off`
    }
  },

  adminonly: {
    description: "turn on/off only admin can use bot",
    guide: "{pn} [on | off]",
    text: {
      turnedOn: `Turned on the mode only admin can use bot`,
      turnedOff: `Turned off the mode only admin can use bot`,
      syntaxError: `Syntax error, only use {pn} on or {pn} off`
    }
  },

  admin: {
    description: "Add, remove, edit admin role",
    guide: "{pn} add <uid> | remove <uid> | list",
    text: {
      added: `✅ Added admin role for %1 users:\n%2`,
      alreadyAdmin: `⚠️ Already admin:\n%1`,
      missingIdAdd: `⚠️ Enter ID`,
      removed: `✅ Removed admin role:\n%1`,
      notAdmin: `⚠️ Not admin:\n%1`,
      missingIdRemove: `⚠️ Enter ID`,
      listAdmin: `👑 List of admins:\n%1`
    }
  },

  handlerEvents: {
    commandNotFound: `🌸 ══━━✥❌✥━━══ 🌸
📜 ERREUR ROYALE
Commande inconnue
Tape /help
🌸 ══━━✥📜✥━━══ 🌸`,

    commandNotFound2: `🌸 ══━━✥⚠️✥━━══ 🌸
📜 COMMANDE INTROUVABLE
Utilise /help
🌸 ══━━✥📜✥━━══ 🌸`
  },

  help: {
    description: "View command usage",
    guide: "{pn} help",
    text: {
      help: `🌸 ══━━✥📜✥━━══ 🌸
👑 NOTRE MENU ROYAL 👑

%1

Page %2/%3
Commandes: %4

🌸 ══━━✥📜✥━━══ 🌸`,

      commandNotFound: `🌸 ══━━✥❌✥━━══ 🌸
Commande inexistante
🌸 ══━━✥📜✥━━══ 🌸`
    }
  },

  badwords: {
    description: "anti bad words system",
    guide: "{pn} add | delete | list",
    text: {
      warned: `⚠️ Mot interdit détecté: %1`,
      warned2: `⚠️ Deuxième avertissement: %1`,
      onlyAdmin: `⚠️ Admin only`
    }
  },

  customrankcard: {
    description: "Design rank card",
    guide: "{pn} set",
    text: {
      success: `Your changes have been saved`,
      reseted: `Reset done`,
      invalidColor: `Invalid color`
    }
  }

};
