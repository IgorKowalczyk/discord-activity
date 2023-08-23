import type { User } from "./types.d.ts";
import type { Bot } from "https://deno.land/x/discordeno@13.0.0/bot.ts";
import type { BotWithCache } from "https://deno.land/x/discordeno@13.0.0/plugins/cache/mod.ts";
import { shortenText } from "./shortenText.ts";
import { getIconCode } from "./getEmoji.ts";

/* @ts-ignore */
BigInt.prototype.toJSON = function () {
 return this.toString();
};

export function calculateBadges(publicFlags: number, avatarType: string) {
 const badges = [];

 if (publicFlags & (1 << 0)) {
  badges.push("STAFF");
 }

 if (publicFlags & (1 << 1)) {
  badges.push("PARTNER");
 }

 if (publicFlags & (1 << 2)) {
  badges.push("HYPESQUAD_EVENTS");
 }

 if (publicFlags & (1 << 3)) {
  badges.push("BUG_HUNTER_LEVEL_1");
 }

 if (publicFlags & (1 << 6)) {
  badges.push("HYPESQUAD_BRAVERY");
 }

 if (publicFlags & (1 << 7)) {
  badges.push("HYPESQUAD_BRILLIANCE");
 }

 if (publicFlags & (1 << 8)) {
  badges.push("HYPESQUAD_BALANCE");
 }

 if (publicFlags & (1 << 9)) {
  badges.push("EARLY_SUPPORTER");
 }

 if (publicFlags & (1 << 14)) {
  badges.push("BUG_HUNTER_LEVEL_2");
 }

 if (publicFlags & (1 << 17)) {
  badges.push("VERIFIED_DEVELOPER");
 }

 if (publicFlags & (1 << 18)) {
  badges.push("CERTIFIED_MODERATOR");
 }

 if (publicFlags & (1 << 22)) {
  badges.push("ACTIVE_DEVELOPER");
 }

 if (avatarType === "gif") {
  badges.push("NITRO");
 }

 return badges;
}

export async function getUserData(client: Bot, id: bigint, cache: BotWithCache): Promise<User | null> {
 const userData = (await client.helpers.getUser(id)) as unknown as User;
 if (!userData) return null;
 if (userData.bot) return null;
 const userPresences = cache.presences.get(userData.id);

 let avatar;
 let avatarType;

 if (userData.avatar) {
  /* @ts-ignore */
  avatarType = userData.avatar.toString(16).startsWith("a") ? "gif" : "png";
  /* @ts-ignore */
  const avatarHash = userData.avatar.toString(16).startsWith("a") ? "a_" + userData.avatar.toString(16).slice(1) : userData.avatar.toString(16).slice(1);
  avatar = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${avatarHash}.${avatarHash ? "gif" : "png"}` : `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
 } else {
  avatarType = "png";
  avatar = `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
 }

 const statusActivity = userData.activities?.find((activity) => activity.type === 4) || null;
 const emoji = statusActivity?.emoji || null;
 let statusEmoji = null;

 if (emoji && emoji.id) {
  statusEmoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;
 } else if (emoji && emoji.name && typeof emoji.name === "string") {
  statusEmoji = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${getIconCode(emoji.name)}.png`;
 }

 return {
  bot: userData.bot,
  activities: userPresences && userPresences.activities,
  customStatus: {
   state: shortenText(statusActivity?.state ?? ""),
   image: statusEmoji,
  },
  status: {
   desktop: userPresences && userPresences?.desktop,
   mobile: userPresences && userPresences?.mobile,
   web: userPresences && userPresences?.web,
  },
  id: userData.id,
  username: userData.username,
  discriminator: userData.discriminator,
  avatar: avatar,
  tag: userData.tag,
  createdAt: userData.createdAt,
  joinedAt: userData.joinedAt,
  premiumSince: userData.premiumSince,
  premiumSinceTimestamp: userData.premiumSinceTimestamp,
  publicFlags: userData.publicFlags,
  badges: calculateBadges(userData.publicFlags, avatarType),
 };
}
