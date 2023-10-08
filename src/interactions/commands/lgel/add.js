const { queryData, tableCheck } = require("../../../utility/mysql.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();
        const map = {
            joueur: { query: `INSERT INTO Joueurs VALUES(?, ?)`, table: 'Joueurs', options: ['pseudo', 'hameau'] },
            hameau: { query: `INSERT INTO Hameaux VALUES(?)`, table: 'Hameaux', options: ['tag'] },
        }
        const data = map[subcommand];

        let placeholders = Array(data.options.length).fill('?').join(", ");
        let query = `INSERT INTO ${data.table} VALUES(${placeholders})`;
        let inputs = data.options.map(e => e = interaction.options.getString(e));

        let isInTable = await tableCheck(data.table, data.options[0], inputs[0]);
        if (isInTable) {
            return interaction.reply({ content: `Erreur: ce ${subcommand} existe déjà dans la base de données.` });
        } else {

            const rows = await queryData(query, inputs);
            console.log(rows);

            return interaction.reply({ content: "Les données ont été logées." });
        }

    },

    data: new SlashCommandBuilder()

        .setName('add')
        .setDescription("Ajoute un joueur ou un hameau à la base de données.")

        .addSubcommand(subcommand => subcommand.setName('joueur').setDescription("Statistiques d'un joueur.")
            .addStringOption(option => option.setName('pseudo').setDescription('Le pseudo du joueur (format "Abcd3").').setMinLength(2).setMaxLength(10))
            .addStringOption(option => option.setName('hameau').setDescription("Le tag du hameau auquel le joueur appartient, s'il en a un (format \"ABCDE\").").setMinLength(2).setMaxLength(5)))

        .addSubcommand(subcommand => subcommand.setName('hameau').setDescription("Statistiques d'un hameau.")
            .addStringOption(option => option.setName('tag').setDescription('Le tag du hameau (format "ABCDE").').setMinLength(2).setMaxLength(5)))

};