import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
 return (
  <html>
   <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="follow, index" />
    <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />

    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="manifest" href="/site.webmanifest" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={"true"} />

    <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />

    <title>Discord Activity</title>
    <meta name="description" content="API for displaying Discord activity data in JSON or SVG" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Discord Activity" />
    <meta property="og:title" content="Discord Activity" />
    <meta property="og:description" content="API for displaying Discord activity data in JSON or SVG" />
    <meta property="og:url" content="https://discord-activity.deno.dev" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="https://discord-activity.deno.dev/og-image.png" />
    <meta property="og:image:alt" content="Discord Activity" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Discord Activity" />
    <meta name="twitter:description" content="API for displaying Discord activity data in JSON or SVG" />
    <meta name="twitter:image" content="https://discord-activity.deno.dev/og-image.png" />
    <meta name="twitter:image:alt" content="Discord Activity" />
    <meta name="twitter:image:type" content="image/png" />
    <meta name="twitter:image:width" content="1200" />
    <meta name="twitter:image:height" content="630" />

    <link rel="stylesheet" href="/style.css" />
   </head>
   <body class="min-h-screen w-full scroll-smooth bg-background font-geist antialiased">
    <main class="mx-auto max-w-5xl">
     <Component />
     <div class="color-rays" />
    </main>
   </body>
  </html>
 );
}
