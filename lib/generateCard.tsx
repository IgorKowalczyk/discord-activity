import React from "https://esm.sh/react@18.2.0";
import { shortenText } from "./shortenText.ts";
import type { User } from "./types.d.ts";
import satori, { init } from "https://esm.sh/satori@0.0.44/wasm";
import initYoga from "https://esm.sh/yoga-wasm-web@0.2.0";
import { h } from "https://deno.land/x/jsx_to_string@v0.5.0/mod.ts";

const wasm = await fetch("https://esm.sh/yoga-wasm-web@0.2.0/dist/yoga.wasm").then((res) => res.arrayBuffer());
const wasmBytes = new Uint8Array(wasm);

const yoga = await (initYoga as unknown as (wasm: Uint8Array) => Promise<unknown>)(wasmBytes);
init(yoga);

const availableStatuses: Record<string, string> = {
 online: "#43B581",
 idle: "#FAA61A",
 dnd: "#F04747",
 offline: "#747F8D",
};

export async function generateCard(user: User, fontBuffer: ArrayBufferLike): Promise<string> {
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
     {user.customStatus && user.customStatus.state && user.customStatus.image && (
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
        {shortenText(user.customStatus.state, 32)}
       </span>
      </div>
     )}
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
   {user.activities && user.activities.length > 0
    ? (
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
        <div
         style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          marginRight: "4px",
         }}
        >
         {user.activities[0].largeImage
          ? (
           <img
            style={{
             borderRadius: "10px",
            }}
            src={user.activities[0].largeImage}
            alt="discord"
            width="82px"
            height="82px"
           />
          )
          : null}
         {user.activities[0].smallImage
          ? (
           <img
            style={{
             borderRadius: "50%",
             border: "2px solid #161a23",
             backgroundColor: "#161a23",
             position: "absolute",
             bottom: "-4px",
             right: "-4px",
            }}
            src={user.activities[0].smallImage}
            alt="discord"
            width="32px"
            height="32px"
           />
          )
          : null}
        </div>

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
    )
    : (
     <div
      style={{
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       width: "100%",
      }}
     >
      <span
       style={{
        display: "flex",
        fontSize: "1.15rem",
        padding: "26px",
        textAlign: "center",
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
   width: 406,
   height: 195,
   fonts: [
    {
     name: "Roboto",
     data: fontBuffer,
    },
   ],
  },
 );

 return image;
}

export async function generateErrorCard(fontBuffer: ArrayBufferLike, error?: string): Promise<string> {
 const image = await satori(
  <div
   style={{
    width: "100%",
    display: "flex",
    backgroundColor: "#161a23",
    borderRadius: "10px",
    flexDirection: "column",
    padding: "12px",
   }}
  >
   <span
    style={{
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     width: "100%",
     fontSize: "25px",
     margin: "0 auto",
     whiteSpace: "nowrap",
     textAlign: "center",
     fontWeight: 700,
     color: "#F87171",
    }}
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     fill="none"
     viewBox="0 0 24 24"
     strokeWidth={1.5}
     stroke="#F87171"
     style={{
      width: "1.5rem",
      height: "1.5rem",
      marginRight: "8px",
      marginTop: "4px",
     }}
    >
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
    Error
   </span>
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

   <div
    style={{
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     width: "100%",
    }}
   >
    <span
     style={{
      display: "flex",
      fontSize: "1.15rem",
      padding: "26px",
      textAlign: "center",
      fontWeight: 400,
      color: "rgb(255, 255, 255)",
      opacity: 0.5,
     }}
    >
     {error || "An error occured while generating the card. Please try again later."}
    </span>
   </div>
  </div>,
  {
   width: 406,
   height: 195,
   fonts: [
    {
     name: "Roboto",
     data: fontBuffer,
    },
   ],
  },
 );

 return image;
}
