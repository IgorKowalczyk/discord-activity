import { HttpError, PageProps } from "fresh";
import { buttonVariants } from "../components/Button.tsx";
import { Header } from "../components/Header.tsx";

export default function ErrorPage(props: PageProps) {
 const error = props.error;

 if (error instanceof HttpError) {
  if (error.status === 404) {
   return (
    <section className="flex h-screen flex-col items-center justify-center">
     <Header>404 - Page not found</Header>
     <p className="mt-2 text-lg text-neutral-400">This page does not exist!</p>
     <div className="mt-6 flex items-center justify-center">
      <a href="/" className={buttonVariants({ variant: "primary" })}>
       Go back to home
      </a>
     </div>
    </section>
   );
  }
  if (error.status === 500) {
   return (
    <section className="flex h-screen flex-col items-center justify-center">
     <Header>500 - Internal Server Error</Header>
     <p className="mt-2 text-lg text-neutral-400">Something went wrong on our end.</p>
     <div className="mt-6 flex items-center justify-center">
      <a href="/" className={buttonVariants({ variant: "secondary" })}>
       Go back to home
      </a>
     </div>
    </section>
   );
  }
 }

 return (
  <section className="flex h-screen flex-col items-center justify-center">
   <Header>Error</Header>
   <p className="mt-2 text-lg text-neutral-400">An unexpected error occurred.</p>
   <div className="mt-6 flex items-center justify-center">
    <a href="/" className={buttonVariants({ variant: "secondary" })}>
     Go back to home
    </a>
   </div>
  </section>
 );
}
