import { Header } from "../components/Header.tsx";
import { Button } from "../components/Button.tsx";
import Preview from "../islands/Preview.tsx";
import { FreshContext } from "$fresh/server.ts";

export default function Home(ctx: FreshContext) {
 return (
  <>
   <section class="relative grid w-full grid-cols-1 gap-x-4 overflow-hidden border-x border-b border-neutral-800 p-6 lg:grid-cols-2 lg:p-12">
    <div class="flex flex-col items-start justify-center lg:col-span-1">
     <Header id="main">Discord Activity</Header>
     <p class="mt-2 text-lg text-neutral-400">API for displaying Discord activity data in JSON or SVG</p>
     <div class="mt-4 flex items-center justify-center gap-4">
      <a href="/docs">
       <Button variant="primary">Documentation</Button>
      </a>
      <a href="/discord" target="_blank">
       <Button variant="secondary">Join Discord</Button>
      </a>
     </div>
    </div>
    <div class="items-center justify-center md:flex hidden lg:col-span-1">
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="aspect-square rounded-full size-52 stroke-white ">
      <path d="M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z" />
      <path d="M8 13v9" />
      <path d="M16 22v-9" />
      <path d="m9 6 1 7" />
      <path d="m15 6-1 7" />
      <path d="M12 6V2" />
      <path d="M13 2h-2" />
     </svg>
    </div>
   </section>
   <section class="border-x border-b border-neutral-800 px-6" id="preview">
    <Preview defaultUrl={ctx.url.origin} />
   </section>
  </>
 );
}
