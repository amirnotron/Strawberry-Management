const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const configManager = require('../../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('راه‌اندازی سیستم تیکت')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('category')
                .setDescription('کتگوری که تیکت‌ها در آن ساخته شوند')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('admin_role')
                .setDescription('نقشی که به تیکت‌ها دسترسی داشته باشد')
                .setRequired(true)),
                
    async execute(interaction) {
        const category = interaction.options.getChannel('category');
        const adminRole = interaction.options.getRole('admin_role');

        // ذخیره در config.json
        configManager.write({
            ticketCategoryId: category.id,
            ticketAdminRoleId: adminRole.id
        });

        const embed = new EmbedBuilder()
            .setTitle('پشتیبانی سرور Strawberry')
            .setDescription('برای باز کردن تیکت روی دکمه زیر کلیک کنید.')
            .setColor('#971616');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('باز کردن تیکت 🎫')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({ content: 'سیستم تیکت با موفقیت ثبت شد!', ephemeral: true });
        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};