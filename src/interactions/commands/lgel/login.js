const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');

const { login } = require("../../../utility/log.js");

module.exports = {

	async execute(interaction) {

		let userId = interaction.user.id;
		let username = interaction.options.getString('username');
		let password = interaction.options.getString('password');

		await interaction.deferReply();
		await interaction.editReply({ content: `Connexion en cours, merci de patienter...` });
		
		await login(userId, username, password);

		const attachment = new AttachmentBuilder('login.jpg');

		return interaction.editReply({ content: `Connexion réussie ! Utilise \`logoff\` pour fermer la connexion. Par mesure de précaution, la connexion sera automatiquement fermée 15 minutes sans nouvelle instruction.`, files: [attachment] });
	},

	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription("Te connecte sur LGeL.")
		.addStringOption(option => option.setName('username').setDescription('Ton pseudo.').setMinLength(2).setMaxLength(10).setRequired(true))
		.addStringOption(option => option.setName('password').setDescription("Ton mot de passe (qui ne sera jamais sauvegardé).").setMinLength(1).setMaxLength(64).setRequired(true))

};