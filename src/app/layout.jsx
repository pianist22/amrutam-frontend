import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";
import amrutamLogo from "../public-image/amrutam_logo.png";
import { WithClerkLoading } from "@/components/WithClerkLoading";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amrutam",
  description: "Amrutam is a wellness and lifestyle platform rooted in Ayurveda, offering natural herbal remedies and holistic care. Discover ancient Ayurvedic recipes tailored for modern lifestyles to promote health, beauty, and inner balance.",
};

export default function RootLayout({
  children,
}) {
  return (
  <ClerkProvider>
   <html lang="en">
     <head>
        {/* Add this line: */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F4F6F8] min-h-screen">
        <Navbar logo={<img src={amrutamLogo.src} alt="Logo" className="h-15 w-auto" />} />
        <div className="flex">
          <Sidebar />
          {/* MAIN CONTENT */}
          <main className="flex-1 min-h-[calc(100vh-72px)] px-2 sm:px-4 md:px-6 py-4 ml-0 md:ml-0 mt-[0px]">
            <WithClerkLoading>
              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </WithClerkLoading>
          </main>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
