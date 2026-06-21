const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('بن کردن یک کاربر از سرور')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName('target').setDescription('کاربری که می‌خواهید بن کنید').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('دلیل بن').setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'دلیلی ذکر نشده است';

        if (!target) return interaction.reply({ content: 'کاربر مورد نظر پیدا نشد.', ephemeral: true });

        await target.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor('#971616')
            .setTitle('🚫 کاربر بن شد')
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: 'کاربر:', value: `${target.user.tag}`, inline: true },
                { name: 'دلیل:', value: reason, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};