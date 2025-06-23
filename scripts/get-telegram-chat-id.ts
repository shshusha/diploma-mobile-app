import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN environment variable is not set.");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log(
  "Send any message to your bot in Telegram. This script will print your chat ID and exit."
);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(`Your Telegram chat ID is: ${chatId}`);
  bot.sendMessage(
    chatId,
    `✅ Your chat ID is: <code>${chatId}</code>\nCopy this and add it to your user profile in the app or database.`,
    { parse_mode: "HTML" }
  );
});
