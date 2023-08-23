import { shortenText } from "./shortenText.ts";
import type { User } from "./types.d.ts";
import React from "https://esm.sh/react@18.2.0";
import satori, { init } from "https://esm.sh/satori@0.0.44/wasm";
import initYoga from "https://esm.sh/yoga-wasm-web@0.2.0";

const wasm = await fetch("https://esm.sh/yoga-wasm-web@0.2.0/dist/yoga.wasm").then((res) => res.arrayBuffer());

const yoga = await (initYoga as unknown as (wasm: ArrayBuffer) => Promise<unknown>)(wasm);
init(yoga);

const availableStatuses: Record<string, string> = {
 online: "#43B581",
 idle: "#FAA61A",
 dnd: "#F04747",
 offline: "#747F8D",
};

export async function generateCard(user: User, fontBuffer: ArrayBufferLike) {
 const image = await satori(
  <div
   style={{
    width: "100%",
    display: "flex",
    backgroundColor: "#" + user.options.backgroundColor,
    borderRadius: user.options.borderRadius + "px",
    flexDirection: "column",
    padding: "12px",
   }}
  >
   <div
    style={{
     display: "flex",
     alignItems: "center",
     flexDirection: "row",
    }}
   >
    <div
     style={{
      display: "flex",
      position: "relative",
     }}
    >
     <img
      alt="Majonez.exe#2495"
      src={user.avatar}
      width="64"
      height="64"
      style={{
       borderRadius: "100%",
      }}
     />
     {!user.options.hideStatus && (
      <div
       style={{
        display: "flex",
        position: "absolute",
        bottom: "0px",
        right: "0px",
        borderRadius: "100%",
        backgroundColor: "#161a23",
        padding: "4px",
       }}
      >
       <div
        style={{
         display: "flex",
         width: "12px",
         height: "12px",
         borderRadius: "100%",
         backgroundColor: availableStatuses[user.status?.desktop || user.status?.mobile || user.status?.web || "offline"],
        }}
       />
      </div>
     )}
    </div>
    <div
     style={{
      display: "flex",
      flexDirection: "column",
      marginLeft: "12px",
     }}
    >
     <span
      style={{
       display: "flex",
       fontSize: "1.15rem",
       margin: "0 12px 0 0",
       whiteSpace: "nowrap",
       fontWeight: 700,
       color: "rgb(255, 255, 255)",
      }}
     >
      {shortenText(user.username, 16)}

      {user.badges &&
       user.badges.map((badge: string) => {
        return (
         <img
          src={`https://cdn.jsdelivr.net/gh/merlinfuchs/discord-badges/PNG/${badge.toLowerCase()}.png`}
          alt={badge}
          width="24"
          height="24"
          style={{
           marginLeft: "4px",
          }}
         />
        );
       })}
     </span>
     <div
      style={{
       display: "flex",
       width: "100%",
       flexDirection: "row",
       alignItems: "center",
      }}
     >
      {user.customStatus.image ? <img src={user.customStatus.image} alt="emoji" width="16" height="16" /> : <div style={{ display: "flex" }} />}
      <span
       style={{
        display: "flex",
        opacity: 0.5,
        paddingLeft: user.customStatus.image ? "4px" : "0px",
        color: "rgb(255, 255, 255)",
       }}
      >
       {user.customStatus.state}
      </span>
     </div>
    </div>
   </div>
   <div
    style={{
     display: "flex",
     flexDirection: "column",
     width: "100%",
     backgroundColor: "#ffffff1a",
     height: "1px",
     marginTop: "12px",
    }}
   />
   {user.activities && user.activities.length > 0 ? (
    <div
     style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
     }}
    >
     <div
      style={{
       display: "flex",
       flexDirection: "column",
       fontSize: "1.15rem",
       marginTop: "12px",
       marginLeft: "12px",

       fontWeight: 700,
       color: "rgb(255, 255, 255)",
      }}
     >
      <div
       style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
       }}
      >
       {user.activities[0].assets && (
        <div
         style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          marginRight: "4px",
         }}
        >
         {user.activities[0].assets.large_image ? (
          <img
           style={{
            borderRadius: "10px",
           }}
           src={user.activities[0].assets.large_image}
           alt="discord"
           width="82px"
           height="82px"
          />
         ) : null}
         {user.activities[0].assets.small_image ? (
          <img
           style={{
            borderRadius: "50%",
            border: "2px solid #161a23",
            backgroundColor: "#161a23",
            position: "absolute",
            bottom: "-4px",
            right: "-4px",
           }}
           src={user.activities[0].assets.small_image}
           alt="discord"
           width="32px"
           height="32px"
          />
         ) : null}
        </div>
       )}
       <div
        style={{
         display: "flex",
         flexDirection: "column",
         alignItems: "flex-start",
         justifyContent: "center",
        }}
       >
        {user.activities[0].name && (
         <span
          style={{
           display: "flex",
           fontSize: "1.15rem",
           fontWeight: 700,
           color: "rgb(255, 255, 255)",
           marginLeft: "8px",
          }}
         >
          {user.activities[0].name}
         </span>
        )}

        {user.activities[0].details && (
         <span
          style={{
           display: "flex",
           fontSize: "1.15rem",
           fontWeight: 400,
           color: "rgb(255, 255, 255)",
           opacity: 0.5,
           marginLeft: "8px",
          }}
         >
          {user.activities[0].details}
         </span>
        )}

        {user.activities[0].state && (
         <span
          style={{
           display: "flex",
           fontSize: "1.15rem",
           fontWeight: 400,
           color: "rgb(255, 255, 255)",
           opacity: 0.5,
           marginLeft: "8px",
          }}
         >
          {user.activities[0].state}
         </span>
        )}
       </div>
      </div>
     </div>
    </div>
   ) : (
    <div
     style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
     }}
    >
     <span
      style={{
       display: "flex",
       fontSize: "1.15rem",
       padding: "26px",
       fontWeight: 400,
       color: "rgb(255, 255, 255)",
       opacity: 0.5,
      }}
     >
      {shortenText(user.options.idleMessage, 32)}
     </span>
    </div>
   )}
  </div>,
  {
   fonts: [
    {
     name: "Roboto",
     data: fontBuffer,
    },
   ],
  }
 );

 return image;
}
