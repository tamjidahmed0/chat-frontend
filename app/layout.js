import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Chat from "./messages/chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat | Sign in",
  description: "resgister",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
