const TelegramBot = require("node-telegram-bot-api");


const TOKEN = "7691880955:AAHPw6FxY0DEV5Ul04w3EXWTJaLcWP8QfMg";
const CHAT_ID = "1185704279"; //viaksh
// const CHAT_ID = '1593806971';  // aayush
// const CHAT_ID = '6143069070';  // client



const bot = new TelegramBot(TOKEN, { polling: true });


exports.sendMessage = async (req, res) => {
    try {
      const message = req.body.message; // Extract the `message` key from the request body
      if (!message) {
        return res.status(400).send("Message is required"); // Handle missing message
      }
      await bot.sendMessage(CHAT_ID, message); // Use the extracted message
      res.status(200).send("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).send("Failed to send message");
    }
  };
  