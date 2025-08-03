"use client";
import { motion } from "framer-motion";
import { BookOpen, Upload, MessageCircleMore } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: <Upload size={28} className="text-indigo-600" />,
    title: "Upload a PDF",
    description:
      "Click the “+ Upload” button to upload your PDF document to the platform.",
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

export default function HowToUseSection() {
  return (
    <section className="w-full min-h-[100vh] py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Step Progress Bar */}
        <div className="flex justify-center gap-8 mb-10">
          {steps.map((_, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-4 h-4 bg-indigo-600 rounded-full" />
              {idx < steps.length - 1 && (
                <div className="w-16 h-1 bg-indigo-300 mx-2 rounded" />
              )}
            </div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6"
        >
          🛠️ How to Use
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 mb-12 max-w-xl mx-auto"
        >
          Just upload your PDF, select it, and start chatting — it's that
          simple.
        </motion.p>

        {/* Step Cards */}
        <div className="grid md:grid-cols-3  gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.12 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Chat Preview (Visual Filler) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200 shadow-xl rounded-xl p-6 max-w-3xl mx-auto"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Example Conversation
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-indigo-600">You:</span> What
              is the main topic of this PDF?
            </p>
            <p>
              <span className="font-semibold text-green-600">Bot:</span> The PDF
              primarily discusses modern approaches to AI-powered document
              analysis.
            </p>
            <p>
              <span className="font-semibold text-indigo-600">You:</span>{" "}
              Summarize section 2 for me.
            </p>
            <p>
              <span className="font-semibold text-green-600">Bot:</span> Section
              2 introduces transformer-based models for better semantic
              extraction from PDFs...
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Link href='/pdfs' className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition">
            👉 Upload Your First PDF
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
