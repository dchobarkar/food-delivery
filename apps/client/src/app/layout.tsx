import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { Providers } from "./providers/NextUiProvider";
import "./global.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DarshanWebDev Food Delivery",
  description: "DarshanWebDev Food Delivery website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <Providers>{children}</Providers>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
