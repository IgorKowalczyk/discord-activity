import { bot } from "../index.ts";

export function addDesiredProperties(client: typeof bot) {
 client.transformers.desiredProperties.user.accentColor = true;
 client.transformers.desiredProperties.user.avatar = true;
 client.transformers.desiredProperties.user.banner = true;
 client.transformers.desiredProperties.user.toggles = true;
 client.transformers.desiredProperties.user.discriminator = true;
 //client.transformers.desiredProperties.user.email = true;
 client.transformers.desiredProperties.user.flags = true;
 client.transformers.desiredProperties.user.globalName = true;
 client.transformers.desiredProperties.user.id = true;
 //client.transformers.desiredProperties.user.locale = true;
 // client.transformers.desiredProperties.user.mfaEnabled = true;
 client.transformers.desiredProperties.user.premiumType = true;
 client.transformers.desiredProperties.user.publicFlags = true;
 //client.transformers.desiredProperties.user.system = true;
 client.transformers.desiredProperties.user.username = true;
 //client.transformers.desiredProperties.user.verified = true;
}
