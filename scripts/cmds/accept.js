const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    author: "Aphelion",
    countDown: 15,
    role: 0,
    shortDescription: "gestion des demandes",
    longDescription: "accepter ou refuser les demandes d’amis",
    category: "Utility",
  },

  onReply: async function ({ message, Reply, event, api, commandName }) {
    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return;

    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    clearTimeout(Reply.unsendTimeout);

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        refresh_num: 0
      }
    };

    const success = [];
    const failed = [];

    if (args[0] === "add") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
    }
    else if (args[0] === "del") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
      form.doc_id = "4108254489275063";
    }
    else {
      return api.sendMessage("❌ Choisis une action valide : add ou del + numéro / all", event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);

    if (args[1] === "all") {
      targetIDs = [];
      const lengthList = listRequest.length;
      for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
      const u = listRequest[parseInt(stt) - 1];
      if (!u) {
        failed.push(`❌ Impossible de trouver le numéro ${stt}`);
        continue;
      }

      form.variables.input.friend_requester_id = u.node.id;
      form.variables = JSON.stringify(form.variables);

      newTargetIDs.push(u);
      promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));

      form.variables = JSON.parse(form.variables);
    }

    for (let i = 0; i < newTargetIDs.length; i++) {
      try {
        const friendRequest = await promiseFriends[i];

        if (JSON.parse(friendRequest).errors) {
          failed.push(newTargetIDs[i].node.name);
        } else {
          success.push(newTargetIDs[i].node.name);
        }
      } catch (e) {
        failed.push(newTargetIDs[i].node.name);
      }
    }

    if (success.length > 0) {
      return api.sendMessage(
`࿇ ══━━✥🌸✥━━══ ࿇
👑 RÉSULTAT DE TRAITEMENT
࿇ ══━━✥🌸✥━━══ ࿇

✔ Succès (${success.length}) :
${success.join("\n")}

${failed.length > 0 ? `\n❌ Échecs (${failed.length}) :\n${failed.join("\n")}` : ""}

࿇ ══━━✥🌸✥━━══ ࿇`,
      event.threadID,
      event.messageID
      );
    }

    api.unsendMessage(messageID);
    return api.sendMessage(
`࿇ ══━━✥🌸✥━━══ ࿇
⚠️ Réponse invalide
Veuillez entrer une commande correcte
࿇ ══━━✥🌸✥━━══ ࿇`,
      event.threadID
    );
  },

  onStart: async function ({ event, api, commandName }) {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };

    const listRequest = JSON.parse(
      await api.httpPost("https://www.facebook.com/api/graphql/", form)
    ).data.viewer.friending_possibilities.edges;

    let msg = "";

    let i = 0;
    for (const user of listRequest) {
      i++;
      msg += `\n${i}. Nom : ${user.node.name}`
        + `\nID : ${user.node.id}`
        + `\nLien : ${user.node.url.replace("www.facebook", "fb")}`
        + `\nDate : ${moment(user.time * 1009).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`;
    }

    api.sendMessage(
`࿇ ══━━✥🌸✥━━══ ࿇
📩 LISTE DES DEMANDES
࿇ ══━━✥🌸✥━━══ ࿇
${msg}

Réponds avec : add / del + numéro ou all
࿇ ══━━✥🌸✥━━══ ࿇`,
      event.threadID,
      (e, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          listRequest,
          author: event.senderID,
          unsendTimeout: setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, this.config.countDown * 1000)
        });
      },
      event.messageID
    );
  }
};
