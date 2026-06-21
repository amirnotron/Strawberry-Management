const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const config = configManager.read();

        // باز کردن تیکت
        if (interaction.customId === 'open_ticket') {
            const categoryId = config.ticketCategoryId;
            const adminRoleId = config.ticketAdminRoleId;

            if (!categoryId || !adminRoleId) {
                return interaction.reply({ content: 'سیستم تیکت هنوز ستاپ نشده است!', ephemeral: true });
            }

            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: adminRoleId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle('تیکت شما ساخته شد!')
                .setDescription(`سلام ${interaction.user}، لطفا منتظر بمانید تا تیم مدیریتی پاسخ دهد.\n<@&${adminRoleId}>`)
                .setColor('#971616');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('بستن تیکت 🔒')
                        .setStyle(ButtonStyle.Danger),
                );

            await ticketChannel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `تیکت شما باز شد: ${ticketChannel}`, ephemeral: true });
        }

        // بستن تیکت
        if (interaction.customId === 'close_ticket') {
            await interaction.reply('این تیکت تا 5 ثانیه دیگر بسته می‌شود...');
            setTimeout(() => {
                interaction.channel.delete();
            }, 5000);
        }
    },
};