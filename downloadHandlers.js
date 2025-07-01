const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

module.exports = async (sock, m) => {
    const msg = m.messages[0];
    if (!msg.message) return;
    
    // Handle audio
    if (msg.message.audioMessage) {
        const buffer = await sock.downloadMediaMessage(msg);
        const filename = `audio_${Date.now()}.ogg`;
        await writeFileAsync(path.join(__dirname, '../assets/downloads', filename), buffer);
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `Audio downloaded! Filename: ${filename}` 
        });
    }
    
    // Handle video
    if (msg.message.videoMessage) {
        const buffer = await sock.downloadMediaMessage(msg);
        const filename = `video_${Date.now()}.mp4`;
        await writeFileAsync(path.join(__dirname, '../assets/downloads', filename), buffer);
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `Video downloaded! Filename: ${filename}` 
        });
    }
};
