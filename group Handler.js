const config = require('../config');

module.exports = async (sock, update) => {
    if (update.action === 'add' && update.participants && update.participants[0]) {
        const groupId = update.id;
        const newMember = update.participants[0];
        
        // Send welcome message
        const welcomeMsg = `Welcome @${newMember.split('@')[0]} to the group! 🎉\n\n` +
                          `Please read the group rules and enjoy your stay.`;
        
        await sock.sendMessage(groupId, { 
            text: welcomeMsg,
            mentions: [newMember]
        });
        
        // You can also send a welcome image
        // const welcomeImg = fs.readFileSync('./assets/welcome_images/welcome.jpg');
        // await sock.sendMessage(groupId, { image: welcomeImg, caption: welcomeMsg });
    }
};
