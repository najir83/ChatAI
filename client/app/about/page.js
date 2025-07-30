"use client";

import { Sparkles, FileText, Bot, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 ">
      <div className="max-w-4xl w-full space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            About <span className="text-indigo-600">ChatAI</span>
          </h1>
          <p className="text-lg text-gray-600">
            Your smart assistant to interact with PDF documents using Generative
            AI.
          </p>
        </div>

        {/* Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Feature 1 */}
          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <FileText size={24} />
              <h2 className="text-xl font-semibold">Chat with any PDF</h2>
            </div>
            <p className="text-gray-700">
              Upload any PDF file – whether it's a research paper, manual, or
              textbook – and start asking questions. ChatAI will extract and
              analyze content to give you smart, relevant answers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <Bot size={24} />
              <h2 className="text-xl font-semibold">Powered by GenAI</h2>
            </div>
            <p className="text-gray-700">
              Behind the scenes, we use advanced Generative AI models to
              understand and respond to your queries in natural language —
              making your interaction intuitive and effortless.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <MessageCircle size={24} />
              <h2 className="text-xl font-semibold">Simple & Fast Interface</h2>
            </div>
            <p className="text-gray-700">
              No complicated setup. Just upload, type your question, and get
              instant answers with references from the document — all in a
              sleek, distraction-free interface.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <Sparkles size={24} />
              <h2 className="text-xl font-semibold">Affordable for Everyone</h2>
            </div>
            <p className="text-gray-700">
              ChatAI offers powerful features at the lowest possible price.
              Perfect for individuals, students, and teams who want to boost
              productivity without breaking the bank.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-6">
          <p className="text-gray-600 mb-2">Ready to get started?</p>
          <Link
            href="/pdfs"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition"
          >
            Upload a PDF & Start Chatting →
          </Link>
        </div>
      </div>
    </div>
  );
}
