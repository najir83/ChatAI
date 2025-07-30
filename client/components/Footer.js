import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-white/10 backdrop-blur-md  text-white py-4 px-6 h-[6vh] ">
      <div className="  flex  md:flex-row justify-between items-center gap-4 text-sm">
        <Link href="/" className="lg:text-lg font-bold">
          Chat<span className="text-green-800">AI</span>
        </Link>
        {/* Rights */}
        <div className="text-center">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">ChatAI</span>. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://github.com/najir83"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-300 transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/sk-najir-0b0177285/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-300 transition"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
