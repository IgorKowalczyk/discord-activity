export function Logger(type: string, ...args: string[]) {
 return type + " " + ("- " + args.join(" "));
}
