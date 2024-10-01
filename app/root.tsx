import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import styles from "./tailwind.css?url";
import { honeypot } from "./honeypot.server";
import { HoneypotProvider } from "remix-utils/honeypot/react";

/**
 * Font Pairs:
 * 
 * 1. Libre Baskerville & Source Sans Pro - https://www.fontpair.co/pairings/libre-baskerville-source-sans-pro
 * 2. Playfair Display & Lato - https://www.fontpair.co/pairings/playfair-display-lato
 */

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
  },
  {
    rel: 'stylesheet',
    href: styles
  }
];

export async function loader() {
  return json({ honeypotInputProps: honeypot.getInputProps() });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');
  if (!data) return;
  const { honeypotInputProps } = data;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <HoneypotProvider {...honeypotInputProps}>
          {children}
        </HoneypotProvider>
        {/* <ScrollRestoration /> */}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
