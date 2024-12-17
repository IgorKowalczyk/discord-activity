import "@std/dotenv/load";
import { createBot, DiscordGatewayPayload, DiscordGuildMembersChunk } from "@discordeno/bot";
import { DiscordPresenceUpdate, Intents } from "npm:@discordeno/types@20.0.0";
import { addDesiredProperties } from "./lib/addDesiredProperties.ts";
const token = Deno.env.get("TOKEN");
const guildId = Deno.env.get("GUILD_ID");

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

if (Deno.env.get("BUILD") === "true") {
 bot.logger.info("Not starting the bot as this is a build environment.");
} else {
 await bot.start();
}

addDesiredProperties(bot);
