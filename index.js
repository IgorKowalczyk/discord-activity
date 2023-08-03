/* eslint-disable complexity */
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { Application, isHttpError, Router, send } from "https://deno.land/x/oak/mod.ts";
import { createBot, Intents, startBot } from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import { enableCachePlugin } from "https://deno.land/x/discordeno@13.0.0/plugins/cache/mod.ts";
import { shortenText } from "./lib/shortenText.js";
import isHexColor from "https://deno.land/x/deno_validator/lib/isHexColor.ts";
import { getIconCode } from "./lib/getEmoji.js";
import { getUserData } from "./lib/getUserData.js";
import { Logger } from "./lib/logger.js";
import { generateCard } from "./lib/generateCard.jsx";
const env = await load();
const port = parseInt(env["PORT"] || 3000);
const app = new Application();

if (!env["TOKEN"]) throw new Error("Please provide a token!");

const font = await Deno.readFile("./public/font.ttf");
const fontBuffer = new Uint8Array(font).buffer;
console.log(Logger("ready", `Loaded font! (${fontBuffer.byteLength} bytes)`));

const client = createBot({
 token: env["TOKEN"],
 intents: Intents.Guilds | Intents.GuildMessages | Intents.GuildPresences,
 events: {
  ready() {
   console.log(Logger("ready", `Connected to Discord gateway!`));
  },
 },
});

const cache = enableCachePlugin(client, {
 guilds: {
  enabled: true,
  presences: true,
 },
});

const router = new Router();

router.get("/api/raw/:userId", async (context) => {
 const id = context.params.userId;
 context.response.headers.set("Content-Type", "application/json");
 if (!id) {
  context.response.body = {
   error: "Please provide a user ID!",
   status: 400,
  };
  return (context.response.status = 400);
 }
 if (isNaN(id)) {
  context.response.body = {
   error: "Please provide a valid user ID!",
   status: 400,
  };
  return (context.response.status = 400);
 }
 const user = await getUserData(client, id, cache);

 if (!user) {
  context.response.body = {
   error: "User not found!",
   status: 404,
  };
  return (context.response.status = 404);
 }
 context.response.body = user;
});

router.get("/api/:userId", async (context) => {
 const id = context.params.userId;
 const options = context.request.url.searchParams;

 if (!id) {
  context.response.body = {
   error: "Please provide a user ID!",
   status: 400,
  };
  return (context.response.status = 400);
 }

 if (isNaN(id)) {
  context.response.body = {
   error: "Please provide a valid user ID!",
   status: 400,
  };
  return (context.response.status = 400);
 }
 const userData = await getUserData(client, id, cache);

 if (!userData) {
  context.response.body = {
   error: "User not found!",
   status: 404,
  };
  return (context.response.status = 404);
 }

 const { activities, user } = userData || {};

 const statusActivity = activities?.find((activity) => activity.type === 4) || null;
 const emoji = statusActivity?.emoji || {};
 let statusEmoji = null;

 if (emoji && emoji.id) {
  statusEmoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;
 } else if (emoji && emoji.name && typeof emoji.name === "string") {
  statusEmoji = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${getIconCode(emoji.name)}.png`;
 }

 user.customStatus = {
  state: shortenText(statusActivity?.state ?? ""),
  image: statusEmoji,
 };

 const nonStatusGames = activities?.filter((activity) => activity.type !== 4) || [];
 const activity = nonStatusGames.length > 0 ? { ...nonStatusGames[0] } : {};

 if (activity && typeof activity === "object") {
  activity.assets = activity.assets || {};
  if (activity.largeImage && typeof activity.largeImage === "string") {
   activity.assets.largeImage = activity.largeImage.startsWith("mp:external/") ? `https://media.discordapp.net/${activity.largeImage.replace("mp:", "")}` : activity.largeImage;
   delete activity.largeImage;
  }

  if (activity.smallImage && typeof activity.smallImage === "string") {
   activity.assets.smallImage = activity.smallImage.startsWith("mp:external/") ? `https://media.discordapp.net/${activity.smallImage.replace("mp:", "")}` : activity.smallImage;
   delete activity.smallImage;
  }

  user.activity = activity;
 } else {
  user.activity = null;
 }

 user.presence = userData.status;

 context.response.headers.set("Content-Type", "image/svg+xml");
 context.response.headers.set("Cache-Control", "public, max-age=3600");

 user.options = {
  backgroundColor: "161a23",
  borderRadius: 10,
  idleMessage: "There is nothing going on here!",
  hideStatus: false,
 };

 if (options.get("bgcolor") && typeof options.get("bgcolor") === "string" && isHexColor(options.get("bgcolor"))) {
  user.options.backgroundColor = options.get("bgcolor");
 }

 if (options.get("borderRadius") && typeof options.get("borderRadius") === "string" && !isNaN(options.get("borderRadius"))) {
  user.options.borderRadius = options.get("borderRadius");
 }

 if (options.get("idleMessage") && typeof options.get("idleMessage") === "string") {
  user.options.idleMessage = options.get("idleMessage");
 }

 if (options.get("hideStatus") && typeof options.get("hideStatus") === "string") {
  user.options.hideStatus = options.get("hideStatus") === "true" ? true : false;
 }

 const image = await generateCard(user, fontBuffer);

 context.response.body = image;
});

router.get("/badges/:file", async (context) => {
 const filePath = context.request.url.pathname;
 await send(context, filePath, {
  root: Deno.cwd() + "/public",
 });
});

app.use(async (_ctx, next) => {
 const start = _ctx[Symbol.for("request-received.startAt")] ? _ctx[Symbol.for("request-received.startAt")] : performance.now();
 await next();
 const delta = Math.round(performance.now() - start);
 console.log(Logger(
  isHttpError(_ctx.response.status) ? "error" : "info",
  `[${_ctx.response.status}] ${_ctx.request.method} ${_ctx.request.url.pathname} - ${delta}ms`,
 ));
});

app.use(async (context, next) => {
 context.response.headers.set("Access-Control-Allow-Origin", "*");
 context.response.headers.set("Access-Control-Allow-Methods", "GET");
 context.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 context.response.headers.set("Access-Control-Max-Age", "1800");
 context.response.headers.set("X-Content-Type-Options", "nosniff");
 context.response.headers.set("X-Frame-Options", "DENY");
 context.response.headers.set("X-XSS-Protection", "1; mode=block");
 context.response.headers.set("Referrer-Policy", "no-referrer");
 context.response.headers.set("Content-Security-Policy", "default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; script-src 'self' 'unsafe-inline'");
 context.response.headers.set("Permissions-Policy", "interest-cohort=()");
 await next();
});

// add 400 and 500 pages
app.use(async (context, next) => {
 try {
  await next();
 } catch (err) {
  context.response.body = {
   error: "Internal Server Error",
   status: 500,
  };
  context.response.status = 500;
  console.log(Logger("error", err));
 }
 if (context.response.status === 404) {
  context.response.body = {
   error: "Not Found",
   status: 404,
  };
  context.response.status = 404;
 }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
 console.log(Logger("ready", `Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`));
});

await startBot(client);
await app.listen({ port: port });
