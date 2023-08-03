BigInt.prototype.toJSON = function () {
 return this.toString();
};

/**
 * @param {*} publicFlags Public flags of user
 * @returns  {Array} Array of badges
 */
export function calculateBadges(publicFlags, avatarType) {
 const badges = [];

 if (publicFlags & 1 << 0) {
  badges.push("STAFF");
 }

 if (publicFlags & 1 << 1) {
  badges.push("PARTNER");
 }

 if (publicFlags & 1 << 2) {
  badges.push("HYPESQUAD_EVENTS");
 }

 if (publicFlags & 1 << 3) {
  badges.push("BUG_HUNTER_LEVEL_1");
 }

 if (publicFlags & 1 << 6) {
  badges.push("HYPESQUAD_BRAVERY");
 }

 if (publicFlags & 1 << 7) {
  badges.push("HYPESQUAD_BRILLIANCE");
 }

 if (publicFlags & 1 << 8) {
  badges.push("HYPESQUAD_BALANCE");
 }

 if (publicFlags & 1 << 9) {
  badges.push("EARLY_SUPPORTER");
 }

 if (publicFlags & 1 << 14) {
  badges.push("BUG_HUNTER_LEVEL_2");
 }

 if (publicFlags & 1 << 17) {
  badges.push("VERIFIED_DEVELOPER");
 }

 if (publicFlags & 1 << 18) {
  badges.push("CERTIFIED_MODERATOR");
 }

 if (publicFlags & 1 << 22) {
  badges.push("ACTIVE_DEVELOPER");
 }

 if (avatarType === "gif") {
  badges.push("NITRO");
 }

 return badges;
}

/**
 * Returns user data from Discord API
 * @param {*} client
 * @param {*} id
 * @returns {Object}
 */
export async function getUserData(client, id, cache) {
 const userData = await client.helpers.getUser(id);
 if (!userData) {
  return {
   status: 404,
   message: "User not found! You have to join our Discord server first!",
  };
 }
 if (userData.bot) return { status: 400, message: "Bots are not allowed!" };
 const userPresences = cache.presences.get(userData.id);

 const avatarHash = userData.avatar.toString(16).startsWith("a") ? "a_" + userData.avatar.toString(16).slice(1) : userData.avatar.toString(16).slice(1);
 const avatar = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${avatarHash}.${avatarHash ? "gif" : "png"}` : `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`;

 return {
  activities: userPresences && userPresences.activities,
  status: {
   desktop: userPresences && userPresences?.desktop,
   mobile: userPresences && userPresences?.mobile,
   web: userPresences && userPresences?.web,
  },
  user: {
   id: userData.id.toString(),
   username: userData.username,
   discriminator: userData.discriminator,
   avatar: avatar,
   tag: userData.tag,
   createdAt: userData.createdAt,
   joinedAt: userData.joinedAt,
   premiumSince: userData.premiumSince,
   premiumSinceTimestamp: userData.premiumSinceTimestamp,
   flags: userData.publicFlags,
   badges: calculateBadges(userData.publicFlags, userData.avatar.toString(16).startsWith("a") ? "gif" : "png"),
  },
 };
}
