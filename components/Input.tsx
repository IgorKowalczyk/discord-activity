import { forwardRef } from "preact/compat";
import { JSX } from "preact";
import { cn } from "../lib/utils.ts";

export const Input = forwardRef<HTMLInputElement, JSX.HTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} className={cn("w-full md:max-w-md rounded-lg border border-neutral-800 bg-transparent p-2 font-normal text-white outline-hidden duration-200 placeholder:text-white/20 focus:border-neutral-700", className)} {...props} />);
