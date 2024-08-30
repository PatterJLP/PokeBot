const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { apiKEY } = require('../../config.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('searchid')
		.setDescription('search for a pokemon card by id')
		.addStringOption(option => 
			option.setName('cardid')
				.setDescription('The ID of the Pokémon card, given in format')
				.setRequired(true)),
	async execute(interaction) {
		const cardId = interaction.options.getString('cardid');
		const apiKey = apiKEY;
		const apiUrl = `https://api.pokemontcg.io/v2/cards/${cardId}`;
	
		

		try {
			const response = await fetch(apiUrl, {
				headers: {
					'X-Api-Key': apiKey
				}
			});
			
			if (!response.ok) {
				throw new Error('Network response error');
			}

			const data = await response.json();
			const card = data.data;
			const cardImageUrl = card.images.large; 
			const marketPrice = card.tcgplayer.prices.normal?.market || card.tcgplayer.prices.holofoil?.market || card.tcgplayer.prices.reverseHolofoil?.market || card.tcgplayer.prices['1stEditionHolofoil']?.market || card.tcgplayer.prices['1stEditionNormal']?.market;
			const cardName = card.name;
			const cardSet = card.set.name + " ";
			const cardSetImage = card.set.images.symbol;

			
			const embed1 = new EmbedBuilder()
			.setTitle(cardName)
			.setDescription('Market Price: ' + marketPrice + ' USD')
			.setImage(cardImageUrl)
			.setColor('#39e75f')
			.setFooter({ text: cardSet + card.number + '/' + card.set.total, iconURL: cardSetImage });
			await interaction.reply({ embeds: [embed1] });
		} catch (error) {
			console.error('Error fetching card:', error);
			await interaction.reply('Failed to find the Pokémon card. Make sure to follow the search format of (generation)(set number)-(card number). Use /commands for more info.');
		}
	},
};