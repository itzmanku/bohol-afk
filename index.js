const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bohol Cloud Engine: Running');
});

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// Self-ping to prevent Render from freezing the container
setInterval(() => {
  if (process.env.RENDER_EXTERNAL_URL) {
    http.get(process.env.RENDER_EXTERNAL_URL, (res) => {});
  }
}, 60000);

// Main Minecraft Client
const bot = mineflayer.createBot({
  host: 'play.boholmc.net',
  username: 'YTXMANKU',
  version: '1.21.1',
  auth: 'offline',
  viewDistance: 'tiny',
  checkTimeoutInterval: 90 * 1000 // Extended timeout threshold
});

// Real-player simulator loop (Moves head to look like a human)
let lookToggle = true;
function simulateHumanLook() {
  if (bot.entity) {
    if (lookToggle) {
      bot.look(0.5, 0, true); // Look slightly right
    } else {
      bot.look(-0.5, 0, true); // Look slightly left
    }
    lookToggle = !lookToggle;
  }
}

bot.on('spawn', () => {
  console.log('SUCCESS: Character YTXMANKU spawned in lobby.');
  
  // Start the head movement loop immediately to bypass bot-blockers
  const headMovementInterval = setInterval(simulateHumanLook, 2000);

  // Step 1: Log in after 3 seconds
  setTimeout(() => {
    bot.chat('/login 23072009');
    console.log('Sent login command.');
  }, 3000);

  // Step 2: Switch to Economy after 8 seconds
  setTimeout(() => {
    bot.chat('/server economy');
    console.log('Sent server transfer command.');
  }, 8000);
});

// Simple Jump cycle every 35 seconds to beat standard AFK timers
setInterval(() => {
  if (bot.entity) {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }
}, 35000);

// Auto-Reconnect System (4 minutes)
bot.on('end', (reason) => {
  console.log(`Server disconnected. Reason: ${reason}. Retrying in 4 minutes...`);
  setTimeout(() => {
    process.exit(1); // Safely triggers Render's auto-restart
  }, 240000); 
});

bot.on('error', (err) => {
  console.log(`Network error: ${err.message}`);
});
