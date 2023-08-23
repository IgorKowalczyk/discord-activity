export function shortenText(text: string, count = 30) {
 return text.slice(0, count) + (text.length > count ? "..." : "");
}
