"use client";

import Fileupload from "@/components/Fileupload";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Plus, X, ChevronUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast, Bounce } from "react-toastify";
import useStore from "@/lib/store";
import Lottie from "lottie-react";
import animationData from "@/public/Loading.json";
import animationData2 from "@/public/Spinner.json";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const {
    collections,
    setCollection,
    baseUser,
    setBaseUser,
    showItems,
    setShowItems,
    showNav,
    setShowNav,
    upgrade,
    setUpgrade,
  } = useStore();
  const template = useRef();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [referance, SetReferance] = useState(null);
  const [show, setShow] = useState("");
  const { user, isLoaded } = useUser();
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

      const coldata = await fetch("/api/update-collection", {
        method: "POST",
        headers: myHeaders,
        body: raw2,
      });

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
        // console.log("data",data);
        if (data.user.role === "subscribedUser") {
          setUpgrade();
          // console.log("upl");
        }
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
  // const [] = useState(false);
  const [selectColls, setSelectedCols] = useState("");

  // console.log(isMobile);

  return (
    <div className="lg:h-[86vh] lg:w-full flex flex-col lg:flex-row">
      {/* Left side: Upload */}
      <div className="lg:w-[30vw] flex justify-center  border-r  border-gray-300 ">
        {isLoaded && baseUser ? (
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
            }}
            transition={{ duration: 0.7, ease: "linear" }}
            className="w-full px-4 transition-all delay-500 pt-6 space-y-0"
          >
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
              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
                }}
                transition={{ duration: 1, ease: "linear" }}
              >
                <div className="text-left border-b pb-3">
                  <p className="font-semibold text-gray-800 text-lg">
                    {baseUser?.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Role: {baseUser?.role==='subscribedUser' ? 'Premium':baseUser?.role}
                  </p>
                </div>

                {/* Collection Creation Limit */}
                <div className="text-sm text-gray-700 p-3 rounded-md border border-gray-300">
                  <div className="w-full max-w-md p-4  rounded-3xl shadow">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Collections Created:
                      <span className="font-semibold mx-1">
                        {baseUser?.createdCollection}
                      </span>
                      /
                      <span className="font-semibold mx-1">
                        {baseUser?.collectionLimit}
                      </span>
                    </p>

                    <div className="w-full lg:h-3 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full ${
                          (baseUser?.createdCollection /
                            baseUser?.collectionLimit) *
                            100 >=
                          60
                            ? "bg-red-500"
                            : "bg-green-500"
                        }  rounded-full transition-all duration-300`}
                        style={{
                          width: `${
                            (baseUser?.createdCollection /
                              baseUser?.collectionLimit) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {baseUser?.createdCollection ===
                    baseUser?.collectionLimit && (
                    <p className="text-red-500 mt-1 font-medium text-sm">
                      🚫 You have reached your collection limit.
                    </p>
                  )}
                </div>

                {/* File Upload */}
                {/* File Upload or Subscribe CTA */}
                {baseUser?.createdCollection === baseUser?.collectionLimit ? (
                  <div className="border border-yellow-400 bg-yellow-50 p-4 rounded-md mt-3">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                      🔒 Collection Limit Reached
                    </h3>
                    <p className="text-sm text-yellow-700">
                      You've reached the maximum number of collections allowed
                      in the free plan.
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Upgrade to <span className="font-semibold">Pro</span> to
                      increase your limits and unlock additional features.
                    </p>
                    <button
                      onClick={() => router.push("/subscription")} // change as per your route
                      className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-md p-2 mt-3">
                    <p className="text-gray-600 text-sm p-2">Add Collection</p>
                    <Fileupload />
                  </div>
                )}
              </motion.div>
            )}

            {/* Collections Dropdown */}
            <div className="mt-2">
              <div className="block lg:text-lg text-md font-medium text-gray-700">
                Your Collections
              </div>
              <div
                onClick={() => {
                  if (showNav) setShowNav(false);
                  setShowItems(!showItems);
                }}
                className={`flex overflow-auto lg:max-w-[20vw] capitalize ${
                  showItems && "border-1"
                }  justify-between hover:border-1 bg-gray-200 gap-4 px-3 py-2 min-w-[160] cursor-pointer hover:bg-gray-300`}
              >
                {selectColls.length == 0 ? (
                  <div className="">-- Select a Collection --</div>
                ) : (
                  <div>{selectColls}</div>
                )}{" "}
                <ChevronUp />
              </div>

              {showItems && (
                <div className="border-1 absolute border-t-0 px-3 py-2 z-0 bg-gray-200 overflow-auto lg:max-w-[20vw] lg:max-h-[30vh] w-[92vw]">
                  {collections.map((col, i) => {
                    const isLimitReached =
                      col.used_query >= (upgrade ? 15 : col.query_limit);
                    return (
                      <div
                        key={col._id || i}
                        value={i}
                        // disabled={isLimitReached}
                        className="flex  "
                        onClick={() => {
                          setSelectedCols(col.name);
                          setSelectedIndex(i);
                          setShowItems(false);
                        }}
                      >
                        <div className="flex  gap-4 px-3 py-2 w-full  cursor-pointer hover:bg-gray-300">
                          <p className="capitalize">{col.name}</p>
                          <p className="text-red-400">
                            {isLimitReached ? " - Limit Reached" : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* </select> */}

              {/* Note about disabled options */}
              {collections?.some(
                (col) => col.used_query >= (upgrade ? 15 : col.query_limit)
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
          </motion.div>
        ) : (
          <div className="flex items-center opacity-35 fl p-4">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{
                height: isMobile ? 100 : 300,
                width: isMobile ? 200 : 300,
              }}
            />
          </div>
        )}
      </div>

      {/* Right side: QnA */}
      <div
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:w-[70vw] flex flex-col justify-between p-4"
      >
        {/* Answer display */}
        <div className="flex justify-between">
          <motion.button
            whileTap={{ scale: 1.1 }}
            onClick={() => {
              setShowChats(!showChats);
            }}
            className="bg-blue-200 text-blue-700 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 font-semibold py-1 px-2 m-1 cursor-pointer  shadow-sm"
          >
            {showChats ? "hide" : "show"} chats
          </motion.button>
          {selectedIndex != -1 && collections && (
            <div>
              <div className="text-sm text-gray-600">
                chat-limits : {collections[selectedIndex]?.used_query}/
                {upgrade ? 15 : collections[selectedIndex]?.query_limit}{" "}
              </div>
              <div className="text-xs text-gray-500 text-right">
                resets {upgrade ? "daily" : "weekly"}
              </div>
            </div>
          )}
        </div>
        <div className="border border-gray-200 rounded-xl shadow p-4 lg:h-[77vh] h-[60vh] overflow-y-auto">
          {!answer && !isQuerying && !showChats && (
            <h1 className="lg:absolute flex flex-col items-center justify-center lg:top-100 lg:ml-30    mt-30  lg:mt-0 lg:right-130 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 lg:text-3xl text-2xl font-bold">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                Think Smarter,
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                Talk Better—with ChatAI
              </motion.div>
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
                <motion.div
                  initial={{ y: 200, opacity: 0.1 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="flex justify-end mb-4"
                >
                  <div className="max-w-[70%] bg-slate-300 text-left text-black p-3 rounded-l-2xl rounded-tr-2xl text-sm lg:text-lg">
                    {show}
                  </div>
                </motion.div>
              )}

              {/* Answer area */}
              <motion.div
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="flex items-start gap-2 lg:text-lg text-left p-2"
              >
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
              </motion.div>

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
        <motion.div
          initial={{ y: 100, opacity: 0.1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`relative ${
            showNav && "opacity-0"
          }  transition-all duration-700 flex justify-center items-center mt-4 lg:h-[8vh]`}
        >
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleQuery();
              }
            }}
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
            className="border border-gray-300 rounded-2xl   px-4 py-2 lg:w-[60%] w-[95%] lg:text-lg focus:outline-none focus:ring-2 pr-10 mb-10 lg:pr-11 focus:ring-indigo-500  "
          />
          {/* used_query >= (upgrade ? 15:col.query_limit) */}
          <button
            hidden={
              selectedIndex !== -1 &&
              collections?.length > selectedIndex &&
              collections[selectedIndex].used_query >=
                collections[selectedIndex].query_limit
            }
            onClick={handleQuery}
            className="absolute top-2 cursor-pointer lg:top-0   right-[4%] lg:right-[20%]"
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
              <Lottie
                animationData={animationData2}
                loop={true}
                style={{
                  height: isMobile ? 25 : 35,
                  width: isMobile ? 25 : 35,
                }}
              />
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
