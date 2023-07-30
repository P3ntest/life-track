import { z } from "zod";
import { eventsCollection } from "../mongo";
import { Cron } from "croner";

const weatherResponse = z
  .object({
    main: z.object({
      temp: z.number(),
      pressure: z.number(),
      humidity: z.number(),
    }),
    clouds: z.object({
      all: z.number(),
    }),
    visibility: z.number(),
  })
  .transform((data) => ({
    ...data.main,
    clouds: data.clouds.all,
    visibility: data.visibility,
  }));

async function getCurrentWeather() {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${48.065701}&lon=${11.66231}&units=metric&appid=${
      process.env.OPEN_WEATHER_API_KEY
    }`
  );

  return weatherResponse.parse(await res.json());
}

async function logWeather() {
  const weather = await getCurrentWeather();

  console.log("Logging weather");

  eventsCollection.insertOne({
    type: "weather",
    time: Date.now(),
    data: weather,
  });
}

export function startWeatherCron() {
  new Cron("0 * * * *", logWeather);
}
