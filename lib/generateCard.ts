import type { User } from "./schemas.ts";
import type { cardOptionsSchema } from "./schemas.ts";
import { escape, shortenText } from "./utils.ts";
import { base64ImageFetcher } from "./base64ImageFetcher.ts";
import { ActivityTypes } from "npm:@discordeno/types@20.0.0";

const availableStatuses: Record<string, string> = {
 online: "#43B581",
 idle: "#FAA61A",
 dnd: "#F04747",
 offline: "#747F8D",
};

export async function generateCard(user: User, options: cardOptionsSchema): Promise<string> {
 const userAvatar = await base64ImageFetcher(user.avatar);
 const userBadges = new Map<string, string>();

 for (const badge of user.badges) {
  userBadges.set(badge, await base64ImageFetcher(`https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/PNG/${badge.toLowerCase()}.png`));
 }

 const firstActivity = user.activities[0] || null;

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
    background-color: ${options.backgroundColor};
    border-radius: ${options.borderRadius + "px"};
   "
    >
     <div
      style="
      padding: 12px;
     "
     >
      <div
       style="
     display: flex;
     align-items: center;
     flex-direction: row;
    "
      >
       <div
        style="
      position: relative;
     "
       >
        <img
         alt="${shortenText(escape(user.username || "Unknown"), 32)}"
         src="${userAvatar}"
         width="64px"
         height="64px"
         style="
       border-radius: 100%;
      "
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
        background-color: ${options.backgroundColor};
        padding: 4px;
       "
      >
       <div
        style="
         width: 12px;
         height: 12px;
         border-radius: 100%;
         background-color: ${availableStatuses[user.status.desktop || user.status.mobile || user.status.web || "offline"]};
        "
       />
      </div>`
   : ""
 }
       </div>
       <div
        style="
      margin-left: 12px;
     "
       >
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
         ${shortenText(escape(user.username || "Unknown"), 32)}
         ${
  !options.hideBadges && user.badges && user.badges.length > 0
   ? user.badges
    .map(
     (badge) => `
         <img
          src="${userBadges.get(badge)}"
          alt="${escape(badge)}"
          width="24px"
          height="24px"
          style="
           margin-left: 4px;
          "
         />
        `,
    )
    .join("")
   : ""
 }
        </span>
        ${
  !options.hideCustomStatus && user.customStatus
   ? `
      <div
       style="
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
       "
      >
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
      </div>
      `
   : ""
 }
       </div>
      </div>
      <div
       style="
     width: 100%;
     background-color: #ffffff1a;
     height: 1px;
     margin-top: 12px;
    "
      />
      ${
  firstActivity
   ? `
     <div>
      <div
       style="
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        font-weight: 700;
        color: #fff;
       "
      >
       <div
        style="
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
        "
       >
        <div
         style="
          display: flex;
          position: relative;
          flex-direction: column;
          margin-right: 4px;
         "
        >
         ${
    firstActivity.assets?.large_image
     ? `
           <img
            style="
             border-radius: 10px;
            "
            src="${await base64ImageFetcher(firstActivity.assets.large_image)}"
            alt="${escape(firstActivity.assets.large_text || "Activity Image")}"
            width="82px"
            height="82px"
           />
           `
     // if there is no large image, we will use the small image as fallback and dont show the small image
     : firstActivity.assets?.small_image
     ? ` 
            <img
              style="
                border-radius: 10px;
              "
              src="${await base64ImageFetcher(firstActivity.assets.small_image)}"
              alt="${escape(firstActivity.assets.small_text || "Activity Image")}"
              width="82px"
              height="82px"
            />
            `
     : ""
   }
         ${
    firstActivity.assets?.small_image && firstActivity.assets?.large_image
     ? `
           <img
            style="
             border-radius: 50%;
             border: 2px solid #161a23;
             background-color: #161a23;
             position: absolute;
             bottom: -4px;
             right: -4px;
            "
            src="${await base64ImageFetcher(firstActivity.assets.small_image)}"
            alt="${escape(firstActivity.assets.small_text || "Activity Image")}"
            width="32px"
            height="32px"
           />
           `
     : ""
   }
        </div>

        <div
         style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          margin-left: 8px;
         "
        >
         ${
    firstActivity.name
     ? `
          <span
           style="
            font-size: 1.15rem;
            font-weight: 700;
            color: ${firstActivity.type === ActivityTypes.Listening ? "#1CB853" : "#fff"};
           "
          >

      ${firstActivity.type === ActivityTypes.Playing ? "Playing " : ""}
      ${firstActivity.type === ActivityTypes.Streaming ? "Streaming " : ""}
      ${firstActivity.type === ActivityTypes.Listening ? "Listening to Spotify..." : ""}
      ${firstActivity.type === ActivityTypes.Watching ? "Watching " : ""}
      ${firstActivity.type === ActivityTypes.Competing ? "Competing in " : ""}


          ${shortenText(escape(firstActivity.name), 32)}
          </span>
          `
     : ""
   }

         ${
    firstActivity.details
     ? `
          <span
           style="
            font-weight: 400;
            color: #fff;
            opacity: 0.5;
           "
          >
           ${shortenText(escape(firstActivity.details), 80)}
          </span>
          `
     : ""
   }

         ${
    firstActivity.state
     ? `
          <span
           style="
            font-weight: 400;
            color: #fff;
            opacity: 0.5;
           "
          >
          ${firstActivity.type === 2 ? "By " : ""}
           ${shortenText(escape(firstActivity.state), 32)}
          </span>
          `
     : ""
   }
        </div>
       </div>
      </div>
     </div>
      `
   : `
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
       ${shortenText(escape(options.idleMessage), 80)}
      </span>`
 }
     </div>
    </div>
   </foreignObject>
  </svg>
 `;
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
