"use client";

import { Sparkles, FileText, Bot, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
export default function Page() {
  const route=useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 ">
      <div className="max-w-4xl w-full space-y-10">
        {/* Heading */}
        <div className="text-center">
          <motion.h1 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:.6}} className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            About <span className="text-indigo-600">ChatAI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600"
          >
            Your smart assistant to interact with PDF documents using Generative
            AI.
          </motion.p>
        </div>

        {/* Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Feature 1 */}
          <motion.div  whileHover={{
            scale:1.04
          }} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:.6}} className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <FileText size={24} />
              <h2 className="text-xl font-semibold">Chat with any PDF</h2>
            </div>
            <p className="text-gray-700">
              Upload any PDF file – whether it's a research paper, manual, or
              textbook – and start asking questions. ChatAI will extract and
              analyze content to give you smart, relevant answers.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div whileHover={{
            scale:1.04
          }}  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:.6}} className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <Bot size={24} />
              <h2 className="text-xl font-semibold">Powered by GenAI</h2>
            </div>
            <p className="text-gray-700">
              Behind the scenes, we use advanced Generative AI models to
              understand and respond to your queries in natural language —
              making your interaction intuitive and effortless.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div whileHover={{
            scale:1.04
          }}  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:.6}} className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <MessageCircle size={24} />
              <h2 className="text-xl font-semibold">Simple & Fast Interface</h2>
            </div>
            <p className="text-gray-700">
              No complicated setup. Just upload, type your question, and get
              instant answers with references from the document — all in a
              sleek, distraction-free interface.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div  whileHover={{
            scale:1.04
          }}  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:.6}} className="p-6 border rounded-xl shadow hover:shadow-md transition bg-white">
            <div className="flex items-center gap-3 mb-3 text-indigo-600">
              <Sparkles size={24} />
              <h2 className="text-xl font-semibold">Affordable for Everyone</h2>
            </div>
            <p className="text-gray-700">
              ChatAI offers powerful features at the lowest possible price.
              Perfect for individuals, students, and teams who want to boost
              productivity without breaking the bank.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-6">
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:.6}} className="text-gray-600 mb-2">Ready to get started?</motion.p>
          <motion.button initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:.6}}
            href="/pdfs" 
            onClick={()=>{
              route.push('/pdfs')
            }}
            className="inline-block cursor-pointer px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition"
          >
            Upload a PDF & Start Chatting →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
