const { token } = require('./config.json');

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
    console.log("Strawberry Management is online!");
});

client.login(token);