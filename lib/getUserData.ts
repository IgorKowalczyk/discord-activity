import { type User, UserActivity } from "./schemas.ts";
import { presencesCache } from "../index.ts";
import { calculateBadges } from "./calculateBadges.ts";
import { bot } from "../index.ts";
import { ActivityTypes } from "npm:@discordeno/types@20.0.0";
import { getIconCode } from "./utils.ts";
import "./patchBigInt.ts";

export const spotifyImageToUrl = (url: string) => {
 if (url.startsWith("spotify:")) {
  const [_, id] = url.split(":");
  return `https://i.scdn.co/image/${id}`;
 }
 return url;
};

export const externalMediaToUrl = (url: string) => {
 if (url.startsWith("mp:external/")) {
  return `https://media.discordapp.net/${url.replace("mp:", "")}`;
 }
 return url;
};

export async function getUserData(id: string): Promise<User | null> {
 const userData = await bot.helpers.getUser(id);
 if (!userData) return null;
 if (userData.bot) return null;

 const userPresences = presencesCache.get(id);
 if (!userPresences) return null;

 let avatar;
 let avatarType;
 let statusEmoji = null;
 let statusState = null;
 let activities: UserActivity[] = [];

 if (userData.avatar) {
  const hex = userData.avatar.toString(16);
  avatarType = hex.startsWith("a") ? "gif" : "png";
  const avatarHash = hex.startsWith("a") ? `a_${hex.slice(1)}` : hex.slice(1);
  avatar = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${avatarHash}.${avatarType}` : `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
 } else {
  avatarType = "png";
  avatar = `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
 }

 if (userPresences && userPresences.activities) {
  console.log(userPresences.activities);
  const statusActivity = userPresences.activities.find((activity) => activity.type === ActivityTypes.Custom);
  const otherActivities = userPresences.activities.filter((activity) => activity.type !== ActivityTypes.Custom);

  if (statusActivity) {
   if (statusActivity.state) statusState = statusActivity.state;
   if (statusActivity.emoji) {
    console.log(statusActivity.emoji);
    if (statusActivity.emoji.id) {
     statusEmoji = `https://cdn.discordapp.com/emojis/${statusActivity.emoji.id}.${statusActivity.emoji.animated ? "gif" : "png"}`;
    } else if (statusActivity.emoji.name) {
     statusEmoji = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${getIconCode(statusActivity.emoji.name)}.png`;
    }
   }
  }

  activities = otherActivities.map((activity) => {
   delete activity.party;
   delete activity.instance;
   delete activity.secrets;
   if (activity.assets) {
    (["large_image", "small_image"] as ("large_image" | "small_image")[]).forEach((key) => {
     if (activity.assets && typeof activity.assets[key] === "string" && activity.assets[key].startsWith("spotify:")) {
      activity.assets[key] = spotifyImageToUrl(activity.assets[key]);
     } else if (activity.assets && typeof activity.assets[key] === "string" && activity.assets[key].startsWith("mp:external/")) {
      activity.assets[key] = externalMediaToUrl(activity.assets[key]);
     } else if (activity.assets && typeof activity.assets[key] === "string") {
      activity.assets[key] = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets[key]}.png`;
     } else if (activity.assets) {
      activity.assets[key] = undefined;
     }
    });
   }
   return activity;
  });
 }

 return {
  bot: userData.bot,
  activities: activities,
  customStatus: {
   image: statusEmoji,
   state: statusState,
  },
  status: {
   desktop: userPresences.client_status.desktop,
   mobile: userPresences.client_status.mobile,
   web: userPresences.client_status.web,
  },
  id: BigInt(userData.id),
  username: userData.globalName || userData.username || "Unknown",
  discriminator: userData.discriminator,
  avatar: avatar,
  publicFlags: userData.publicFlags,
  badges: calculateBadges(userData.publicFlags, avatarType),
 };
}
