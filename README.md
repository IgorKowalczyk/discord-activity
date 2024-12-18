![Discord Activity](https://github.com/IgorKowalczyk/discord-activity/assets/49127376/b90fdb11-ede2-4155-a56c-fdded6699d0e)

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
 <br/>
 <b>🦕 This is a <a href="https://deno.com">Deno runtime</a> application that generates Discord profile cards, presenting users' activity and presence. Using the Discord API via the <a href="https://deno.land/x/discordeno">Discordeno</a> library, the app serves user cards in SVG format.</b>
</div>

---

## 📷 How it looks

![Example image](https://github.com/IgorKowalczyk/discord-activity/assets/49127376/d617abbb-aa2d-4e72-aa80-01c8b9e0c3a3)

> [!IMPORTANT]
> Current Nitro & Boosting badges do not work due to Discord API limitations, unless you currently have an animated avatar then the Nitro badge will be displayed correctly.

## ✨ Features

- ✅ Generate user cards with user presence and activities.
- 🎨 Customize user card appearance by providing query parameters.
- 🌐 RESTful API to fetch user data and generate user cards.
- 🚀 Error handling for various scenarios.
- 🔒 No data tracking and no database required.

## 🚀 Getting Started

**Join our [Discord Server](https://igorkowalczyk.dev/discord)**, without this you will not be able to use the website, Discord bot have to watch your profile and activities for this to work.

> [!IMPORTANT]
> If you leave the Discord server, the bot will no longer be able to watch your profile and activities, so the user card will not be generated.

Then, in your browser, **go to `https://discord-activity.deno.dev/api/:userId` and replace `:userId` with your Discord user ID**.

**You will be shown a user card with your presence and activities.** If you want to customize the appearance of the user card, you can do so by providing query parameters to the URL which are described in the [Customizations](#-customizations) section.

> [!NOTE]
> If you don't know your Discord user ID, go to your Discord settings, then to the "Advanced" tab, scroll down and enable "Developer Mode". Then right-click on your profile and click "Copy ID".
>
> You can also get raw user data in JSON format by going to `https://discord-activity.deno.dev/api/raw/:userId` and replacing `:userId` with your Discord user ID.

## 📚 API Endpoints

- `/api/:userId`: Generate a user card image with customizable appearance.
- `/api/raw/:userId`: Get raw user data in JSON format.
- `/badges/:badge`: Get a Discord badge image by name.

## 🎨 Customizations

> [!NOTE]
> You can customize the appearance of the user card by providing query parameters to the `/api/:userId` endpoint.

| Parameter          | Description                               | Default                           |
| ------------------ | ----------------------------------------- | --------------------------------- |
| `bgColor`          | Background color of the user card.        | `#161a23`                         |
| `borderRadius`     | Border radius of the user card.           | `10`                              |
| `idleMessage`      | Message to display when the user is idle. | `There is nothing going on here!` |
| `hideStatus`       | Hide the status of the user.              | `false`                           |
| `hideCustomStatus` | Hide the custom status of the user.       | `false`                           |
| `hideBadges`       | Hide the badges of the user.              | `false`                           |

> [!WARNING]
> The `bgColor` parameter must be a hexadecimal color code without the `#` symbol. For example, `#161a23` should be `161a23`.

#### 🚀 Example

**URL**

```http
GET https://discord-activity.deno.dev/api/544164729354977282?bgColor=1b1c1e&borderRadius=0&idleMessage=I'm not doing anything&hideStatus=true
```

**Query Parameters**

```yaml
bgColor: "1b1c1e"
borderRadius: 0
idleMessage: "I'm not doing anything"
hideStatus: true
```

**Result**

![Generated Image](https://github.com/IgorKowalczyk/discord-activity/assets/49127376/b2dda27f-24fe-4641-99d6-bff3f53bb2f5)

## 🔩 Self Hosting

1. Clone [this repository](https://github.com/igorkowalczyk/discord-activity) `git clone https://github.com/IgorKowalczyk/discord-activity`
2. Fill environment variables in the `.env` file (see [Environment Variables](#-environment-variables))
3. Run `deno task dev` to start the project in development mode or `deno task start` to run the project in production mode.
4. Visit `http://localhost:8080` in your browser

> [!NOTE]
> Deno will automatically install all the project packages on the first run

## 🔩 Hosting with Deno Deploy

1. Fork [this repository](https://github.com/igorkowalczyk/discord-activity)
2. Create a new project on [Deno Deploy](https://deno.com/deploy)
3. Connect your forked repository to the project
4. Click on the `Deploy` button
5. Fill environment variables in the project settings (see [Environment Variables](#-environment-variables))
6. Visit the generated URL in your browser

## 📝 Environment Variables

| Variable      | Description                                                                                         | Default | Required |
| ------------- | --------------------------------------------------------------------------------------------------- | ------- | -------- |
| `TOKEN`       | Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications). |         | ✅       |
| `GUILD_ID`    | Discord Guild ID where the bot will watch the users.                                                |         | ✅       |
| `INVITE_LINK` | Discord server invite link where the bot is located.                                                |         | ✅       |
| `PORT`        | Port on which the application will be running.                                                      | `3000`  | ❌       |

> [!NOTE]
> You can see the `.env.example` file for an example of how to fill in the environment variables.

> [!WARNING]
> In Deno Deploy, the `PORT` variable is not required, because the port is assigned automatically!

## ⁉️ Issues

If you come across any errors or have suggestions for improvements, please create a [new issue here](https://github.com/igorkowalczyk/discord-activity/issues) and describe it clearly.

## 📥 Pull Requests

When submitting a pull request, please follow these steps:

- Clone [this repository](https://github.com/igorkowalczyk/discord-activity) `https://github.com/IgorKowalczyk/discord-activity.git`
- Create a branch from `main` and give it a meaningful name (e.g. `my-awesome-new-feature`).
- Open a [pull request](https://github.com/igorkowalczyk/discord-activity/pulls) on [GitHub](https://github.com/) and clearly describe the feature or fix you are proposing.

## 📋 License

This project is licensed under the MIT. See the [LICENSE](https://github.com/igorkowalczyk/discord-activity/blob/main/license.md) file for details
