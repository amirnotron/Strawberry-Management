const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                const errorMessage = { content: 'هنگام اجرای این کامند خطایی رخ داد!', ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
            return;
        }

        if (!interaction.isButton()) return;

        const config = configManager.read();

        if (interaction.customId === 'open_ticket') {
            await interaction.deferReply({ ephemeral: true });

            const categoryId = config.ticketCategoryId;
            const adminRoleId = config.ticketAdminRoleId;

            if (!categoryId || !adminRoleId) {
                return interaction.editReply({ content: 'سیستم تیکت هنوز ستاپ نشده است!' });
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
                .setDescription(`سلام لطفا منتظر بمانید تا تیم مدیریتی پاسخ دهد.\nبرای بستن این تیکت، روی دکمه زیر کلیک کنید.`)
                .setColor('#971616');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('بستن تیکت 🔒')
                        .setStyle(ButtonStyle.Danger),
                );

            await ticketChannel.send({
                content: `<@&${adminRoleId}>\n${interaction.user}`,
                embeds: [embed],
                components: [row],
            });
            await interaction.editReply({ content: `✅ تیکت شما ساخته شد: ${ticketChannel}` });
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply('این تیکت تا 5 ثانیه دیگر بسته می‌شود...');
            setTimeout(() => {
                interaction.channel.delete();
            }, 5000);
        }
    },
};