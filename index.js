const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Render requires an active web server port to stay awake
app.get('/', (req, res) => res.send('Bot is running smoothly!'));
app.listen(process.env.PORT || 3000);

const bot = mineflayer.createBot({
  host: 'play.boholmc.net',
  username: 'YTXMANKU', // Your cracked username
  version: '1.21.1', // Adjusted explicitly for your Java 26.2 version
  auth: 'offline'
});

bot.on('spawn', () => {
  console.log('Bot logged into Bohol Network lobby!');
  
  // Wait 2 seconds, then execute AuthMe password
  setTimeout(() => {
    bot.chat('/login 23072009'); // Your secret password
  }, 2000);

  // Wait 5 seconds, then jump straight to the economy sub-server
  setTimeout(() => {
    bot.chat('/server economy');
    console.log('Bot successfully routed to Economy!');
  }, 5000);
});

// Anti-AFK looping to trick idle kickers
setInterval(() => {
  if (bot.entity) {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }
}, 45000); // Jumps every 45 seconds

// Auto-Reconnect System (Configured for a 4-minute delay)
bot.on('end', () => {
  console.log('Disconnected from Bohol Network. Reconnecting in 4 minutes...');
  setTimeout(() => {
    process.exit(1); // Restarts the Render container automatically after 4 mins
  }, 240000); // 240,000 milliseconds = 4 minutes
});
