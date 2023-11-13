function toCodePoint(unicodeSurrogates: string) {
 const r = [];
 let c = 0;
 let p = 0;
 let i = 0;

 while (i < unicodeSurrogates.length) {
  c = unicodeSurrogates.charCodeAt(i++);
  if (p) {
   r.push((65536 + ((p - 55296) << 10) + (c - 56320)).toString(16));
   p = 0;
  } else if (c >= 55296 && c <= 56319) {
   p = c;
  } else {
   r.push(c.toString(16));
  }
 }
 return r.join("-");
}

export function getIconCode(char: string) {
 return toCodePoint(char.indexOf(String.fromCharCode(8205)) < 0 ? char.replace(/\uFE0F/g, "") : char);
}
