const config = require('../config');

module.exports = async (sock, m) => {
    if (!m.messages) return;
    const msg = m.messages[0];
    
    if (!msg.message) return;
    
    const text = msg.message.conversation || 
                msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.remoteJid;
    
    // Auto-reply
    if (text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
        await sock.sendMessage(sender, { text: 'Hello there! How can I help you?' });
    }
    
    // Add more auto-reply logic here
};
