"use client";

import { Mail, Phone, MapPin } from "lucide-react";

import React, { useState } from "react";
import { toast, Bounce } from "react-toastify";
import {motion} from 'motion/react'
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(0);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setStatus("Sending...");
    if (!form.name || !form.email || !form.message) {
      return;
    }

    setSending(1);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast("Thanks for contacting us!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setForm({ name: "", email: "", message: "" });
      setSending(0);
    } else {
      // setStatus("");
      toast.error("Failed to send ❌", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setSending(0);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full grid gap-10 lg:grid-cols-2">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:.6}} className="text-3xl font-bold text-indigo-700">Get in Touch</motion.h2>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}} className="text-gray-600">
            Have a question, feedback, or just want to say hello? We'd love to
            hear from you.
          </motion.p>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}} className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="text-indigo-600" />
              <span className="text-gray-700">support@chataiapp.com</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-indigo-600" />
              <span className="text-gray-700">+9100000020020</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-indigo-600" />
              <span className="text-gray-700">Jalpaiguri, India</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Contact Form */}
        <motion.form initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:.6}}
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-5"
        >
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            disabled={sending}
            type="submit"
            className="w-full py-2 px-4 cursor-pointer bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
