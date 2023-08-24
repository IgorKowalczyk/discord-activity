import { Activity } from "https://deno.land/x/discordeno@13.0.0/mod.ts";

export interface User {
 bot: boolean;
 activities: Activity[] | undefined;
 avatar: string;
 id: bigint;
 username: string;
 discriminator: string;
 publicFlags: number;
 badges: string[];
 options: {
  backgroundColor: string;
  borderRadius: number;
  idleMessage: string;
  hideStatus: boolean;
 };
 status: {
  desktop: string | undefined;
  mobile: string | undefined;
  web: string | undefined;
 };
 customStatus: {
  image: string | undefined;
  state: string | undefined;
 };
}
