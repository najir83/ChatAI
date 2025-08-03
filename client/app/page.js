"use client";
import Fileupload from "@/components/Fileupload";
import { useState } from "react";
import TypingComponent from "@/components/Typed";
import Link from "next/link";
import { ExternalLink, BookOpenText } from "lucide-react";
import SplitText from "@/components/SplitText";
import { motion } from "motion/react";
import Sparkles from "react-sparkle";

import { BookOpen, Upload, MessageCircleMore } from "lucide-react";
import HowToUseSection from "@/components/Howtouse";
import SubscriptionSection from "@/components/Subscription";

const steps = [
  {
    icon: <Upload size={28} className="text-indigo-600" />,
    title: "Add a PDF",
    description:
      "Click the “+ Add” button to upload your PDF document to the platform.",
  },
  {
    icon: <BookOpen size={28} className="text-indigo-600" />,
    title: "Select from Collections",
    description:
      "Choose your uploaded file from the Collections panel to open it.",
  },
  {
    icon: <MessageCircleMore size={28} className="text-indigo-600" />,
    title: "Start Chatting",
    description:
      "Click on the chat input on the right side and start asking questions about your PDF.",
  },
];
export default function Home() {
  const [showSparkel, setShowSparkel] = useState(false);
  return (
    <div>
      <motion.section
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        transition={{
          duration: 1,
        }}
        className="min-h-[92vh] grid   lg:grid-cols-2 gap-10 px-4 lg:px-24 py-10 items-center"
      >
        {/* Left Section */}
        <div className="flex flex-col justify-center items-start space-y-6">
          <SplitText
            text="Welcome to ChatAI"
            className="text-3xl lg:text-6xl  font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent leading-tight"
          />

          <h3 className="text-sm lg:text-xl text-green-600 font-semibold">
            ~ Talk to Your PDFs Like Never Before
          </h3>
          <p className="text-gray-700 lg:pr-16 text-sm lg:text-base">
            Struggling to find answers in long PDFs? With ChatAI, you can simply
            upload a PDF and start asking questions — it’s that easy. Powered by
            cutting-edge Generative AI, we turn your documents into instant
            conversations.
          </p>

          <div className="italic bg-gradient-to-b from-green-700 to-indigo-600 bg-clip-text text-transparent text-lg lg:text-xl">
            <TypingComponent />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Link
              href="/pdfs"
              className="flex gap-2 items-center px-4 py-2 rounded-2xl text-white font-semibold text-base bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 hover:shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-105"
            >
              Try Now <ExternalLink size={18} />
            </Link>

            <Link
              href="/about"
              className="flex gap-2 items-center px-4 py-2 rounded-2xl text-white font-semibold text-base bg-gradient-to-r from-gray-700 via-gray-900 to-black hover:shadow-xl transition-all transiti duration-300 hover:brightness-110 hover:scale-105"
            >
              Read More <BookOpenText size={18} />
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div
          onMouseEnter={() => setShowSparkel(true)}
          onMouseLeave={() => setShowSparkel(false)}
          className="relative w-full flex   cursor-grabbing justify-center"
        >
          <motion.img
            initial={{ scale: 0.8 ,opacity:0}}
            animate={{ scale: 1,opacity:1 }}
            transition={{ duration: 0.6 }}
            src="/195.jpg"
            alt="vector art"
            className="rounded-3xl \ shadow-xl max-h-[400px] object-contain mix-blend-darken hover:scale-115 transition-transform duration-700 ease-in-out "
          />
          {showSparkel && (
            <Sparkles
              color="red"
              count={20}
              minSize={7}
              maxSize={12}
              overflowPx={80}
              fadeOutSpeed={30}
              flicker={false}
            />
          )}
        </div>
      </motion.section>
     <HowToUseSection/>
     <SubscriptionSection/>
    </div>
  );
}
