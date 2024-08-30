const { SlashCommandBuilder } = require('discord.js');
const Cards = require('../../models/cardData');
const { apiKEY } = require('../../config.json');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('removecard')
		.setDescription('remove a pokemon card from your collection')
		.addStringOption(option => 
			option.setName('cardid')
				.setDescription('The ID of the Pokémon card, given in format')
				.setRequired(true)),
                async execute(interaction) {
                    const cardId = interaction.options.getString('cardid');
                    const apiKey = apiKEY;
                    const apiUrl = `https://api.pokemontcg.io/v2/cards/${cardId}`;
                    const response = await fetch(apiUrl, {
                        headers: {
                            'X-Api-Key': apiKey
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Network response error');
                    }
                    const userId =  interaction.user.id;

                    try {
                        const card = await Cards.findOne({ where: { userId: userId, cardId: cardId } });
            
                        if (!card) {
                            return interaction.reply('You do not have this card in your collection.');
                        }
            
                        await card.destroy();
            
                        return interaction.reply(`Card ${card.cardName} (${card.cardId}) has been removed from your collection.`);
                    } catch (error) {
                        console.error(error);
                        return interaction.reply('Something went wrong while trying to remove the card from your collection.');
                    }
                },
            };