import { Application, isHttpError, Router, send } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { createBot, Intents, startBot } from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import { enableCachePlugin } from "https://deno.land/x/discordeno@13.0.0/plugins/cache/mod.ts";
import isHexColor from "https://deno.land/x/deno_validator@v0.0.5/lib/isHexColor.ts";
import { getUserData } from "./lib/getUserData.ts";
import { Logger } from "./lib/logger.ts";
import { generateCard, generateErrorCard } from "./lib/generateCard.tsx";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const port = parseInt(Deno.env.get("PORT") || "3000");
const app = new Application();

if (!Deno.env.get("TOKEN")) throw new Error("Please provide a token!");

const font = await Deno.readFile("./public/font.ttf");
const fontBuffer = new Uint8Array(font).buffer;
console.log(Logger("ready", `Loaded font! (${fontBuffer.byteLength} bytes)`));

const client = createBot({
 token: Deno.env.get("TOKEN") || "",
 intents: Intents.Guilds | Intents.GuildPresences,
 events: {
  ready() {
   console.log(Logger("ready", `Connected to Discord gateway!`));
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

const router = new Router();

router.get("/", (context) => {
 context.response.redirect("https://github.com/igorkowalczyk/discord-activity");
});

router.get("/api/raw/:userId", async (context) => {
 const id = context.params.userId as unknown as bigint;

 context.response.headers.set("Content-Type", "application/json");

 if (!id) {
  context.response.body = {
   error: "Please provide a user ID!",
   status: 400,
  };
  return (context.response.status = 400);
 }

 if (isNaN(parseInt(id.toString()))) {
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
 try {
  const id = context.params.userId as unknown as bigint;
  const options = context.request.url.searchParams;

  if (!id) {
   context.response.body = {
    error: "Please provide a user ID!",
    status: 400,
   };
   return (context.response.status = 400);
  }

  if (isNaN(parseInt(id.toString()))) {
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

  context.response.headers.set("Content-Type", "image/svg+xml");

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
   backgroundColor: "161a23",
   borderRadius: 10,
   idleMessage: "There is nothing going on here!",
   hideStatus: false,
  };

  if (options.get("bgColor") && typeof options.get("bgColor") === "string" && isHexColor("#" + options.get("bgColor"))) {
   userData.options.backgroundColor = ("#" + options.get("bgColor")) as string;
  }

  if (options.get("borderRadius") && typeof options.get("borderRadius") === "string" && !isNaN(options.get("borderRadius") as unknown as number)) {
   userData.options.borderRadius = options.get("borderRadius") as unknown as number;
  }

  if (options.get("idleMessage") && typeof options.get("idleMessage") === "string") {
   userData.options.idleMessage = options.get("idleMessage") as string;
  }

  if (options.get("hideStatus") && typeof options.get("hideStatus") === "string") {
   userData.options.hideStatus = options.get("hideStatus") === "true" ? true : false;
  }

  const image = await generateCard(userData, fontBuffer);

  context.response.body = image;
 } catch (_err) {
  const card = await generateErrorCard(fontBuffer);
  context.response.headers.set("Content-Type", "image/svg+xml");
  context.response.body = card;
 }
});

router.get("/badges/:file", async (context) => {
 const filePath = context.request.url.pathname;
 await send(context, filePath, {
  root: Deno.cwd() + "/public",
 });
});

app.use(async (_ctx, next) => {
 /* @ts-ignore */
 const start = _ctx[Symbol.for("request-received.startAt")] ? _ctx[Symbol.for("request-received.startAt")] : performance.now();
 await next();
 const delta = Math.round(performance.now() - start);
 console.log(Logger(isHttpError(_ctx.response.status) ? "error" : "info", `[${_ctx.response.status}] ${_ctx.request.method} ${_ctx.request.url.pathname} - ${delta}ms`));
});

app.use(async (context, next) => {
 context.response.headers.set("Access-Control-Allow-Origin", "*");
 context.response.headers.set("Access-Control-Allow-Methods", "GET");
 context.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 context.response.headers.set("Access-Control-Max-Age", "0");
 context.response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
 context.response.headers.set("Pragma", "no-cache");
 context.response.headers.set("Expires", "0");
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
