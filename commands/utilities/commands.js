const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Provides All Commands'),
	async execute(interaction) {
		await interaction.reply('**addCard** - add a pokemon card to your collection by providing the cardID\n**removeCard** - remove a pokemon card from your collection by providing the cardID\n**displayCollection** - show your collection - input price to sort your collection by market price from highest to lowest\n**search** - search pokemon cards by name, under subtype input the cards rarity like EX or Mega\n**searchid**- search a pokemon card by its id\n**displaysets** - provides information about pokemon sets ');
	},
};