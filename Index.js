require('dotenv').config();
const { Boom } = require('@hapi/boom');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Import handlers
const statusHandler = require('./handlers/statusHandler');
const messageHandler = require('./handlers/messageHandler');
const groupHandler = require('./handlers/groupHandler');
const downloadHandler = require('./handlers/downloadHandler');
const adminHandler = require('./handlers/adminHandler');

// Load config
const config = require('./config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: { level: 'silent' }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            startBot(); // Reconnect on close
        } else if (connection === 'open') {
            console.log('Bot is connected!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Status handler
    sock.ev.on('messages.upsert', async (m) => {
        await statusHandler(sock, m);
    });

    // Message handler
    sock.ev.on('messages.upsert', async (m) => {
        await messageHandler(sock, m);
    });

    // Group handler
    sock.ev.on('group-participants.update', async (update) => {
        await groupHandler(sock, update);
    });

    // Admin commands
    sock.ev.on('messages.upsert', async (m) => {
        await adminHandler(sock, m);
    });
}

startBot().catch(err => console.log('Error starting bot:', err));
