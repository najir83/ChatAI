"use client";

import Fileupload from "@/components/Fileupload";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Plus, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast, Bounce } from "react-toastify";
import useStore from "@/lib/store";

export default function Page() {
  const { collections, setCollection, baseUser, setBaseUser } = useStore();
  const template = useRef();
  const [query, setQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [referance, SetReferance] = useState(null);
  const [show, setShow] = useState("");
  const { user, isLoaded } = useUser();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showChats, setShowChats] = useState(false);
  const [chats, setChats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 720);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsQuerying(true);
    setAnswer(null);
    setShowChats(false);

    try {
      setShow(query);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_SERVER}/chat?message=${query} &&collectionName=${collections[selectedIndex].name}`
      );
      const data = await res.json();
      // console.log(data);
      setAnswer(data?.answer || "No answer found.");
      SetReferance(data?.reference || []);
      if (!res.ok) return;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        name: collections[selectedIndex].name,
        role: "question",
        description: query,
      });

      const raw2 = JSON.stringify({
        name: collections[selectedIndex].name,
        role: "answer",
        description: data?.answer || "Sample answer placeholder",
      });

      await fetch("/api/update-collection", {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });

      const coldata = await fetch(
        "/api/update-collection",
        {
          method: "POST",
          headers: myHeaders,
          body: raw2,
        }
      );

      const newcol = await coldata.json();
      let updated = collections.map((e) =>
        e.name === newcol.collection.name ? newcol.collection : e
      );
      setCollection(updated);

      setQuery("");
    } catch (e) {
      console.error(e);
      setAnswer("An error occurred while fetching the answer.");
    } finally {
      setIsQuerying(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/collection?col_name=${collections[selectedIndex].name}`
        );
        const data = await res.json();
        setChats(data.chats);
      } catch (e) {
        toast.error(e.message || "Internal server error", {
          position: "top-right",
          autoClose: 2500,
          transition: Bounce,
        });
      }
    };

    if (collections?.length && selectedIndex >= 0) {
      load();
    }
  }, [selectedIndex, collections]);

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
        setBaseUser(data.user);
        setCollection(data.collections);
      } catch (e) {
        toast.error(e.message || "Internal server error", {
          position: "top-right",
          autoClose: 2500,
          transition: Bounce,
        });
      }
    };

    if (isLoaded) {
      load();
    }
  }, [isLoaded]);
  useEffect(() => {
    template.current?.scrollIntoView({ behavior: "smooth" });
  }, [showChats]);
  useEffect(() => {
    setAnswer("");
    setShow("");
  }, [selectedIndex]);
  const [showup, setShowUp] = useState(false);
  // console.log(isMobile);
  return (
    <div className="lg:h-[86vh] lg:w-full flex flex-col lg:flex-row">
      {/* Left side: Upload */}
      <div className="lg:w-[30vw] flex justify-center  border-r  border-gray-300 ">
        {isLoaded && baseUser ? (
          <div className="w-full px-4 transition-all delay-500 py-6 space-y-6">
            {isMobile && !showup && (
              <Plus
                onClick={() => setShowUp(true)}
                className="absolute right-5 top-20"
              />
            )}
            {isMobile && showup && (
              <X
                onClick={() => setShowUp(false)}
                className="absolute right-5 top-20"
              />
            )}
            {(!isMobile || showup) && (
              <>
                <div className="text-left border-b pb-3">
                  <p className="font-semibold text-gray-800 text-lg">
                    {baseUser.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Role: {baseUser.role}
                  </p>
                </div>

                {/* Collection Creation Limit */}
                <div className="text-sm text-gray-700 p-3 rounded-md border border-gray-300">
                  <div className="w-full max-w-md p-4  rounded-3xl shadow">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Collections Created:
                      <span className="font-semibold mx-1">
                        {baseUser.createdCollection}
                      </span>
                      /
                      <span className="font-semibold mx-1">
                        {baseUser.collectionLimit}
                      </span>
                    </p>

                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div
                        className={`h-full ${
                          (baseUser.createdCollection /
                            baseUser.collectionLimit) *
                            100 >=
                          60
                            ? "bg-red-500"
                            : "bg-green-500"
                        }  rounded-full transition-all duration-300`}
                        style={{
                          width: `${
                            (baseUser.createdCollection /
                              baseUser.collectionLimit) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {baseUser.createdCollection === baseUser.collectionLimit && (
                    <p className="text-red-500 mt-1 font-medium text-sm">
                      🚫 You have reached your collection limit.
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div
                  hidden={
                    baseUser.createdCollection === baseUser.collectionLimit
                  }
                  className="border border-gray-200 rounded-md p-2"
                >
                  <p className="text-gray-600 text-sm p-2">Add Collection</p>
                  <Fileupload />
                </div>
              </>
            )}

            {/* Collections Dropdown */}
            <div className="mt-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Your Collections
              </label>
              <select
                className=" lg:w-[12vw]    border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  setSelectedIndex(parseInt(e.target.value));
                }}
                value={selectedIndex}
              >
                <option value="" disabled>
                  -- Select a collection --
                </option>

                {collections.map((col, i) => {
                  const isLimitReached = col.used_query >= col.query_limit;
                  return (
                    <option
                      key={col._id || i}
                      value={i}
                      // disabled={isLimitReached}
                    >
                      {col.name} ----- ({col.used_query}/{col.query_limit})
                      {isLimitReached ? " - Limit Reached" : ""}
                    </option>
                  );
                })}
              </select>

              {/* Note about disabled options */}
              {collections?.some(
                (col) => col.used_query >= col.query_limit
              ) && (
                <p className="text-xs text-red-500 mt-1">
                  * Some collections are exced the query limit,
                  <br />{" "}
                  <p className="font-bold">
                    Wait for 7- days to reset or updrade to Pro.
                  </p>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 p-4">
            Loading user info...
          </div>
        )}
      </div>

      {/* Right side: QnA */}
      <div className="lg:w-[70vw] flex flex-col justify-between p-4">
        {/* Answer display */}
        <div>
          <button
            onClick={() => {
              setShowChats(!showChats);
            }}
            className="bg-blue-200 text-blue-700 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 font-semibold py-1 px-2 m-1 cursor-pointer rounded-lg shadow-sm"
          >
            {showChats ? "hide" : "show"} chats
          </button>
        </div>
        <div className="border border-gray-200 rounded-xl shadow p-4 lg:h-[77vh] h-[60vh] overflow-y-auto">
          {!answer && !isQuerying && !showChats && (
            <h1 className="lg:absolute lg:top-100 ml-10  mt-30 lg:ml-0 lg:mt-0 lg:right-130 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 text-3xl font-bold">
              Unleash the Power of ChatAI
            </h1>
          )}
          {showChats && (
            <>
              {chats.map((e, i) => {
                if (e.role === "question") {
                  return (
                    <div key={i} className="flex justify-end mb-2">
                      <div className="max-w-[70%] bg-slate-300 text-left text-black p-3 rounded-l-2xl rounded-tr-2xl lg:text-lg text-sm ">
                        {e.description}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2 lg:text-lg text-left p-2 z-7 lg:relative"
                    >
                      <div className="text-gray-800">
                        <ReactMarkdown>{e.description}</ReactMarkdown>
                      </div>
                    </div>
                  );
                }
              })}
              <div ref={template} className="pb-10"></div>
            </>
          )}

          {!showChats && (
            <>
              {show.length > 0 && (
                <div className="flex justify-end mb-4">
                  <div className="max-w-[70%] bg-slate-300 text-left text-black p-3 rounded-l-2xl rounded-tr-2xl text-sm lg:text-lg">
                    {show}
                  </div>
                </div>
              )}

              {/* Answer area */}
              <div className="flex items-start gap-2 lg:text-lg text-left p-2 relative">
                {isQuerying && (
                  <div className="animate-pulse text-gray-500 flex items-center gap-2">
                    <Sparkles className="animate-spin-slow" />
                    Generating answer...
                  </div>
                )}
                {!isQuerying && answer && (
                  <div className="text-gray-800">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Reference Toggle */}
              {!isQuerying && referance?.length > 0 && (
                <div className="mt-4">
                  <details className="cursor-pointer border rounded-md p-3 bg-gray-100">
                    <summary className="font-medium text-indigo-700">
                      Show References
                    </summary>
                    <div className="mt-2 space-y-2">
                      {referance.map((ref, idx) => (
                        <div
                          key={idx}
                          className="p-3 border border-gray-300 rounded-lg bg-white text-sm shadow"
                        >
                          <p className="font-semibold text-gray-700">
                            📄 Page {ref.pageDetails?.pageNumber || "N/A"}
                          </p>
                          <p className="text-gray-600 whitespace-pre-line">
                            {ref.pageContent}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Lines {ref.pageDetails?.lines?.from} to{" "}
                            {ref.pageDetails?.lines?.to}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input box */}
        <div className="lg:relative flex justify-center items-center mt-4 lg:h-[8vh]">
          <input
            onClick={() => {
              if (selectedIndex === -1) {
                toast.info("Please select an collection for QnA", {
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
              }
            }}
            value={query}
            onChange={(e) => {
              if (selectedIndex == -1) return;

              setQuery(e.target.value);
            }}
            placeholder="Ask something from the PDF..."
            className="border border-gray-300 rounded-2xl   px-4 py-2 lg:w-[60%] w-[95%] lg:text-lg focus:outline-none focus:ring-2 pr-10 mb-10 lg:pr-12 focus:ring-indigo-500  "
          />

          {/* used_query >= col.query_limit */}
          <button
            hidden={
              selectedIndex !== -1 &&
              collections?.length > selectedIndex &&
              collections[selectedIndex].used_query >=
                collections[selectedIndex].query_limit
            }
            onClick={handleQuery}
            className="absolute bottom-2 cursor-pointer lg:bottom-11 right-[7%] lg:right-[20%]"
          >
            {!isQuerying ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                viewBox="0 0 512 512"
                className="lg:text-2xl text-lg text-indigo-600 hover:text-indigo-800 transition mr-1"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M48 448l416-192L48 64v149.333L346 256 48 298.667z"></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6 animate-spin text-indigo-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
