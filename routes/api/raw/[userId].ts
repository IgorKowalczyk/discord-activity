import { FreshContext } from "$fresh/server.ts";
import { bot } from "../../../bot.ts";
import { fetchUserPresences } from "../../../lib/fetchUserPresences.ts";
import { discordUserId } from "../../../lib/schemas.ts";
import { getUserData } from "../../../lib/getUserData.ts";
import { throwJsonError } from "../../../lib/errors.ts";

export const handler = {
 async GET(_req: Request, { params }: FreshContext) {
  try {
   const id = params.userId;
   if (!discordUserId.safeParse(id).success) return throwJsonError(400, "Please provide a valid user ID!");

   await fetchUserPresences(id);
   const user = await getUserData(id);
   if (!user) return throwJsonError(404, `User not found! Did you join the server? ${Deno.env.get("INVITE_LINK")}`);

   return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
     "Content-Type": "application/json",
    },
   });
  } catch (err) {
   bot.logger.error(err);
   return throwJsonError(500, "Something went wrong while fetching the user data!");
  }
 },
};
