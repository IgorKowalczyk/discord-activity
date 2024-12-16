export const base64ImageFetcher = async (url: string) => {
 try {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Invalid URL - Failed to fetch image");
  const blob = await res.blob();
  if (!blob.type.startsWith("image")) throw new Error("Failed to process blob");
  const buffer = await blob.arrayBuffer();
  const binary = new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "");
  return `data:${blob.type};base64,${btoa(binary)}`;
 } catch (e) {
  throw new Error(`Failed to fetch image: ${e}`);
 }
};
