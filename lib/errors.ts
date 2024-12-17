import { generateErrorCard } from "./generateCard.ts";

/**
 * Throws a JSON error response.
 */
export function throwJsonError(code?: number, error?: string) {
 return new Response(JSON.stringify({ error: error || "Internal Server Error", status: code || 500 }), {
  status: code || 500,
  headers: {
   "Content-Type": "application/json",
  },
 });
}

/**
 * Throws an image error response.
 */
export function throwImageError(code?: number, error?: string) {
 const card = generateErrorCard(error);

 return new Response(card, {
  status: code || 500,
  headers: {
   "Content-Type": "image/svg+xml",
  },
 });
}
