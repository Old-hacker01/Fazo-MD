module.exports = async (sock, m) => {
    if (m.type === 'notify' && m.messages[0].key.remoteJid === 'status@broadcast') {
        const status = m.messages[0];
        await sock.readMessages([status.key]);
        console.log('Viewed status update');
    }
};
