import { useEffect, useRef } from "react";

const AIWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the script is loaded only once
    const scriptId = "elevenlabs-convai-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Ensure the AI widget is loaded only once inside the container
    if (containerRef.current && !containerRef.current.querySelector("elevenlabs-convai")) {
      const aiElement = document.createElement("elevenlabs-convai");
      aiElement.setAttribute("agent-id", "58eoPaLbBIZYiGGUhuiq");
      aiElement.style.position = "static"; // Ensures it does not float
      containerRef.current.appendChild(aiElement);
    }
  }, []);

  return <div ref={containerRef} className="w-full flex justify-center" />;
};

export default AIWidget;
