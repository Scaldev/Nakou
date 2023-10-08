const { REST, Routes, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();

function deploy(client) {

    // 1. Find all slash commands files.

    let commands = [];
    client.commands = new Collection()
    const foldersPath = path.join(__dirname, 'src/interactions/commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {

        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON())
                client.commands.set(command.data.name, command);
            }
        }
    }
    // 2. Update them on Discord.

    const rest = new REST().setToken(process.env.TOKEN);

    (async () => {

        try {
            console.log(`Started refreshing ${client.commands.length} application (/) commands.`);
            const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        } catch (error) {
            console.error(error);
        }

    })();

};

module.exports = { deploy }