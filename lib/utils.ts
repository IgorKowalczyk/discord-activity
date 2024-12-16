/**
 * Shorten the text to a certain length
 */
export function shortenText(text: string, count = 30) {
 return text.slice(0, count) + (text.length > count ? "..." : "");
}

/**
 * Convert unicode surrogates to code points
 */
export function toCodePoint(unicodeSurrogates: string) {
 const codePoints = [];
 let currentChar = 0;
 let surrogatePair = 0;
 let index = 0;

 while (index < unicodeSurrogates.length) {
  currentChar = unicodeSurrogates.charCodeAt(index++);
  if (surrogatePair) {
   codePoints.push((65536 + ((surrogatePair - 55296) << 10) + (currentChar - 56320)).toString(16));
   surrogatePair = 0;
  } else if (currentChar >= 55296 && currentChar <= 56319) {
   surrogatePair = currentChar;
  } else {
   codePoints.push(currentChar.toString(16));
  }
 }
 return codePoints.join("-");
}

/**
 * Get the unicode code of the icon
 */
export function getIconCode(char: string) {
 return toCodePoint(char.indexOf(String.fromCharCode(8205)) < 0 ? char.replace(/\uFE0F/g, "") : char);
}

/**
 * Escape HTML entities
 */
export function escape(text: string): string {
 const entity: { [char: string]: string } = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&#39;",
  '"': "&#34;",
 };

 return text.replaceAll(/[&<>"']/g, (char) => {
  return entity[char];
 });
}
