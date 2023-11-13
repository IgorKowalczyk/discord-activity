import type { User } from "./types.d.ts";
import { UserFlags } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import type { Bot } from "https://deno.land/x/discordeno@18.0.1/bot.ts";
import type { BotWithCache } from "https://deno.land/x/discordeno@18.0.1/plugins/cache/mod.ts";
import { getIconCode } from "./getEmoji.ts";

/* @ts-ignore BigInt cannot convert to json */
BigInt.prototype.toJSON = function () {
 return this.toString();
};

export function calculateBadges(publicFlags: number, avatarType: string) {
 const badgeFlags = {
  STAFF: UserFlags.DiscordEmployee,
  PARTNER: UserFlags.PartneredServerOwner,
  HYPESQUAD_EVENTS: UserFlags.HypeSquadEventsMember,
  BUG_HUNTER_LEVEL_1: UserFlags.BugHunterLevel1,
  HYPESQUAD_BRAVERY: UserFlags.HouseBravery,
  HYPESQUAD_BRILLIANCE: UserFlags.HouseBrilliance,
  HYPESQUAD_BALANCE: UserFlags.HouseBalance,
  EARLY_SUPPORTER: UserFlags.EarlySupporter,
  BUG_HUNTER_LEVEL_2: UserFlags.BugHunterLevel2,
  VERIFIED_DEVELOPER: UserFlags.EarlyVerifiedBotDeveloper,
  CERTIFIED_MODERATOR: UserFlags.DiscordCertifiedModerator,
  ACTIVE_DEVELOPER: 1 << 22,
 };

 const badges = Object.entries(badgeFlags)
  .filter(([_badge, flag]) => (publicFlags & flag) !== 0)
  .map(([badge]) => badge);

 avatarType === "gif" && badges.push("NITRO");

 return badges;
}

export async function getUserData(client: Bot, id: bigint, cache: BotWithCache): Promise<User | null> {
 const userData = (await client.helpers.getUser(id)) as unknown as User;
 if (!userData) return null;
 if (userData.bot) return null;

 const userPresences = cache.presences.get(userData.id);

 let avatar;
 let avatarType;
 let statusEmoji = null;
 let statusState = null;

 if (userData.avatar) {
  // @ts-ignore toString(16) expected 0 arguments but got 1
  const hex = userData.avatar.toString(16);
  avatarType = hex.startsWith("a") ? "gif" : "png";
  const avatarHash = hex.startsWith("a") ? `a_${hex.slice(1)}` : hex.slice(1);
  avatar = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${avatarHash}.${avatarType}` : `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
 } else {
  avatarType = "png";
  avatar = `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
 }

 if (userPresences && userPresences.activities) {
  const statusActivity = userPresences.activities.find((activity) => activity.type === 4) || null;

  if (statusActivity && statusActivity.state) {
   statusState = statusActivity.state;
  }

  if (statusActivity && statusActivity.emoji && statusActivity.emoji.id) {
   statusEmoji = `https://cdn.discordapp.com/emojis/${statusActivity.emoji.id}.${statusActivity.emoji.animated ? "gif" : "png"}`;
  } else if (statusActivity && statusActivity.emoji && statusActivity.emoji.name && typeof statusActivity.emoji.name === "string") {
   statusEmoji = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${getIconCode(statusActivity.emoji.name)}.png`;
  }
 }

 return {
  bot: userData.bot,
  activities: userPresences?.activities,
  customStatus: {
   image: statusEmoji,
   state: statusState,
  },
  status: {
   desktop: userPresences?.desktop,
   mobile: userPresences?.mobile,
   web: userPresences?.web,
  },
  id: BigInt(userData.id),
  username: userData.username,
  discriminator: userData.discriminator,
  avatar: avatar,
  publicFlags: userData.publicFlags,
  badges: calculateBadges(userData.publicFlags, avatarType),
 } as User;
}
