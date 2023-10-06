import { createBot, Intents, startBot } from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import { enableCachePlugin } from "https://deno.land/x/discordeno@13.0.0/plugins/cache/mod.ts";
import isHexColor from "https://deno.land/x/deno_validator@v0.0.5/lib/isHexColor.ts";
import { getUserData } from "./lib/getUserData.ts";
import { Logger } from "./lib/logger.ts";
import { generateCard, generateErrorCard } from "./lib/generateCard.tsx";
import { Hono } from "https://deno.land/x/hono@v3.7.5/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.7.5/middleware.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const port = parseInt(Deno.env.get("PORT") || "3000");
const app = new Hono();

if (!Deno.env.get("TOKEN")) throw new Error("Please provide a token!");

const font = await Deno.readFile("./public/font.ttf");
const fontBuffer = new Uint8Array(font).buffer;
Logger("ready", `Loaded font! (${fontBuffer.byteLength} bytes)`);

const client = createBot({
 token: Deno.env.get("TOKEN") || "",
 intents: Intents.Guilds | Intents.GuildPresences,
 events: {
  ready() {
   Logger("ready", `Connected to Discord gateway!`);
  },
 },
});

/* @ts-ignore */
const cache = enableCachePlugin(client, {
 guilds: {
  enabled: true,
  presences: true,
 },
});

app.use("*", async (context, next) => {
 const time = Date.now();
 context.header("Access-Control-Allow-Origin", "*");
 context.header("Access-Control-Allow-Methods", "GET");
 context.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 context.header("Access-Control-Max-Age", "0");
 context.header("Cache-Control", "no-cache, no-store, must-revalidate");
 context.header("Pragma", "no-cache");
 context.header("Expires", "0");
 context.header("X-Content-Type-Options", "nosniff");
 context.header("X-Frame-Options", "DENY");
 context.header("X-XSS-Protection", "1; mode=block");
 context.header("Referrer-Policy", "no-referrer");
 context.header("Content-Security-Policy", "default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; script-src 'self' 'unsafe-inline'");
 context.header("Permissions-Policy", "interest-cohort=()");

 await next();
 Logger("request", `${context.req.method} ${context.req.url} - ${Date.now() - time}ms`);
});

app.get("/badges/:badge", serveStatic({ root: "./public" }));

app.get("/", (context) => {
 return context.redirect("https://github.com/igorkowalczyk/discord-activity");
});

app.get("/api/raw/:userId", async (context) => {
 const id = context.req.param("userId") as unknown as bigint;
 context.header("Content-Type", "application/json");

 if (!id) {
  context.status(400);
  return context.json({ error: "Please provide a user ID!", status: 400 });
 }

 if (isNaN(parseInt(id.toString()))) {
  context.status(400);
  return context.json({ error: "Please provide a valid user ID!", status: 400 });
 }

 const user = await getUserData(client, id, cache);

 if (!user) {
  context.status(404);
  return context.json({ error: "User not found!", status: 404 });
 }

 context.status(200);
 return context.json(user);
});

app.get("/api/:userCardId", async (context) => {
 try {
  const id = context.req.param("userCardId") as unknown as bigint;
  const options = context.req.query();

  if (!id) {
   context.status(400);
   return context.json({ error: "Please provide a user ID!", status: 400 });
  }

  if (isNaN(parseInt(id.toString()))) {
   context.status(400);
   return context.json({ error: "Please provide a valid user ID!", status: 400 });
  }

  const userData = await getUserData(client, id, cache);

  if (!userData) {
   context.status(404);
   return context.json({ error: "User not found!", status: 404 });
  }

  context.header("Content-Type", "image/svg+xml");

  if (userData.activities && userData.activities.length > 0) {
   const nonStatusGames = userData.activities.filter((activity) => activity.type !== 4) || [];
   const activity = nonStatusGames.length > 0 ? { ...nonStatusGames[0] } : null;

   userData.activities = [];

   if (activity) {
    if (activity.largeImage && typeof activity.largeImage === "string") {
     activity.largeImage = activity.largeImage.startsWith("mp:external/") ? `https://media.discordapp.net/${activity.largeImage.replace("mp:", "")}` : activity.largeImage;
    }

    if (activity.smallImage && typeof activity.smallImage === "string") {
     activity.smallImage = activity.smallImage.startsWith("mp:external/") ? `https://media.discordapp.net/${activity.smallImage.replace("mp:", "")}` : activity.smallImage;
    }

    userData.activities.push(activity);
   }
  }

  userData.options = {
   backgroundColor: "#161a23",
   borderRadius: 10,
   idleMessage: "There is nothing going on here!",
   hideStatus: false,
  };

  if (options.bgColor && typeof options.bgColor === "string" && isHexColor("#" + options.bgColor)) {
   userData.options.backgroundColor = ("#" + options.bgColor) as string;
  }

  if (options.borderRadius && typeof options.borderRadius === "string" && !isNaN(options.borderRadius as unknown as number)) {
   userData.options.borderRadius = options.borderRadius as unknown as number;
  }

  if (options.idleMessage && typeof options.idleMessage === "string") {
   userData.options.idleMessage = options.idleMessage as string;
  }

  if (options.hideStatus && typeof options.hideStatus === "string") {
   userData.options.hideStatus = options.hideStatus === "true" ? true : false;
  }

  const image = await generateCard(userData, fontBuffer);
  return context.body(image);
 } catch (err) {
  const card = await generateErrorCard(fontBuffer);
  Logger("error", err);
  context.status(500);
  context.header("Content-Type", "image/svg+xml");
  return context.body(card);
 }
});

await startBot(client);

Deno.serve(
 {
  port: port,
  onListen({ port, hostname }) {
   Logger("ready", `Listening on: http://${hostname ?? "localhost"}:${port}`);
  },
 },
 app.fetch
);
