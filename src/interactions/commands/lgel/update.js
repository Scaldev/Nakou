const { SlashCommandBuilder } = require('@discordjs/builders');
const { getStatsData } = require("../../../intervals/getStatsData.js");

module.exports = {

	async execute(interaction) {

        let pseudo = interaction.options.getString('pseudo');
        console.log(pseudo);
		await interaction.deferReply({ content: `Chargement des nouvelles données...` });
		await getStatsData(pseudo);
		await interaction.editReply({ content: `C'est bon ! Tout à été mis à jour.` });

	},

	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription("Met à jour toutes les données.")
        .addStringOption(option => option.setName('pseudo').setDescription('Le pseudo utilisé.'))
};