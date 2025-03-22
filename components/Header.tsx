import { forwardRef } from "preact/compat";
import { JSX } from "preact";
import { cn } from "../lib/utils.ts";

export const Header = forwardRef<HTMLHeadingElement, JSX.HTMLAttributes<HTMLHeadingElement>>(({ children, className, ...props }, ref) => (
 <h1 ref={ref} className={cn("relative m-0 text-3xl font-black tracking-[-0.03em] text-white duration-300", className)} {...props}>
  {children}
 </h1>
));
