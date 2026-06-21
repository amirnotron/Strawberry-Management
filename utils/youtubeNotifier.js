const Parser = require('rss-parser');
const configManager = require('./configManager');
const parser = new Parser();

class YouTubeNotifier {
    constructor(client) {
        this.client = client;
        this.youtubeChannelId = 'آیدی_کانال_یوتیوب_شما'; // مثل: UCxxxxxxxxxxxx
    }

    async checkNewVideo() {
        try {
            const config = configManager.read();
            if (!config.youtubeDiscordChannelId) return;

            const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${this.youtubeChannelId}`);
            const latestVideo = feed.items[0];

            if (!latestVideo) return;

            if (config.lastVideoId !== latestVideo.id) {
                // آپدیت کانفیگ با ویدیوی جدید
                configManager.write({ lastVideoId: latestVideo.id });

                const channel = this.client.channels.cache.get(config.youtubeDiscordChannelId);
                if (channel) {
                    channel.send(`@everyone 🔥 ویدیوی جدید آپلود شد!\n**${latestVideo.title}**\n${latestVideo.link}`);
                }
            }
        } catch (error) {
            console.error('Error checking YouTube:', error);
        }
    }

    start() {
        // هر 15 دقیقه چک می‌کند
        setInterval(() => this.checkNewVideo(), 15 * 60 * 1000);
    }
}

module.exports = YouTubeNotifier;