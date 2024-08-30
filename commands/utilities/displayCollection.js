const { SlashCommandBuilder } = require('discord.js');
const Cards = require('../../models/cardData');
const { apiKEY } = require('../../config.json');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('displaycollection')
		.setDescription('show your collection')
		.addStringOption(option => 
			option.setName('display')
				.setDescription('Put "price" to display by price or leave blank to display order added')
				.setRequired(false)),
                async execute(interaction) {
                    const collectionDisplay = interaction.options.getString('display');
                    const apiKey = apiKEY;
                    const userId = interaction.user.id;
                    let cardOrder = [];

                  

                    if (collectionDisplay === 'price') {
                        order = [['cardPrice', 'DESC']];
                    }else {
                        order = [['createdAt', 'ASC']]; 
                    }

                    const userCards = await Cards.findAll({
                        where: { userId: userId },
                        order: order,
                    });

                   

                    if (userCards.length === 0) {
                        return interaction.reply('You have no cards in your collection.');
                    }

                    let totalPrice = userCards.reduce((sum, card) => sum + card.cardPrice, 0);


                    let collectionDisplayString = userCards.map(card => 
                        `**${card.cardName}** (${card.cardId}) - ${card.cardRarity} - $${card.cardPrice}`
                    ).join('\n');

                    collectionDisplayString = "Total Price of Collection: $" + totalPrice + "\n" + collectionDisplayString;
            
                    return interaction.reply(collectionDisplayString);
                
                    
            
                
                },
            };