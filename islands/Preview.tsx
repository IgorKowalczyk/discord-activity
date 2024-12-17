import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { cn, useDebounce } from "../lib/utils.ts";

export const CopyIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
 </svg>
);

const availableStyles = [
 {
  name: "card",
  description: "A card with a user's profile picture, username, and bio",
 },
 {
  name: "JSON API",
  description: "Get the raw activity data in JSON format",
 },
] satisfies Array<{ name: string; description: string }>;

export default function Preview({ defaultUrl }: { defaultUrl: string }) {
 const [input, setInput] = useState("");
 const [style, setStyle] = useState<(typeof availableStyles)[number]["name"]>("card");
 const [animate, setAnimate] = useState<boolean>(false);
 const [newStyle, setNewStyle] = useState<string>(style);
 const debouncedInput = useDebounce(input, 500);

 const handleStyleChange = (newStyle: string) => {
  setAnimate(true);
  setTimeout(() => {
   setStyle(newStyle);
   setAnimate(false);
  }, 200);
 };

 const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
 };

 return (
  <div class="grid grid-cols-1 md:grid-cols-5">
   <div class="sticky flex w-full flex-col border-b border-neutral-800 bg-background py-6 md:pr-6 md:col-span-2 md:border-b-0 md:border-r">
    <div class="mb-2 ">
     <h3 class="mb-1 font-medium text-neutral-400">Discord ID:</h3>
     <Input id="input" placeholder="544164729354977282" type="text" value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} />
    </div>
    <div class="mt-1 flex flex-col items-center gap-2">
     {availableStyles.map((style) => (
      <button
       key={style.name}
       class={`mb-2 mr-2 flex-shrink-0 rounded-md border border-neutral-800 p-4 w-full text-left text-white outline-none duration-200 md:w-full ${style.name === newStyle ? "bg-neutral-800/70" : "hover:bg-neutral-800/40"} `}
       onClick={() => {
        setNewStyle(style.name);
        handleStyleChange(style.name);
       }}
      >
       <h3 class="font-medium capitalize tracking-tight">{style.name}</h3>
       <p class="text-sm text-neutral-400">{style.description}</p>
      </button>
     ))}
    </div>
   </div>
   <div class="col-span-1 md:px-6 py-6 md:pr-0 md:col-span-3">
    <div class={`transition-all duration-200 ${animate ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
     {style === "card"
      ? (
       <>
        <h3 class="mb-1 font-medium text-neutral-400">Preview:</h3>
        {debouncedInput ? <img src={`${defaultUrl}/api/${debouncedInput}`} alt="Card" class="w-[408px] h-[197px]" /> : <img src="/example.png" alt="Example card" class="w-[408px] h-[197px]" />}
        <h3 class="mt-6 font-medium text-neutral-400">
         URL
        </h3>
        <div class="relative flex flex-row gap-2 overflow-hidden rounded-lg bg-neutral-800 p-4">
         <pre class="overflow-hidden whitespace-nowrap font-mono text-sm text-white">
         <code>
          {defaultUrl}/api/{debouncedInput || ""}
         </code>
         </pre>
         <div class="absolute right-0 top-0 flex h-full items-center bg-gradient-to-r from-transparent via-neutral-800 to-neutral-800 p-2 pl-8">
          <Button variant="secondary" onClick={() => handleCopy(`${defaultUrl}/api/${debouncedInput}`)} disabled={!input} className="px-2">
           <CopyIcon />
          </Button>
         </div>
        </div>
       </>
      )
      : (
       <>
        <h3 class="mb-1 font-medium text-neutral-400">JSON:</h3>
        <div class="relative flex flex-row gap-2 overflow-hidden rounded-lg bg-neutral-800 p-4">
         <pre class="overflow-hidden whitespace-nowrap font-mono text-sm text-white">
         <code>
          {defaultUrl}/api/raw/{debouncedInput}
         </code>
         </pre>
         <div class="absolute right-0 top-0 flex h-full items-center bg-gradient-to-r from-transparent via-neutral-800 to-neutral-800 p-2 pl-8">
          <Button variant="secondary" onClick={() => handleCopy(`${defaultUrl}/api/raw/${debouncedInput}`)} disabled={!input} className="px-2">
           <CopyIcon />
          </Button>
         </div>
        </div>

        <a href={`${defaultUrl}/api/raw/${debouncedInput}`} target="_blank" rel="noopener noreferrer" class={cn("flex mt-4 duration-200", !debouncedInput && "opacity-0")}>
         <Button variant="primary">Open in new tab</Button>
        </a>
       </>
      )}
    </div>
   </div>
  </div>
 );
}
