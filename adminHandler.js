const config = require('../config');

module.exports = async (sock, m) => {
    if (!m.messages) return;
    const msg = m.messages[0];
    
    if (!msg.message) return;
    
    const text = msg.message.conversation || 
                msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.remoteJid;
    
    // Check if sender is admin
    const isAdmin = config.admins.includes(sender.split('@')[0]);
    if (!isAdmin) return;
    
    // Admin commands
    if (text.startsWith('!ban ')) {
        const userToBan = text.split(' ')[1] + '@s.whatsapp.net';
        await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToBan], 'remove');
        await sock.sendMessage(sender, { text: `User ${userToBan} has been banned.` });
    }
    
    // Add more admin commands here
};
