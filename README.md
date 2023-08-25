![Discord Activity](https://github.com/IgorKowalczyk/discord-activity/assets/49127376/6e6cbe6e-22f8-4190-aabf-e4e0f9c213be)

<div align="center">
 <a aria-label="Powered by" href="https://deno.com">
  <img src="https://img.shields.io/static/v1?label=Powered%20by&message=Deno&color=blue&logo=deno"/>
 </a>
 <a aria-label="Github License" href="https://github.com/igorkowalczyk/discord-activity/blob/main/license.md">
  <img src="https://img.shields.io/github/license/igorkowalczyk/discord-activity?color=blue&logo=github&label=License"/>
 </a>
 <a aria-label="Version" href="https://github.com/igorkowalczyk/discord-activity/releases">
  <img src="https://img.shields.io/github/v/release/igorkowalczyk/discord-activity?color=blue&logo=github&label=Version"/>
 </a>
</div>

---

🦕 This is a [Deno runtime](https://deno.com) app that generates user cards for Discord users, showcasing their presence and activities. The application integrates with the Discord API using the [Discordeno](https://deno.land/x/discordeno) library and serves user card images as SVG using [Satori](https://github.com/vercel/satori).

## ✨ Features

- Generate user cards with user presence and activities.
- Customize user card appearance by providing query parameters.
- RESTful API to fetch user data and generate user cards.
- Error handling for various scenarios.
- No data tracking and no database required.

## 🚀 Getting Started

**Join our [Discord Server](https://discord.gg/bVNNHuQ)**, without this you will not be able to use the website, Discord bot have to watch your profile and activities for this to work.

> [!IMPORTANT]
> If you leave the Discord server, the bot will no longer be able to watch your profile and activities, so the user card will not be generated.

Then, in your browser, **go to `https://discord-activity.deno.dev/api/:userId` and replace `:userId` with your Discord user ID**.

**You will be shown a user card with your presence and activities.** If you want to customize the appearance of the user card, you can do so by providing query parameters to the URL which are described in the [Customizations](#-customizations) section.

> [!NOTE]
> If you don't know your Discord user ID, go to your Discord settings, then to the "Advanced" tab, scroll down and enable "Developer Mode". Then right-click on your profile and click "Copy ID". You can also get raw user data in JSON format by going to `https://discord-activity.deno.dev/api/raw/:userId` and replacing `:userId` with your Discord user ID.

## 📚 API Endpoints

- `/api/:userId`: Generate a user card image with customizable appearance.
- /api/raw/:userId`: Get raw user data in JSON format.
