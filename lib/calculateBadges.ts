import { UserFlags } from "npm:@discordeno/types@20.0.0";
import { type User } from "@discordeno/bot";

export function calculateBadges(publicFlags: User["publicFlags"], avatarType: string) {
 if (!publicFlags) return [];

 const bitfield = publicFlags.bitfield;
 const badgeFlags = {
  STAFF: UserFlags.DiscordEmployee,
  PARTNER: UserFlags.PartneredServerOwner,
  HYPESQUAD_EVENTS: UserFlags.HypeSquadEventsMember,
  BUG_HUNTER_LEVEL_1: UserFlags.BugHunterLevel1,
  BUG_HUNTER_LEVEL_2: UserFlags.BugHunterLevel2,
  HYPESQUAD_BRAVERY: UserFlags.HouseBravery,
  HYPESQUAD_BRILLIANCE: UserFlags.HouseBrilliance,
  HYPESQUAD_BALANCE: UserFlags.HouseBalance,
  EARLY_SUPPORTER: UserFlags.EarlySupporter,
  VERIFIED_DEVELOPER: UserFlags.EarlyVerifiedBotDeveloper,
  CERTIFIED_MODERATOR: UserFlags.DiscordCertifiedModerator,
  ACTIVE_DEVELOPER: UserFlags.ActiveDeveloper,
 };

 const badges = Object.entries(badgeFlags)
  .filter(([_badge, flag]) => typeof bitfield === "number" && (bitfield & flag) !== 0)
  .map(([badge]) => badge);

 avatarType === "gif" && badges.push("NITRO");

 return badges;
}
