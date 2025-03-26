import type { StatusCode } from "https://deno.land/std@0.216.0/http/status.ts";
import { generateErrorCard } from "./generateCard.ts";

export function throwJsonError(code?: StatusCode, error?: string) {
 return new Response(JSON.stringify({ error: error || "Internal Server Error", status: code || 500 }), {
  status: code || 500,
  headers: {
   "Content-Type": "application/json",
  },
 });
}

export function throwImageError(code?: StatusCode, error?: string) {
 const card = generateErrorCard(error);

 return new Response(card, {
  status: code || 500,
  headers: {
   "Content-Type": "image/svg+xml",
  },
 });
}
