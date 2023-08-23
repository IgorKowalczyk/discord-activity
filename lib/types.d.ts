import type { DiscordActivity, PresenceStatus } from "https://deno.land/x/discordeno@13.0.0/types/mod.ts";

export interface User {
 bot: boolean;
 activities: DiscordActivity[] | undefined;
 avatar: string;
 id: bigint;
 username: string;
 discriminator: string;
 tag: string;
 createdAt: Date;
 joinedAt: Date;
 premiumSince: Date | null;
 premiumSinceTimestamp: number | null;
 publicFlags: number;
 badges: string[];
 options: {
  backgroundColor: string;
  borderRadius: number;
  idleMessage: string;
  hideStatus: boolean;
 };
 status: {
  desktop: PresenceStatus | undefined;
  mobile: PresenceStatus | undefined;
  web: PresenceStatus | undefined;
 };
 customStatus: {
  image: string | null;
  state: string | null;
 };
}
