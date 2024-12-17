import { forwardRef } from "preact/compat";
import { JSX } from "preact";

export const Header = forwardRef<HTMLHeadingElement, JSX.HTMLAttributes<HTMLHeadingElement>>(({ children, ...rest }, ref) => (
 <h1 ref={ref} class="relative m-0 text-3xl font-black tracking-[-0.03em] text-white duration-300" {...rest}>
  {children}
 </h1>
));
