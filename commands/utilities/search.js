const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { apiKEY } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('search for a pokemon card')
		.addStringOption(option => 
			option.setName('pokemon')
				.setDescription('The name of the Pokemon Card')
				.setRequired(true))
        .addStringOption(option => 
            option.setName('subtype')
                .setDescription('The subtype of the card, e.g. EX, Mega, V')
                .setRequired(false)),
	async execute(interaction) {
		let pokemon = interaction.options.getString('pokemon');
        pokemon = pokemon.replace(/\s+/g, '-');
        let subtype = interaction.options.getString('subtype');
		const apiKey = apiKEY;
		const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${pokemon}&subtypes:${subtype}&orderBy=-set.releaseDate`;
		
		try {
            await interaction.deferReply();

			const response = await fetch(apiUrl, {
				headers: {
					'X-Api-Key': apiKey
				}
			});


            const data = await response.json();

            const cards = data.data;
            let currentIndex = 0;
            const totalCards = cards.length;

            const card = cards[currentIndex];

            const createEmbed = (card) => {
                const cardImageUrl = card.images.large;
                const marketPrice = card.tcgplayer.prices.normal?.market || card.tcgplayer.prices.holofoil?.market || card.tcgplayer.prices.reverseHolofoil?.market || card.tcgplayer.prices['1stEditionHolofoil']?.market || card.tcgplayer.prices['1stEditionNormal']?.market;
                const cardName = card.name;
                const cardSet = card.set.name;
                const cardSetImage = card.set.images.symbol;

                return new EmbedBuilder()
                    .setTitle(cardName + " (" + card.id+")")
                    .setDescription(`Market Price: ${marketPrice} USD`)
                    .setImage(cardImageUrl)
                    .setColor('#39e75f')
                    .setFooter({ text: `${cardSet} ${card.number}/${card.set.total} | Card ${currentIndex + 1} of ${totalCards}`, iconURL: cardSetImage });
            };



            const embed = createEmbed(cards[currentIndex]);
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(cards.length === 1)
                );

            const message = await interaction.editReply({ embeds: [embed], components: [row], fetchReply: true });

            
            const filter = (i) => ['prev', 'next'].includes(i.customId) && i.user.id === interaction.user.id;
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'prev') {
                    currentIndex--;
                } else if (i.customId === 'next') {
                    currentIndex++;
                }

               
                const newEmbed = createEmbed(cards[currentIndex]);

               
                row.components[0].setDisabled(currentIndex === 0);
                row.components[1].setDisabled(currentIndex === cards.length - 1);

                await i.update({ embeds: [newEmbed], components: [row] });
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true));
                message.edit({ components: [row] });
            });
        } catch (error) {
            console.error('Error fetching cards:', error);
            await interaction.editReply('Failed to perform the search. Please try again later.');
        }
    },
};