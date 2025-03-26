import type { User, UserActivity } from "./schemas.ts";
import type { cardOptionsSchema } from "./schemas.ts";
import { escape, shortenText } from "./utils.ts";
import { base64ImageFetcher } from "./base64ImageFetcher.ts";
import { ActivityTypes } from "npm:@discordeno/types@20.0.0";
import { apiLogger } from "../lib/logger.ts";

const availableStatuses: Record<string, string> = {
 online: "#43B581",
 idle: "#FAA61A",
 dnd: "#F04747",
 offline: "#747F8D",
};

async function generateBadgeImages(badges: string[]) {
 const userBadges = new Map<string, string>();

 for (const badge of badges) {
  try {
   const filePath = `./static/badges/${badge.toLowerCase()}.png`;
   const fileData = await Deno.readFile(filePath);
   const base64Image = `data:image/png;base64,${btoa(String.fromCharCode(...fileData))}`;
   userBadges.set(badge, base64Image);
  } catch {
   apiLogger.error(`Failed to load badge image: ${badge}`);
   userBadges.set(badge, "");
  }
 }

 return badges
  .map(
   (badge) => `
        <img
          src="${userBadges.get(badge) || ""}"
          alt="${escape(badge)}"
          width="24px"
          height="24px"
          style="margin-left: 4px;"
        />
      `,
  )
  .join("");
}

async function generateActivityDetails(activity: UserActivity | null) {
 if (!activity) return "";

 const activityImage = activity.assets?.large_image
  ? `<img
         style="border-radius: 10px;"
         src="${await base64ImageFetcher(activity.assets.large_image)}"
         alt="${escape(activity.assets.large_text || "Activity Image")}"
         width="82px"
         height="82px"
       />`
  : "";

 let activityType = "Unknown";

 if (activity.type === ActivityTypes.Playing) {
  activityType = "Playing ";
 } else if (activity.type === ActivityTypes.Streaming) {
  activityType = "Streaming ";
 } else if (activity.type === ActivityTypes.Listening) {
  activityType = "Listening to Spotify...";
 } else if (activity.type === ActivityTypes.Watching) {
  activityType = "Watching ";
 } else if (activity.type === ActivityTypes.Competing) {
  activityType = "Competing in ";
 }

 return `
    <div style="display: flex; flex-direction: column; margin-top: 12px; font-weight: 700; color: #fff;">
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
        <div style="display: flex; position: relative; flex-direction: column; margin-right: 4px;">
          ${activityImage}
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; margin-left: 8px;">
          <span style="font-size: 1.15rem; font-weight: 700; color: ${activity.type === ActivityTypes.Listening ? "#1CB853" : "#fff"};">${activityType}${shortenText(escape(activity.name || ""), 32)}</span>
          ${activity.details ? `<span style="font-weight: 400; color: #fff; opacity: 0.5;">${shortenText(escape(activity.details), 80)}</span>` : ""}
          ${activity.state ? `<span style="font-weight: 400; color: #fff; opacity: 0.5;">${activity.type === ActivityTypes.Listening ? "By " : ""}${shortenText(escape(activity.state), 32)}</span>` : ""}
        </div>
      </div>
    </div>
  `;
}

export async function generateCard(user: User, options: cardOptionsSchema): Promise<string> {
 try {
  const userAvatar = await base64ImageFetcher(user.avatar);

  const firstActivity = user.activities[0] || null;
  const userName = shortenText(escape(user.username || "Unknown"), 32);
  const userStatus = availableStatuses[user.status.desktop || user.status.mobile || user.status.web || "offline"];

  return `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="400px" height="200px">
        <foreignObject x="0" y="0" width="410px" height="200px">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style="
              position: absolute;
              font-size: 16px;
              width: 400px;
              height: 200px;
              inset: 0px;
              font-family: 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: ${options.backgroundColor || "#000"};
              border-radius: ${options.borderRadius || 10}px;
            "
          >
            <div style="padding: 12px;">
              <div style="display: flex; align-items: center; flex-direction: row;">
                <div style="position: relative;">
                  <img
                    alt="${userName}'s Avatar"
                    src="${userAvatar}"
                    width="64px"
                    height="64px"
                    style="border-radius: 100%;"
                  />
                  ${
   !options.hideStatus
    ? `
                    <div
                      style="
                        position: absolute;
                        bottom: 0px;
                        right: 0px;
                        border-radius: 100%;
                        background-color: ${options.backgroundColor || "#000"};
                        padding: 4px;
                      "
                    >
                      <div
                        style="
                          width: 12px;
                          height: 12px;
                          border-radius: 100%;
                          background-color: ${userStatus};
                        "
                      />
                    </div>`
    : ""
  }
                </div>
                <div style="margin-left: 12px;">
                  <span
                    style="
                      display: flex;
                      align-items: center;
                      font-size: 1.15rem;
                      margin: 0 12px 0 0;
                      white-space: nowrap;
                      font-weight: 700;
                      color: #fff;
                    "
                  >
                    ${userName}
                    ${!options.hideBadges ? await generateBadgeImages(user.badges) : ""}
                  </span>
                  ${
   !options.hideCustomStatus && user.customStatus
    ? `
                    <div style="display: flex; width: 100%; flex-direction: row; align-items: center;">
                      ${user.customStatus.image ? `<img src="${await base64ImageFetcher(user.customStatus.image)}" alt="emoji" width="16px" height="16px" />` : `<div style="display: flex"></div>`}
                      <span
                        style="
                          opacity: 0.5;
                          ${user.customStatus.image ? "margin-left: 4px;" : ""}
                          color: #fff;
                        "
                      >
                        ${shortenText(escape(user.customStatus.state || ""), 32)}
                      </span>
                    </div>`
    : ""
  }
                </div>
              </div>
              <div style="width: 100%; background-color: #ffffff1a; height: 1px; margin-top: 12px;" />
              ${
   firstActivity ? await generateActivityDetails(firstActivity) : `
                <span
                  style="
                    padding: 26px;
                    color: #fff;
                    opacity: 0.5;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  ${shortenText(escape(options.idleMessage || "No activity"), 80)}
                </span>`
  }
            </div>
          </div>
        </foreignObject>
      </svg>
    `;
 } catch (error) {
  apiLogger.error("Error generating card:", error);
  return generateErrorCard("Failed to generate card.");
 }
}

export function generateErrorCard(error?: string): string {
 return `
 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="406px" height="195px">
 <foreignObject x="0" y="0" width="406px" height="195px">
  <div
   xmlns="http://www.w3.org/1999/xhtml"
   style="
    position: absolute;
    font-size: 16px;
    width: 406px;
    height: 195px;
    inset: 0px;
    font-family: 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #161a23;
    border-radius: 10px;
   ">
  <div
   style="
    display: flex;
    background-color: #161a23;
    border-radius: 10px;
    flex-direction: column;
    padding: 12px;
   "
  >
   <span
    style="
     display: flex;
     align-items: center;
     font-size: 25px;
     margin: 0 auto;
     gap: 8px;
     white-space: nowrap;
     font-weight: 700;
     color: #F87171;
    "
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     fill="none"
     viewBox="0 0 24 24"
     stroke-width="2"
     stroke="#F87171"
     style="
      width: 2rem;
      height: 2rem;
     "
    >
     <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
    <span style="
    margin-top: -2px;
    ">
    Error
    </span>
   </span>
   <div
    style="
     width: 100%;
     background-color: #ffffff1a;
     height: 1px;
     margin-top: 12px;
    "
   />
    <span
     style="
      padding-top: 12px;
      word-break: break-word;
      font-weight: 400;
      text-align: center;
      margin: 0 auto;
      color: #fff;
      opacity: 0.5;
     "
    >
     ${shortenText(escape(error || "An error occured while generating the card. Please try again later."), 80)}
    </span>
  </div>
  </div>
  </foreignObject>
  </svg>
  `;
}
