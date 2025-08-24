import { Builder } from "fresh/dev";
import { tailwind } from "@fresh/plugin-tailwind";

const builder = new Builder();

tailwind(builder);

if (Deno.args.includes("build")) {
 await builder.build();
} else {
 await builder.listen(() => import("./main.ts"));
}
