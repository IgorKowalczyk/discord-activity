import { DiscordUser, GatewayOpcodes } from "npm:@discordeno/types@20.0.0";
import { bot } from "../bot.ts";

export async function fetchUserPresences(userId: DiscordUser["id"]) {
 try {
  const guildId = Deno.env.get("GUILD_ID");
  if (!guildId) return;
  const shardId = bot.gateway.calculateShardId(guildId);

  const options = {
   userIds: [userId.toString()],
   limit: 1,
   presences: true,
  };

  await bot.gateway.sendPayload(shardId, {
   op: GatewayOpcodes.RequestGuildMembers,
   d: {
    guild_id: guildId.toString(),
    presences: options.presences ?? false,
    user_ids: options.userIds.map((id) => id.toString()),
   },
  });

  return;
 } catch (error) {
  bot.logger.error(error);
 }
}
