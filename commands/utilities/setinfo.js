const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { apiKEY } = require('../../config.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('displaysets')
        .setDescription('Displays all Pokémon TCG sets by series'),
    async execute(interaction) {
        const apiUrl = 'https://api.pokemontcg.io/v2/sets';
        const apiKey = apiKEY;
        const tab = '    ';

        try {
            const response = await fetch(apiUrl, {
				headers: {
					'X-Api-Key': apiKey
				}
			});
            const data = await response.json();
            const sets = data.data;

            
            const seriesMap = new Map();
            sets.forEach(set => {
                if (!seriesMap.has(set.series)) {
                    seriesMap.set(set.series, []);
                }
                seriesMap.get(set.series).push(set);
            });

            
            const embeds = [];
            for (const [series, seriesSets] of seriesMap) {
                let seriesLogo = '';
                for (const set of seriesSets) {
                    if (set.images.logo && !set.name.includes('Promo')) {
                        seriesLogo = set.images.logo;
                        break;
                    }
                }

                const embed = new EmbedBuilder()
                    .setTitle(series)
                    .setDescription(seriesSets.map(set => `${set.name} (${set.id}) ${tab} ${set.total} cards - ${set.releaseDate}`).join('\n'))
                    .setColor('#39e75f')
                    .setThumbnail(seriesLogo || 'https://images.pokemontcg.io/svp/logo.png'); 

                embeds.push(embed);
            }

            
            let currentPage = 0;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                );

            const updateMessage = async () => {
                await interaction.editReply({ embeds: [embeds[currentPage]], components: [row] });
            };

            
            await interaction.reply({ embeds: [embeds[currentPage]], components: [row] });

           
            const filter = i => i.customId === 'previous' || i.customId === 'next';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous') {
                    currentPage = currentPage > 0 ? currentPage - 1 : embeds.length - 1;
                } else if (i.customId === 'next') {
                    currentPage = currentPage < embeds.length - 1 ? currentPage + 1 : 0;
                }

                await i.deferUpdate();
                updateMessage();
            });

            collector.on('end', async () => {
                row.components.forEach(button => button.setDisabled(true));
                await interaction.editReply({ components: [row] });
            });
        } catch (error) {
            console.error('Error fetching sets:', error);
            await interaction.reply('Failed to retrieve the sets.');
        }
    },
};
