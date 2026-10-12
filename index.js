const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const app = express();

const PORT = process.env.PORT || 3000;

// Render Web Endpoint to confirm active uptime status
app.get('/', (req, res) => {
  res.send('Bohol Cloud Engine: 100% Operational');
});

app.listen(PORT, () => {
  console.log(`Web proxy handler successfully listening on port ${PORT}`);
});

// Self-ping framework loop to completely prevent Render from freezing the process
setInterval(() => {
  if (process.env.RENDER_EXTERNAL_URL) {
    http.get(process.env.RENDER_EXTERNAL_URL, (res) => {
      console.log('Self-ping executed successfully to maintain background socket stream.');
    });
  }
}, 60000); // Pings every 60 seconds

// Main Minecraft Bot Engine
const bot = mineflayer.createBot({
  host: 'play.boholmc.net',
  username: 'YTXMANKU',
  version: '1.21.1',
  auth: 'offline',
  viewDistance: 'tiny', // Drastically lowers RAM load on Render
  checkTimeoutInterval: 60 * 1000 // Prevents sudden network timed-out drops
});

bot.on('spawn', () => {
  console.log('SUCCESS: Character YTXMANKU logged into Bohol Network lobby!');
  
  // Wait 3 seconds, then execute AuthMe password sequence
  setTimeout(() => {
    bot.chat('/login 23072009');
  }, 3000);

  // Wait 7 seconds, then shift over to the Economy server instance safely
  setTimeout(() => {
    bot.chat('/server economy');
    console.log('SUCCESS: Character transferred to Economy!');
  }, 7000);
});

// Anti-AFK looping system to prevent automated idle kicks
setInterval(() => {
  if (bot.entity) {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }
}, 30000); // Soft jump every 30 seconds

// Auto-Reconnect System (Configured for a 4-minute delay)
bot.on('end', (reason) => {
  console.log(`Connection dropped. Reason: ${reason}. Restarting script container in 4 minutes...`);
  setTimeout(() => {
    process.exit(1); // Safely reboots the engine block
  }, 240000); 
});

bot.on('error', (err) => {
  console.log(`Internal Error encountered: ${err.message}. Retrying...`);
});
