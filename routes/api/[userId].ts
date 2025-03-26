import { FreshContext } from "$fresh/server.ts";
import { fetchUserPresences } from "../../lib/fetchUserPresences.ts";
import { cardOptions, discordUserId } from "../../lib/schemas.ts";
import { getUserData } from "../../lib/getUserData.ts";
import { throwImageError } from "../../lib/errors.ts";
import { generateCard } from "../../lib/generateCard.ts";
import { apiLogger } from "../../lib/logger.ts";

export const handler = {
 async GET(req: Request, { params }: FreshContext) {
  try {
   const id = params.userId;
   const url = new URL(req.url);
   const queryOptions = url.searchParams;
   const options = cardOptions.safeParse(queryOptions);

   if (!discordUserId.safeParse(id).success) return throwImageError(400, "Please provide a valid user ID!");
   if (!options.success) return throwImageError(400, "Please provide valid query parameters!");

   await fetchUserPresences(id);
   const userData = await getUserData(id);
   if (!userData) return throwImageError(404, `User not found! Did you join the server? ${Deno.env.get("INVITE_LINK")}`);

   const image = await generateCard(userData, options.data);

   return new Response(image, {
    status: 200,
    headers: {
     "Content-Type": "image/svg+xml",
    },
   });
  } catch (error) {
   apiLogger.error(error);
   return throwImageError(500, "Something went wrong while generating the user card!");
  }
 },
};
