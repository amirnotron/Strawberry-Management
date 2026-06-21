const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
    }

    read() {
        try {
            const data = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading config:', error);
            return {};
        }
    }

    write(newData) {
        try {
            const currentData = this.read();
            const updatedData = { ...currentData, ...newData };
            fs.writeFileSync(this.configPath, JSON.stringify(updatedData, null, 4), 'utf8');
            return true;
        } catch (error) {
            console.error('Error writing config:', error);
            return false;
        }
    }
}

module.exports = new ConfigManager();