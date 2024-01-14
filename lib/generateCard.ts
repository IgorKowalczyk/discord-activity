import { shortenText } from "./shortenText.ts";
import type { User } from "./types.d.ts";
import { escape } from "./escape.ts";

const availableStatuses: Record<string, string> = {
 online: "#43B581",
 idle: "#FAA61A",
 dnd: "#F04747",
 offline: "#747F8D",
};

const base64ImageFetcher = async (url: string) => {
 try {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Invalid URL - Failed to fetch image");
  const blob = await res.blob();
  if (!blob.type.startsWith("image")) throw new Error("Failed to process blob");
  const buffer = await blob.arrayBuffer();
  return `data:${blob.type};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;
 } catch (e) {
  throw new Error(e);
 }
};

export async function generateCard(user: User): Promise<string> {
 const userAvatar = await base64ImageFetcher(user.avatar);
 const userBadges = new Map<string, string>();

 for (const badge of user.badges) {
  userBadges.set(badge, await base64ImageFetcher(`https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/PNG/${badge.toLowerCase()}.png`));
 }

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
    background-color: ${user.options.backgroundColor};
    border-radius: ${user.options.borderRadius + "px"};
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
         alt="${escape(user.username)}"
         src="${userAvatar}"
         width="64px"
         height="64px"
         style="
       border-radius: 100%;
      "
        />
        ${
  !user.options.hideStatus &&
  `
      <div
       style="
        position: absolute;
        bottom: 0px;
        right: 0px;
        border-radius: 100%;
        background-color: #161a23;
        padding: 4px;
       "
      >
       <div
        style="
         width: 12px;
         height: 12px;
         border-radius: 100%;
         background-color: ${availableStatuses[user.status?.desktop || user.status?.mobile || user.status?.web || "offline"]};
        "
       />
      </div>`
 }
       </div>
       <div
        style="
      display: flex;
      flex-direction: column;
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
         ${escape(shortenText(user.username, 16))}
         ${
  user.badges &&
  user.badges.length > 0 &&
  user.badges
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
 }
        </span>
        ${
  user.customStatus && user.customStatus.state && user.customStatus.image
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
         padding-left: ${user.customStatus.image ? "4px" : "0px"};
         color: #fff;
        "
       >
        ${escape(shortenText(user.customStatus.state || "", 32))}
       </span>
      </div>
      `
   : `<div style="display: flex"></div>`
 }
       </div>
      </div>
      <div
       style="
     display: flex;
     flex-direction: column;
     width: 100%;
     background-color: #ffffff1a;
     height: 1px;
     margin-top: 12px;
    "
      />
      ${
  user.activities && user.activities.length > 0
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
    user.activities[0].largeImage
     ? `
           <img
            style="
             border-radius: 10px;
            "
            src="${await base64ImageFetcher(user.activities[0].largeImage)}"
            alt="Discord"
            width="82px"
            height="82px"
           />
           `
     : ""
   }
         ${
    user.activities[0].smallImage
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
            src="${await base64ImageFetcher(user.activities[0].smallImage)}"
            alt="Discord"
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
    user.activities[0].name
     ? `
          <span
           style="
            font-size: 1.15rem;
            font-weight: 700;
            color: ${user.activities[0].type === 2 ? "#1CB853" : "#fff"};
           "
          >
          ${user.activities[0].type === 2 ? "Listening to Spotify..." : escape(shortenText(user.activities[0].name, 32))}
          </span>
          `
     : ""
   }

         ${
    user.activities[0].details
     ? `
          <span
           style="
            font-weight: 400;
            color: #fff;
            opacity: 0.5;
           "
          >
           ${escape(user.activities[0].details)}
          </span>
          `
     : ""
   }

         ${
    user.activities[0].state
     ? `
          <span
           style="
            font-weight: 400;
            color: #fff;
            opacity: 0.5;
           "
          >
          ${user.activities[0].type === 2 ? "By " : ""}
           ${escape(user.activities[0].state)}
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
       ${escape(shortenText(user.options.idleMessage, 32))}
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
     justify-content: center;
     font-size: 25px;
     margin: 0 auto;
     gap: 8px;
     white-space: nowrap;
     text-align: center;
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
      width: 1.5rem;
      height: 1.5rem;
     "
    >
     <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
    Error
   </span>
   <div
    style="
     display: flex;
     flex-direction: column;
     width: 100%;
     background-color: #ffffff1a;
     height: 1px;
     margin-top: 12px;
    "
   />

    <span
     style="
      padding-top: 26px;
      word-break: break-word;
      text-align: center;
      font-weight: 400;
      margin: 0 auto;
      color: #fff;
      opacity: 0.5;
     "
    >
     ${error || "An error occured while generating the card. Please try again later."}
    </span>
  </div>
  </div>
  </foreignObject>
  </svg>
  `;
}
