const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const config = configManager.read();
        // چک کردن وجود آیدی کانال در فایل کانفیگ
        if (!config.welcomeChannelId) return;

        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (!channel) return;

        // لود کردن عکس کاستوم با تم توت‌فرنگی به صورت لوکال
        const file = new AttachmentBuilder('./assets/welcome.png');

        const embed = new EmbedBuilder()
            .setTitle('🔥 یک عضو جدید وارد شد!')
            // متن عمومی شد و نام ماینکرفت حذف گردید
            .setDescription(`سلام ${member}! به کامیونیتی ما خیلی خوش اومدی.\nلطفاً برای آشنایی بیشتر، قوانین سرور رو مطالعه کن و از محتوای کانال لذت ببر.`)
            .setColor('#971616') // کد رنگ اختصاصی شما
            .setImage('attachment://welcome.png')
            .setFooter({ text: 'Strawberry Community', iconURL: member.guild.iconURL() })
            .setTimestamp();

        await channel.send({ content: `خوش اومدی ${member}`, embeds: [embed], files: [file] });
    },
};