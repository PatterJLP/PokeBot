const { SlashCommandBuilder } = require('discord.js');
const Cards = require('../../models/cardData');
const { apiKEY } = require('../../config.json');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcard')
		.setDescription('add a pokemon card to your collection')
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
                    const data = await response.json();
                    const cardToAdd = data.data;
                    const cardName = cardToAdd.name;
                    const cardSet = cardToAdd.set.id;
                    const cardRarity = cardToAdd.rarity;
                    const cardImage = cardToAdd.images.large; 
                    const cardPrice = cardToAdd.tcgplayer.prices.normal?.market || cardToAdd.tcgplayer.prices.holofoil?.market || cardToAdd.tcgplayer.prices.reverseHolofoil?.market || cardToAdd.tcgplayer.prices['1stEditionHolofoil']?.market || cardToAdd.tcgplayer.prices['1stEditionNormal']?.market;

                    try {
                        const card = await Cards.create({
                            userId: interaction.user.id,
                            cardId: cardId,
                            cardName: cardName,
                            cardSet: cardSet,
                            cardRarity: cardRarity,
                            cardImage: cardImage,
                            cardPrice: cardPrice,
                        });
            
                        return interaction.reply(`Card ${cardName} (${cardId}) added to your collection.`);
                    }
                    catch (error) {
                        console.error(error);
                        if (interaction.replied || interaction.deferred) {
                            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                        }

                    }
                
                    
            
                
                },
            };