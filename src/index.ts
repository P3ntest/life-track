import Bao from "baojs";
import { MongoClient } from "mongodb";
import { startWeatherCron } from "./services/weather";
import { eventsCollection } from "./mongo";
import "saslprep";

const app = new Bao();

app.get("/", (ctx) => {
  return ctx.sendText("OK");
});

console.log("Connecting to MongoDB");

app.post("/track", async (ctx) => {
  const { type } = (await ctx.req.json()) as any;

  await eventsCollection.insertOne({
    type,
    time: Date.now(),
  });

  return ctx.sendText("OK");
});

app.listen({
  port: 3000,
});

startWeatherCron();
