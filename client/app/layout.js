import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { ToastContainer, Bounce } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  icons: {
    icon: "/image.png",
  },
});

export const metadata = {
  title: "ChatAI - Your personal pdf assistant",
  description: "Chat with pdf so easily with gen ai",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} bg-gradient-to-br from-pink-300 w-[100vw] via-purple-300 to-indigo-400 overflow-y-auto ${geistMono.variable} antialiased`}
        >
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />

          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
