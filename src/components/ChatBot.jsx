import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setIsTyping(false);
      const aiMsg = { from: "ai", text: data.response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "AI hiện đang bận, thử lại sau." },
      ]);
    }
  };

  return (
    <>
      <motion.div
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-white shadow-xl rounded-full p-4 cursor-pointer z-50"
        animate={{
          y: [0, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.15,
          boxShadow: "0 0 20px rgba(59,130,246,0.5)",
        }}
      >
        <div className="relative">
          <FaRobot className="text-blue-600 text-3xl" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
            AI
          </span>
        </div>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              fixed bottom-24 right-6 w-[360px] h-[480px]
              sm:w-[360px] sm:h-[480px]
              xs:w-[300px] xs:h-[420px]
              max-[480px]:w-[95%] max-[480px]:h-[70vh] max-[480px]:right-2 max-[480px]:bottom-20
              flex flex-col rounded-2xl shadow-2xl bg-white overflow-hidden border border-gray-200 z-50
            "
          >
            <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
              <span className="font-semibold text-base">DevChill AI</span>
              <FaTimes
                className="cursor-pointer hover:text-gray-200"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                        m.from === "user"
                          ? "bg-blue-200 text-black"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                    }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm flex space-x-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce [animation-delay:0.2s]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:0.4s]">
                        .
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef}></div>
            </div>
            <div className="flex border-t border-gray-300 bg-white p-2">
              <input
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500 text-black placeholder-gray-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập câu hỏi của bạn..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
