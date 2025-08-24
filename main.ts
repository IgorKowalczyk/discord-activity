import { App, staticFiles } from "fresh";
import { State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());
app.fsRoutes();
