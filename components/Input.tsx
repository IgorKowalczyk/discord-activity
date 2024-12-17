import { forwardRef } from "preact/compat";
import { JSX } from "preact";

export const Input = forwardRef<HTMLInputElement, JSX.HTMLAttributes<HTMLInputElement>>((props, ref) => <input ref={ref} class=" w-full md:max-w-md rounded-lg border border-neutral-800 bg-transparent p-2 font-normal text-white outline-none duration-200 placeholder:text-white/20 focus:border-neutral-700" {...props} />);
