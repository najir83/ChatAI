import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const TypingComponent = () => {
  const el = useRef(null); // for storing the HTML element
  const typed = useRef(null); // for storing the Typed instance

  useEffect(() => {
    typed.current = new Typed(el.current, {
      strings: [
        "Upload Any PDF",
        "Ask Natural Questions 💬",
        "Get Instant Answers ⚡ ",
        "Save Time and Stay Focused ✨",
      ],
      typeSpeed: 50,
      backSpeed: 100,
      loop: true,
    });

    return () => {
      typed.current.destroy(); 
    };
  }, []);

  return (
    <div className="lg:text-xl text-sm font-bold">
      <span ref={el} />
    </div>
  );
};

export default TypingComponent;
