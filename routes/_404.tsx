import { Head } from "$fresh/runtime.ts";
import { Button } from "../components/Button.tsx";
import { Header } from "../components/Header.tsx";

export default function Error404() {
 return (
  <>
   <Head>
    <title>404 - Page not found</title>
   </Head>
   <section class="max-w-screen-md mx-auto px-4 py-8  flex flex-col items-center justify-center">
    <Header>404 - Page not found</Header>
    <p class="mt-2 text-lg text-neutral-400">This page does not exist!</p>
    <div class="mt-2 flex items-center justify-center">
     <a href="/">
      <Button variant="primary">Go back to home</Button>
     </a>
    </div>
   </section>
  </>
 );
}
