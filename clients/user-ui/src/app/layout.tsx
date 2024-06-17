import type { Metadata } from "next";
import Toaster from "react-hot-toast";
import { Poppins } from "next/font/google";

import { Providers } from "./providers/NextUiProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-Poppins",
});

export const metadata: Metadata = {
  title: "Food Delivery App",
  description: "Get your food online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" reverseOrder="false" />
      </body>
    </html>
  );
}
