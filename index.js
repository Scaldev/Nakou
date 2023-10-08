const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

/*
const { getStatsData } = require("./src/intervals/getStatsData.js");
getStatsData();
*/

require('dotenv').config({ path: __dirname + '/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const { deploy } = require('./deploy-commands.js'); // RELOAD SLASH COMMANDS.
deploy(client);

const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);