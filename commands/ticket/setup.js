const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const configManager = require('../../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('راه‌اندازی کامل سیستم تیکت')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        // گزینه اول: انتخاب کتگوری برای ساخته شدن تیکت‌ها در آن
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('کتگوری (پوشه) که تیکت‌های جدید زیرمجموعه آن ساخته شوند')
                .addChannelTypes(ChannelType.GuildCategory) // کاربر فقط می‌تونه کتگوری انتخاب کنه
                .setRequired(true))
        // گزینه دوم: انتخاب کانالی که پنل تیکت در آن ارسال می‌شود
        .addChannelOption(option =>
            option.setName('panel_channel')
                .setDescription('کانال متنی که دکمه باز کردن تیکت در آن قرار می‌گیرد')
                .addChannelTypes(ChannelType.GuildText) // کاربر فقط می‌تونه کانال متنی انتخاب کنه
                .setRequired(true))
        // گزینه سوم: نقش ادمین
        .addRoleOption(option =>
            option.setName('admin_role')
                .setDescription('نقشی که به تیکت‌ها دسترسی داشته باشد')
                .setRequired(true)),

    async execute(interaction) {
        // اضافه کردن این خط برای جلوگیری از ارور تایم‌اوت
        await interaction.deferReply({ ephemeral: true });

        const category = interaction.options.getChannel('category');
        const panelChannel = interaction.options.getChannel('panel_channel');
        const adminRole = interaction.options.getRole('admin_role');

        // ذخیره آیدی کتگوری و نقش در config.json
        configManager.write({
            ticketCategoryId: category.id,
            ticketAdminRoleId: adminRole.id
        });

        const embed = new EmbedBuilder()
            .setTitle('پشتیبانی سرور Strawberry')
            .setDescription('برای ارتباط با تیم مدیریت و باز کردن تیکت، روی دکمه زیر کلیک کنید.')
            .setColor('#971616');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('باز کردن تیکت 🎫')
                    .setStyle(ButtonStyle.Primary),
            );

        await panelChannel.send({ embeds: [embed], components: [row] });

        // تغییر از reply به editReply چون از defer استفاده کردیم
        await interaction.editReply({
            content: `✅ سیستم تیکت با موفقیت ستاپ شد!`,
        });
    },
};