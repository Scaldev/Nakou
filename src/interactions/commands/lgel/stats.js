const { queryData } = require("../../../utility/mysql.js");
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {

    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();
        const statsEmbed = new EmbedBuilder();
        let query, value, rows;

        switch (subcommand) {

            case 'joueur':

                query = `SELECT * FROM Joueurs WHERE pseudo = ?`;
                value = interaction.options.getString('pseudo');
                rows = await queryData(query, [value]);

                if (rows.length == 0) {
                    statsEmbed.setDescription(`Le pseudo **${value}** n'est pas dans la base de données, mais tu peux l'ajouter avec la commande \`/add\`.`)
                } else {
                    statsEmbed.setDescription(`**${rows[0].pseudo}** appartient au hameau **[${rows[0].hameau}]**.`);
                }

                break;

            case 'hameau':

                query = `SELECT * FROM Hameaux WHERE tag = ?`;
                value = interaction.options.getString('tag');
                rows = await queryData(query, [value]);

                if (rows.length == 0) {
                    statsEmbed.setDescription(`Le hameau **${value}** n'est pas dans la base de données, mais tu peux l'ajouter avec la commande \`/add\`.`)
                } else {
                    let membres = await queryData(`SELECT * FROM Joueurs WHERE hameau = "${rows[0].tag}";`);
                    console.log(membres);
                    membres = membres.map(membre => membre = membre.pseudo);
                    console.log(membres);
                    statsEmbed.setDescription(`Le hameau **[${rows[0].tag}]** possède les membres suivants :\n${membres.join(', ')}`);
                }

                break;

        }


        return interaction.reply({ content: "Les données ont été logées.", embeds: [statsEmbed] });

    },

    data: new SlashCommandBuilder()

        .setName('stats')
        .setDescription("Renvoie les statistiques du hameau.")

        .addSubcommand(subcommand => subcommand.setName('joueur').setDescription("Statistiques d'un joueur.")
            .addStringOption(option => option.setName('pseudo').setDescription('Le pseudo du joueur (format "Abcd3").').setMinLength(2).setMaxLength(10)))

        .addSubcommand(subcommand => subcommand.setName('hameau').setDescription("Statistiques d'un hameau.")
            .addStringOption(option => option.setName('tag').setDescription('Le tag du hameau (format "ABCDE").').setMinLength(2).setMaxLength(5)))

        .addSubcommand(subcommand => subcommand.setName('date').setDescription("Statistiques d'une journée.")
            .addStringOption(option => option.setName('jour').setDescription('La date en question (format "MM/DD/AAAA")').setMinLength(10).setMaxLength(10)))

};