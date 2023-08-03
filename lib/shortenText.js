export function shortenText(text, count = 30) {
 return text.slice(0, count) + (text.length > count ? "..." : "");
}
