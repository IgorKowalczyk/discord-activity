export function Logger(type: string, ...args: string[]) {
 return console.log(type + " " + ("- " + args.join(" ")));
}
