import { FreshContext } from "$fresh/server.ts";
import { bot } from "../bot.ts";

export async function handler(
 req: Request,
 ctx: FreshContext,
) {
 const url = new URL(req.url);

 if (url.pathname.startsWith("/docs")) {
  return Response.redirect("https://github.com/igorkowalczyk/discord-activity?tab=readme-ov-file#-getting-started");
 } else if (url.pathname.startsWith("/discord")) {
  return Response.redirect(Deno.env.get("INVITE_LINK") ?? "/");
 }

 const time = performance.now();
 const resp = await ctx.next();
 resp.headers.set("Access-Control-Allow-Origin", "*");
 resp.headers.set("Access-Control-Allow-Methods", "GET");
 resp.headers.set("X-Content-Type-Options", "nosniff");
 resp.headers.set("X-XSS-Protection", "1; mode=block");
 resp.headers.set("Referrer-Policy", "no-referrer");
 resp.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
 resp.headers.set("Pragma", "no-cache");
 resp.headers.set("Expires", "0");

 bot.logger.info(`${req.method} ${req.url} - ${(performance.now() - time).toFixed(2)}ms`);
 return resp;
}
