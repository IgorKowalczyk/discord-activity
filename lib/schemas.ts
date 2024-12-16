import { z } from "zod";
import type { User as DiscordUser } from "@discordeno/bot";
import type { DiscordActivity, DiscordPresenceUpdate } from "npm:@discordeno/types@20.0.0";

export const discordUserId = z.string().regex(/^\d{17,19}$/);

export const hexcolorRegex = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;

export const cardOptions = z.object({
 backgroundColor: z
  .string()
  .optional()
  .refine(
   (value = "") => {
    if (!value.startsWith("#")) value = `#${value}`;
    return hexcolorRegex.test(value);
   },
   {
    message: "Invalid hex color code",
   }
  )
  .transform((value = "") => {
   if (!value.startsWith("#")) value = `#${value}`;
   return value;
  })
  .default("#161a23"),
 borderRadius: z.string().optional().default("10"),
 idleMessage: z.string().optional().default("There is nothing going on right now..."),
 hideStatus: z
  .string()
  .optional()
  .default("false")
  .transform((value) => value === "true"),
});

export type cardOptionsSchema = z.infer<typeof cardOptions>;

export type UserActivity = Omit<DiscordActivity, "party" | "instance" | "secrets">;

export interface User {
 username: DiscordUser["globalName"] | DiscordUser["username"] | "Unknown";
 id: DiscordUser["id"];
 bot: DiscordUser["bot"];
 activities: UserActivity[];
 avatar: string;
 discriminator: DiscordUser["discriminator"];
 publicFlags: DiscordUser["publicFlags"];
 badges: string[];
 status: {
  desktop: DiscordPresenceUpdate["client_status"]["desktop"];
  mobile: DiscordPresenceUpdate["client_status"]["mobile"];
  web: DiscordPresenceUpdate["client_status"]["web"];
 };
 customStatus: {
  image: string | null;
  state: string | null;
 };
}
