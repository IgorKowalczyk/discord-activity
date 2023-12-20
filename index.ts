import { createBot, Intents, startBot } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { enableCachePlugin } from "https://deno.land/x/discordeno@18.0.1/plugins/cache/mod.ts";
import isHexColor from "https://deno.land/x/deno_validator@v0.0.5/lib/isHexColor.ts";
import { getUserData } from "./lib/getUserData.ts";
import { Logger } from "./lib/logger.ts";
import { generateCard, generateErrorCard } from "./lib/generateCard.ts";
import { Context, Hono, Next } from "https://deno.land/x/hono@v3.10.0/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.10.0/middleware.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const port = parseInt(Deno.env.get("PORT") || "3000");
const app = new Hono();

if (!Deno.env.get("TOKEN")) throw new Error("Please provide a token!");

const client = createBot({
 token: Deno.env.get("TOKEN") || "",
 intents: Intents.Guilds | Intents.GuildPresences,
 events: {
  ready() {
   Logger("ready", `Connected to Discord gateway!`);
  },
 },
});

const botWithCache = enableCachePlugin(client);

app.use("*", async (context: Context, next: Next) => {
 const time = Date.now();
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
 Logger("request", `${context.req.method} ${context.req.url} - ${Date.now() - time}ms`);
});

app.get("/badges/:badge", serveStatic({ root: "./public" }));

app.get("/", (context: Context) => {
 return context.redirect("https://github.com/igorkowalczyk/discord-activity");
});

app.get("/api/raw/:userId", async (context: Context) => {
 try {
  const id = context.req.param("userId") as unknown as bigint;
  if (!id || isNaN(parseInt(id.toString()))) return throwJsonError(context, 400, "Please provide a user ID!");

  const user = await getUserData(client, id, botWithCache);
  if (!user) return throwJsonError(context, 404, "User not found!");

  context.status(200);
  return context.json(user);
 } catch (_err) {
  return throwJsonError(context, 500, "Something went wrong while fetching the user data!");
 }
});

app.get("/api/:userCardId", async (context: Context) => {
 try {
  const id = context.req.param("userCardId") as unknown as bigint;
  const options = context.req.query();

  if (!id || isNaN(parseInt(id.toString()))) return throwImageError(context, 400, "Please provide a user ID!");

  const userData = await getUserData(client, id, botWithCache);
  if (!userData) return throwImageError(context, 404, "User not found!");

  if (userData.activities && userData.activities.length > 0) {
   const firstNonStatusGame = userData.activities.find((activity) => activity.type !== 4) as unknown as { [key: string]: string };

   if (firstNonStatusGame) {
    ["largeImage", "smallImage"].forEach((key) => {
     if (firstNonStatusGame[key] && typeof firstNonStatusGame[key] === "string" && firstNonStatusGame[key].startsWith("spotify:")) {
      const [_, id] = firstNonStatusGame[key].split(":");
      firstNonStatusGame[key] = `https://i.scdn.co/image/${id}`;
     } else {
      if (typeof firstNonStatusGame[key] === "string" && firstNonStatusGame[key].startsWith("mp:external/")) {
       firstNonStatusGame[key] = `https://media.discordapp.net/${firstNonStatusGame[key].replace("mp:", "")}`;
      }
     }
    });

    // @ts-ignore - Discordeno typings are wrong
    userData.activities = [firstNonStatusGame];
   } else {
    userData.activities = undefined;
   }
  } else {
   userData.activities = undefined;
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

  const image = generateCard(userData);

  context.header("Content-Type", "image/svg+xml");
  return context.body(image);
 } catch (_err) {
  return throwImageError(context, 500, "Something went wrong while generating the user card!");
 }
});

const throwImageError = (context: Context, code?: number, error?: string) => {
 const card = generateErrorCard();
 error && Logger("error", error);
 context.status(code || 500);
 context.header("Content-Type", "image/svg+xml");
 return context.body(card);
};

const throwJsonError = (context: Context, code?: number, error?: string) => {
 error && Logger("error", error);
 context.status(code || 500);
 context.header("Content-Type", "application/json");
 return context.json({ error: error || "Internal Server Error", status: code || 500 });
};

await startBot(client);

Deno.serve(
 {
  port: port,
  onListen({ port, hostname }) {
   Logger("ready", `Listening on: http://${hostname ?? "localhost"}:${port}`);
  },
 },
 app.fetch,
);
