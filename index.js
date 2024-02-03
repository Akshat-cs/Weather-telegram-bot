const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatid = msg.chat.id;
  const userInput = msg.text;

  try {
    if (userInput === "/start") {
      bot.sendMessage(chatid, "Welcome to the weather bot");
    } else {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${process.env.WEATHER_API_KEY}`
      );
      const data = response.data;
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15;
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windspeed = data.wind.speed;
      const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
        2
      )}℃. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the windspeed is ${windspeed}m/s`;
      bot.sendMessage(chatid, message);
    }
  } catch (error) {
    bot.sendMessage(chatid, "City doesn't exist");
  }
});
