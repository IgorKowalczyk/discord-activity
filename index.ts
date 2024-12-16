import "@std/dotenv/load";
import { createBot, DiscordGatewayPayload, DiscordGuildMembersChunk } from "@discordeno/bot";
import { DiscordPresenceUpdate, Intents } from "npm:@discordeno/types@20.0.0";
import { getUserData } from "./lib/getUserData.ts";
import { generateCard, generateErrorCard } from "./lib/generateCard.ts";
import { type Context, Hono } from "jsr:@hono/hono";
import { serveStatic } from "jsr:@hono/hono/deno";
import type { StatusCode } from "jsr:@hono/hono/utils/http-status";
import { addDesiredProperties } from "./lib/addDesiredProperties.ts";
import { cardOptions, discordUserId } from "./lib/schemas.ts";
import { fetchUserPresences } from "./lib/fetchUserPresences.ts";

const port = parseInt(Deno.env.get("PORT") || "3000");
const token = Deno.env.get("TOKEN");
const guildId = Deno.env.get("GUILD_ID");
const app = new Hono();

if (!token) throw new Error("Please provide a valid token!");
if (!guildId) throw new Error("Please provide a valid guild ID! Make sure the bot is in the server!");

export const presencesCache = new Map<string, DiscordPresenceUpdate>();

export const bot = createBot({
 token: token,
 intents: Intents.Guilds | Intents.GuildMembers | Intents.GuildPresences,
 desiredProperties: {
  user: {
   id: true,
   username: true,
   discriminator: true,
   flags: true,
   publicFlags: true,
   avatar: true,
   toggles: true,
   globalName: true,
  },
 },
 gateway: {
  cache: {
   requestMembers: {
    enabled: true,
   },
  },
 },
 events: {
  raw: (data: DiscordGatewayPayload) => {
   if (data.t === "GUILD_MEMBERS_CHUNK") {
    const guildChunk = data.d as DiscordGuildMembersChunk;
    if (!guildChunk.presences) return;
    guildChunk.presences.forEach((presence: DiscordPresenceUpdate) => {
     presencesCache.set(presence.user.id.toString(), presence);
    });
   }
   if (data.t === "PRESENCE_UPDATE") {
    const presence = data.d as DiscordPresenceUpdate;
    presencesCache.set(presence.user.id.toString(), presence);
   }
  },
  ready: ({ user }) => {
   bot.logger.info(`Connected to Discord! Client: ${user.username}#${user.discriminator} (ID: ${user.id})`);
  },
 },
});

await bot.start();

addDesiredProperties(bot);

Deno.serve(
 {
  port: port,
  onListen({ port, hostname }) {
   bot.logger.info(`Listening on: http://${hostname ?? "localhost"}:${port}`);
  },
 },
 app.fetch,
);

app.use("*", async (context, next) => {
 const time = performance.now();
 context.header("Access-Control-Allow-Origin", "*");
 context.header("Access-Control-Allow-Methods", "GET");
 context.header("X-Content-Type-Options", "nosniff");
 context.header("X-XSS-Protection", "1; mode=block");
 context.header("Referrer-Policy", "no-referrer");
 context.header("Content-Security-Policy", "default-src 'none'; img-src * data:; style-src 'unsafe-inline'");
 context.header("Permissions-Policy", "interest-cohort=()");
 context.header("Cache-Control", "public, max-age=0, must-revalidate");
 context.header("Pragma", "no-cache");
 context.header("Expires", "0");

 await next();

 bot.logger.info(`${context.req.method} ${context.req.url} - ${(performance.now() - time).toFixed(2)}ms`);
});

app.get("/badges/:badge", serveStatic({ root: "./public" }));

app.get("/", (context) => {
 return context.redirect("https://github.com/igorkowalczyk/discord-activity");
});

app.get("/api/raw/:userId", async (context) => {
 try {
  const id = context.req.param("userId");
  if (!discordUserId.safeParse(id).success) return throwJsonError(context, 400, "Please provide a valid user ID!");

  await fetchUserPresences(id, guildId);
  const user = await getUserData(id);
  if (!user) return throwJsonError(context, 404, "User not found! Did you join the server?");

  context.status(200);
  return context.json(user);
 } catch (err) {
  bot.logger.error(err);
  return throwJsonError(context, 500, "Something went wrong while fetching the user data!");
 }
});

app.get("/api/:userId", async (context) => {
 try {
  const id = context.req.param("userId");
  const queryOptions = context.req.query();
  const options = cardOptions.safeParse(queryOptions);

  if (!discordUserId.safeParse(id).success) return throwImageError(context, 400, "Please provide a valid user ID!");
  if (!options.success) return throwImageError(context, 400, "Please provide valid query parameters!");

  await fetchUserPresences(id, guildId);
  const userData = await getUserData(id);
  if (!userData) return throwImageError(context, 404, "User not found! Did you join the server?");

  const image = await generateCard(userData, options.data);

  context.header("Content-Type", "image/svg+xml");
  return context.body(image);
 } catch (error) {
  bot.logger.error(error);
  return throwImageError(context, 500, "Something went wrong while generating the user card!");
 }
});

const throwImageError = (context: Context, code?: StatusCode, error?: string) => {
 const card = generateErrorCard(error);
 context.status(code || 500);
 context.header("Content-Type", "image/svg+xml");
 return context.body(card);
};

const throwJsonError = (context: Context, code?: StatusCode, error?: string) => {
 context.status(code || 500);
 context.header("Content-Type", "application/json");
 return context.json({ error: error || "Internal Server Error", status: code || 500 });
};
