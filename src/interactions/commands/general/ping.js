const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

	async execute(interaction) {
		let ping = interaction.createdAt - new Date();
		return interaction.reply({ content: `🏓 - **Pong !** Ta latence est de **${ping}** ms, et la mienne est de **${Math.round(interaction.client.ws.ping)}** ms.` });
	},

	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Renvoie ta latence, ainsi que celle de l'API.")
};