import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "preact/compat";
import { JSX } from "preact";
import { cn } from "../lib/utils.ts";

export const buttonVariants = cva("rounded-md px-4 py-2 cursor-pointer font-medium duration-200 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none", {
 variants: {
  variant: {
   primary: "bg-blue-500 text-white hover:bg-blue-600",
   secondary: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
  },
  defaultVariants: {
   variant: "primary",
  },
 },
});

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
 variant?: VariantProps<typeof buttonVariants>["variant"];
 disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant, className, children, ...props }, ref) => {
 return (
  <button ref={ref} {...props} className={cn(buttonVariants({ variant }), className)}>
   {children}
  </button>
 );
});
