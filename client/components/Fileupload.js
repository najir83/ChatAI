import React, { useState,useEffect } from "react";
import { Upload } from "lucide-react";
import { toast, Bounce } from "react-toastify";

import useStore from "@/lib/store";
import { useUser } from "@clerk/nextjs";

// import { Player } from "@lottiefiles/react-lottie-player";
import Lottie from "lottie-react";
import animationData from "@/public/animation.json";

// console.log("host ",process.env.NEXT_PUBLIC_HOST_SERVER);
const Fileupload = () => {
  const { collections, setCollection, baseUser, setBaseUser } = useStore();
  const { user, isLoaded } = useUser();
  const [colName, setColName] = useState("");

const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 720);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  if (!isLoaded) return null;

  const handleFileUpload = () => {
    if (!colName) {
      toast.warn("Add collection name", {
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
      return;
    }

    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.click();

    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files[0];
        if (file) {
          setIsUploading(true);
          try {
            // Step 1: Upload the PDF to backend
            const formData = new FormData();
            formData.append("pdf", file);
            formData.append("collectionName", colName);

            const uploadRes = await fetch(
              `${process.env.NEXT_PUBLIC_HOST_SERVER}/upload/pdf`,
              {
                method: "POST",
                body: formData,
              }
            );

            const data2 = await uploadRes.json();
            // console.log(data2);
            if (!uploadRes.ok) {
              toast.error(data.message || "Failed to upload PDF file", {
                position: "top-right",
                autoClose: 2500,
                theme: "light",
                transition: Bounce,
              });
              return;
            }

            // Step 2: Register collection in DB
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              clerk_id: user?.id,
              name: colName,
            });

            const r = await fetch("/api/collection", {
              method: "POST",
              headers: myHeaders,
              body: raw,
            });

            const data = await r.json();

            if (r.ok) {
              setCollection([...collections, data?.collection]);
              setBaseUser(data?.user);

              toast.success("File uploaded successfully", {
                position: "top-right",
                autoClose: 2500,
                theme: "light",
                transition: Bounce,
              });
            } else if (r.status === 409) {
              toast.warn(data.message || "Collection already exists", {
                position: "top-right",
                autoClose: 2500,
                theme: "light",
                transition: Bounce,
              });
            } else {
              toast.error(data.message || "Failed to save collection", {
                position: "top-right",
                autoClose: 2500,
                theme: "light",
                transition: Bounce,
              });
            }
          } catch (e) {
            // console.error(e);
            toast.error("Internal server error", {
              position: "top-right",
              autoClose: 2500,
              theme: "light",
              transition: Bounce,
            });
          } finally {
            setColName("");
            setIsUploading(false);
          }
        }
      }
    });
  };

  return isUploading ? (
    <div className="text-right text-gray-500 p-2 text-xs">
   
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ height: isMobile ? 130: 160, width: isMobile ? 390:500 }}
      />
      <span className="font-bold">AI</span> is working - It may takes some time
</div>
  ) : (
    <div className="  rounded-2xl space-x-5 flex lg:h-40  lg:shadow-lg hover:shadow-green-400  text-sm justify-center items-center p-4   ">
      <div>
        <input
          value={colName}
          onChange={(e) => {
            // const s = e.target.value.replace(/ /g, "");

            setColName(e.target.value.trimEnd().toLowerCase());
          }}
          className="px-3 py-3 bg-gray-300 lg:w-70 shadow-md rounded-2xl "
          placeholder="Enter Collection Name"
        ></input>
      </div>

      <div
        className="flex flex-col  cursor-pointer items-center gap-2"
        onClick={handleFileUpload}
      >
        <Upload size={20} />
        <p>Upload PDF</p>
        <p className="text-sm text-gray-500">pages limit : 60</p>
      </div>
    </div>
  );
};

export default Fileupload;
