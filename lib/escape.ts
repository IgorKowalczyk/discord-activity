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
