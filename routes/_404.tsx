import { Head } from "$fresh/runtime.ts";
import { buttonVariants } from "../components/Button.tsx";
import { Header } from "../components/Header.tsx";

export default function Error404() {
 return (
  <>
   <Head>
    <title>404 - Page not found</title>
   </Head>
   <section className="flex h-screen flex-col items-center justify-center">
    <Header>404 - Page not found</Header>
    <p className="mt-2 text-lg text-neutral-400">This page does not exist!</p>
    <div className="mt-6 flex items-center justify-center">
     <a href="/" className={buttonVariants({ variant: "primary" })}>
      Go back to home
     </a>
    </div>
   </section>
  </>
 );
}
