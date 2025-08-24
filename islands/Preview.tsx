import { useState } from "preact/hooks";
import { Button, buttonVariants } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { cn, useDebounce } from "../lib/utils.ts";

export const Clipboard = ({ className }: { className?: string }) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}>
  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
 </svg>
);

export const ClipboardCheck = ({ className }: { className?: string }) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}>
  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  <path d="m9 14 2 2 4-4" />
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
 const [animateCopy, setAnimateCopy] = useState<boolean>(false);
 const [newStyle, setNewStyle] = useState<string>(style);
 const debouncedInput = useDebounce(input, 500);

 const handleStyleChange = (newStyle: string) => {
  setAnimate(true);
  setAnimateCopy(false);

  setTimeout(() => {
   setStyle(newStyle);
   setAnimate(false);
  }, 200);
 };

 const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  setAnimateCopy(true);

  const timer = setTimeout(() => setAnimateCopy(false), 1000);
  return () => clearTimeout(timer);
 };

 return (
  <div className="grid grid-cols-1 md:grid-cols-5">
   <div className="sticky flex w-full flex-col border-b border-neutral-800 bg-[#121212] p-6 md:col-span-2 md:border-b-0 md:border-r">
    <div className="mb-2 ">
     <h3 className="mb-1 font-medium text-neutral-400">Discord ID:</h3>
     <Input id="input" placeholder="544164729354977282" type="text" value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} />
    </div>
    <div className="mt-1 flex flex-col items-center gap-2">
     {availableStyles.map((style) => (
      <button
       key={style.name}
       type="button"
       className={`mb-2 mr-2 shrink-0 cursor-pointer rounded-md border border-neutral-800 focus:bg-neutral-800 p-4 w-full text-left text-white outline-hidden duration-200 md:w-full ${style.name === newStyle ? "bg-neutral-800/70" : "hover:bg-neutral-800/40"} `}
       onClick={() => {
        setNewStyle(style.name);
        handleStyleChange(style.name);
       }}
      >
       <h3 className="font-medium capitalize tracking-tight">{style.name}</h3>
       <p className="text-sm text-neutral-400">{style.description}</p>
      </button>
     ))}
    </div>
   </div>
   <div className="col-span-1 p-6 md:col-span-3">
    <div className={`transition-all duration-200 ${animate ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
     {style === "card"
      ? (
       <>
        <h3 className="font-medium mb-1 text-neutral-400">
         URL
        </h3>
        <div className="relative flex flex-row gap-2 overflow-hidden rounded-lg bg-neutral-800 p-4">
         <pre className="overflow-hidden whitespace-nowrap font-mono text-sm text-white">
         <code>
          {defaultUrl}api/{debouncedInput || ""}
         </code>
         </pre>
         <div className="absolute right-0 top-0 flex h-full items-center bg-linear-to-r from-transparent via-neutral-800 to-neutral-800 p-2 pl-8">
          <Button variant="secondary" onClick={() => handleCopy(`${defaultUrl}api/${debouncedInput}`)} disabled={!input} className="relative py-4 size-6">
           <Clipboard className={cn("size-4 mx-auto mt-2 inset-0 absolute transition duration-200", animateCopy && "opacity-0")} />
           <ClipboardCheck className={cn("size-4 mx-auto mt-2 inset-0 absolute transition-acity duration-200", !animateCopy && "opacity-0 ")} />
          </Button>
         </div>
        </div>
        <h3 className="mb-1 mt-6 font-medium text-neutral-400">Preview:</h3>
        {debouncedInput ? <img src={`${defaultUrl}api/${debouncedInput}`} alt="Card" className="w-[408px] h-[197px]" /> : <img src="/example.png" alt="Example card" className="w-[408px] h-[197px]" />}
       </>
      )
      : (
       <>
        <h3 className="mb-1 font-medium text-neutral-400">JSON:</h3>
        <div className="relative flex flex-row gap-2 overflow-hidden rounded-lg bg-neutral-800 p-4">
         <pre className="overflow-hidden whitespace-nowrap font-mono text-sm text-white">
         <code>
          {defaultUrl}api/raw/{debouncedInput}
         </code>
         </pre>
         <div className="absolute right-0 top-0 flex h-full items-center bg-linear-to-r from-transparent via-neutral-800 to-neutral-800 p-2 pl-8">
          <Button variant="secondary" onClick={() => handleCopy(`${defaultUrl}api/raw/${debouncedInput}`)} disabled={!input} className="relative py-4 size-6">
           <Clipboard className={cn("size-4 mx-auto mt-2 inset-0 absolute transition duration-200", animateCopy && "opacity-0")} />
           <ClipboardCheck className={cn("size-4 mx-auto mt-2 inset-0 absolute transition-acity duration-200", !animateCopy && "opacity-0 ")} />
          </Button>
         </div>
        </div>

        <a href={`${defaultUrl}api/raw/${debouncedInput}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "primary" }), "mt-4 flex w-fit", !debouncedInput && "opacity-0")}>
         Open in new tab
        </a>
       </>
      )}
    </div>
   </div>
  </div>
 );
}
