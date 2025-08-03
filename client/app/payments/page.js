"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import useStore from "@/lib/store";
import { useUser } from "@clerk/nextjs";
import Lottie from "lottie-react";
import { Zap, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import animationData from "@/public/Loading.json";
export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loadingdata, setLoadingData] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 720);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { user, isLoaded } = useUser();
  const [baseUser, setBaseUser] = useState();
  useEffect(() => {
    const load = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          clerk_id: user?.id,
          name: user?.fullName,
        });

        const res = await fetch("/api/user", {
          method: "POST",
          headers: myHeaders,
          body: raw,
        });

        const data = await res.json();
        // console.log("data", data);
        if (data.user?.role === "subscribedUser") {
          toast.warn("You're Already a Premium Member!", {
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
          router.push("/");
        }
        setBaseUser(data.user);
      } catch (e) {
        toast.error(e.message || "Internal server error", {
          position: "top-right",
          autoClose: 2500,
          transition: Bounce,
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (isLoaded) {
      load();
    }
  }, [isLoaded]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/add-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }), // ₹500
      });

      const data = await res.json();
      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // test key
        amount: order.amount,
        currency: order.currency,
        name: "Test App",
        description: "Test Razorpay Payment",
        order_id: order.id,
        handler: async function (response) {
          toast.success("Payment Successfull", {
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
          const res = await fetch("/api/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clerk_id: baseUser?.clerk_id }), // ₹500
          });
          if (!res.ok) {
            toast.error(
              "Internal server error,money wil refund within 2 days",
              {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              }
            );
            router.push("/");
            return;
          }

          router.push("/");

          console.log(response);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "2388299009",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayObject = new window.Razorpay(options);
      razorpayObject.open();
    } catch (err) {
      toast.error("Payment Error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.push("/");
      console.error("Payment Error:", err);
    }
    setLoading(false);
  };

  return (!isLoaded && loadingdata) ? (
    <div className="h-[86vh] flex items-center justify-center opacity-35  p-4">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{
          height: isMobile ? 100 : 300,
          width: isMobile ? 200 : 300,
        }}
      />
    </div>
  ) : (
    <div className="min-h-[86vh] lg:w-[30vw]   mx-auto lg:pt-30 pt-15">
      <motion.div
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-indigo-600 text-white p-8 rounded-2xl m-5 lg:m-0  shadow-xl border border-indigo-700"
      >
        <div className="flex items-center justify-center mb-4">
          <Zap size={32} />
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-center">Pro Plan</h3>
        <p className="text-indigo-100 text-center mb-6">
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
          onClick={handlePayment}
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center cursor-pointer py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition"
        >
          {loading ? "Processing..." : "Pay ₹500"}
        </button>
      </motion.div>
    </div>
  );
}
