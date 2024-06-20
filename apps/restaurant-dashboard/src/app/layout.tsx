import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Inter, Poppins } from "next/font/google";

import { Providers } from "./(providers)/providers";
import Sidebar from "../shared/components/layout/sidebar";
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
  const heads = headers();
  const pathName = heads.get("next-url");

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <Providers>
          <div className="w-full flex">
            {pathName !== "/login" &&
              pathName !== "/register" &&
              pathName !== "/activate-account/[key]" && (
                <div className="w-[350px] h-screen sticky top-0 left-0 z-50">
                  <Sidebar />
                </div>
              )}

            {children}
          </div>
        </Providers>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
