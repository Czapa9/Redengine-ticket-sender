require('colors');
const Discord = require('discord.js-selfbot-v13');
const db = require('pro.db');

const client = new Discord.Client(
    {
        checkUpdate: false
    }
);

client.on('ready', async () => {
    console.log(`[INFO]:`.green, `${client.user.username} is ready`.cyan);
});

client.on('message', async (message) => {
    if (message.content === "ping") {
        message.channel.send("pong");
    }
});

let guildId = ''; // server id
let roleId = '' // role id
let groupChatID = ''; // groupchat id
let accountToken = '' // you account token here

client.on('threadCreate', async (thread) => {
    if (thread.guildId == guildId) {
        console.log(`[INFO]:`.green, `New Ticket ${thread.name}`.cyan);
        let firstDate = new Date().getTime();
        let channel = client.channels.cache.get(groupChatID);
        let tags = thread.appliedTags.map(s => thread.parent.availableTags.find(t => t.id === s)).map(x => x.name).filter(x => ['general', 'hwid', 'Other'].includes(x));
        let tempMsg;
        channel.send({ content: `New Ticket Creater , https://discord.com/channels/${guildId}/${thread.id}\n> Tags: \`${tags.join(" , ")}\`` }).then(async (msg) => {
            await msg.react('🤡');
            const collector = thread.createMessageCollector({ time: 10000 * 120 });
            collector.on('collect', async m => {
                let finalDate = new Date().getTime();
                let member = client.guilds.cache.get(guildId).members.cache.get(m.author.id);
                if (member.roles.cache.some(role => role.id == roleId) && !m.content.startsWith('.')) {
                    if (db.has(`staff_${m.author.id}`)) {
                        db.add(`staff_${m.author.id}`, 1)
                    }
                    db.add(`staff_${m.author.id}`, 1);
                    msg.edit({ content: msg.content + `\n> Zajebany Przez: ${m.author} (\`${(finalDate - firstDate) < 10000 ? `⛔ Ctrl + c Detected ! ⛔ ` : "" + ((finalDate - firstDate) / 1000).toFixed(2)} sec\`) , Ilość Zrobionych Ticketów: (${db.get(`staff_${m.author.id}`)} Ticket)\n=================================================` });
                    collector.stop();
                }
            });
        });
    }
});
client.login(accountToken);




