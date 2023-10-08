const { SlashCommandBuilder } = require('@discordjs/builders');

const { startLoop } = require("../../../utility/blitz.js");
const { login } = require("../../../utility/log.js");

module.exports = {
	async execute(interaction) {

		await interaction.deferReply();
		await interaction.editReply({ content: `Chargement, merci de patienter...` });

		let canStart = await login("376394813693624320", "Scald", ""); // EN 3EME PARA YA MON MDP, AVANT JE PRENAIS LES PARAS DE LA SLASH CMD MAIS JCROIS IL Y AVAIT UN PROBLEME BREF
		if (canStart) {
			await interaction.editReply({ content: `Tu es connecté(e) ! Allons en Blitz...` });
			await startLoop(interaction);
		}
	},

	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription("Commence ou arrête de jouer en Blitz.")
};