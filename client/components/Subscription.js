"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubscriptionSection() {
  const route = useRouter();
  return (
    <section className="w-full min-h-screen py-20 bg-gradient-to-b from-blue-50 via-blue-100 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6"
        >
          🪙 Free vs Pro Plan
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Start for free and upgrade anytime for more uploads and daily
          interactions.
        </motion.p>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-center mb-4 text-indigo-500">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">
              Free Plan
            </h3>
            <p className="text-gray-600 mb-6">
              Perfect for getting started with basic limits.
            </p>
            <ul className="text-left space-y-4 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} />
                Upload up to <strong>3 PDFs</strong>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} />
                <strong>10 queries</strong> per PDF <strong>per week</strong>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} />
                Access basic AI chat features
              </li>
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl border border-indigo-700"
          >
            <div className="flex items-center justify-center mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-indigo-100 mb-6">
              Upgrade to unlock more storage and daily usage.
            </p>
            <ul className="text-left space-y-4 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-white" size={18} />
                Upload up to <strong>7 PDFs</strong>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-white" size={18} />
                <strong>15 queries</strong> per PDF <strong>per day</strong>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-white" size={18} />
                Priority chat processing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-white" size={18} />
                Early access to new features
              </li>
            </ul>
            <button
              onClick={() => {
                route.push("/payments");
              }}
              className="mt-8 w-full cursor-pointer py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              Upgrade to Pro 🚀
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
