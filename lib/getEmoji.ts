const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;

function toCodePoint(unicodeSurrogates: string) {
 const r = [];
 let c = 0,
  p = 0,
  i = 0;

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
 return toCodePoint(char.indexOf(U200D) < 0 ? char.replace(UFE0Fg, "") : char);
}
