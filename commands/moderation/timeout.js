const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('تایم‌اوت کردن یک کاربر (سکوت)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('target').setDescription('کاربری که می‌خواهید تایم‌اوت کنید').setRequired(true))
        .addIntegerOption(option => option.setName('minutes').setDescription('مدت زمان به دقیقه').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('دلیل تایم‌اوت').setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'دلیلی ذکر نشده است';

        if (!target) return interaction.reply({ content: 'کاربر مورد نظر پیدا نشد.', ephemeral: true });

        // تبدیل دقیقه به میلی‌ثانیه برای دیسکورد
        await target.timeout(minutes * 60 * 1000, reason);

        const embed = new EmbedBuilder()
            .setColor('#971616')
            .setTitle('⏲️ کاربر تایم‌اوت شد')
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: 'کاربر:', value: `${target.user.tag}`, inline: true },
                { name: 'زمان:', value: `${minutes} دقیقه`, inline: true },
                { name: 'دلیل:', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};