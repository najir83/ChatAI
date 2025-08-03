"use client";
import React, { useState, useEffect } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EllipsisVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";
function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
const router=useRouter();
  // const [] = useState(fal  se);
  const [isMobile, setIsMobile] = useState(false);
  const { showItems, setShowItems, showNav, setShowNav } = useStore();
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 720);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const routes = [
    { path: "/", label: "Home" },
    { path: "/pdfs", label: "PDFs" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md z-[100]">
      <div className="h-[8vh] flex justify-between pr-3 lg:px-7 items-center">
        <div className="flex items-center">
          {isMobile && (
            <EllipsisVertical
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => {
                if (showItems) setShowItems(false);

                setShowNav(true);
              }}
            />
          )}
          <Link
            href="/"
            className="text-xl lg:text-2xl font-bold ml-3 hover:text-green-800 transition-colors"
          >
            {"<"} Chat<span className="text-green-800">AI {"/>"}</span>
          </Link>
        </div>

        {!isMobile && (
          <div className="space-x-10 transition-all">
            {routes.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={`px-5 py-3  hover:border-b-5 border-white transition font-semibold ${
                  pathname === path
                    ? "text-black rounded-2xl bg-gray-200"
                    : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center gap-5 lg:gap-10">
          <motion.button
          whileTap={{
            scale:1.15,
            opacity:.5
          }}

             onClick={()=>router.push('/payments')}
            className="lg:px-6 lg:py-2 font-bold cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
          >
            Join Now
          </motion.button>
          <div className="space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="bg-white cursor-pointer text-indigo-600 font-bold lg:px-5 lg:py-2 px-4 py-1 rounded-xl shadow hover:bg-indigo-100 transition-all duration-200">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col items-center">
                <UserButton />
                <p className="text-sm">{user?.fullName}</p>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar */}

      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-[85%] h-screen z-10 bg-amber-50 shadow-2xl  p-6 flex flex-col space-y-2"
          >
            <motion.div
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              className="self-end cursor-pointer"
              onClick={() => setShowNav(false)}
            >
              <X size={28} />
            </motion.div>

            {routes.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                onClick={() => setShowNav(false)}
                className={`px-5 py-3 rounded-xl hover:bg-gray-200 transition font-semibold ${
                  pathname === path ? "text-black bg-gray-200" : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
