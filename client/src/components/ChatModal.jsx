import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { X, Send, Loader2 } from "lucide-react";
import { getSocket } from "../services/socketService";

export default function ChatModal({ rental, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text,     setText]     = useState("");
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const socket      = getSocket();

  const ownerId    = typeof rental.owner === "object" ? rental.owner?._id : rental.owner;
  const userId     = typeof rental.user  === "object" ? rental.user?._id  : rental.user;
  const isOwner    = currentUser._id === ownerId;
  const receiverId = isOwner ? userId : ownerId;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chat/${rental._id}`);
        setMessages(res.data);
      } catch (err) { console.error("Failed to load messages", err); }
      finally      { setLoading(false); }
    };
    fetchMessages();
    socket.emit("join_chat", rental._id);

    const handleReceiveMessage = (newMessage) => setMessages((prev) => [...prev, newMessage]);
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [rental._id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await api.post("/api/chat", { rentalId: rental._id, text: text.trim(), receiverId });
      socket.emit("send_message", res.data);
      setText("");
    } catch (err) {
      console.error("Failed to send", err);
      alert("Error sending message: " + (err.response?.data?.message || err.message));
    } finally { setSending(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "20px",
          height: "580px",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between flex-shrink-0"
          style={{ background: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h3 className="text-base font-bold text-white">
              Chat about <span style={{ color: "#f59e0b" }}>{rental.productName}</span>
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#525252" }}>
              {isOwner ? "Chatting with Renter" : "Chatting with Owner"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="transition p-1.5 rounded-lg"
            style={{ color: "#525252" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#f0f0f0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#525252"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: "#080808" }}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" size={28} style={{ color: "#f59e0b" }} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-1" style={{ color: "#404040" }}>
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs">Say hi to coordinate your rental!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.sender._id === currentUser._id;
              return (
                <div key={msg._id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] mb-1 px-1" style={{ color: "#404040" }}>
                    {msg.sender.name} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div
                    className="px-4 py-2.5 max-w-[80%] text-sm"
                    style={
                      isMe
                        ? {
                            background: "rgba(245,158,11,0.12)",
                            border: "1px solid rgba(245,158,11,0.18)",
                            color: "#fbbf24",
                            borderRadius: "16px 16px 4px 16px",
                          }
                        : {
                            background: "#141414",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "#d4d4d4",
                            borderRadius: "16px 16px 16px 4px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 flex gap-2 flex-shrink-0"
          style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#f0f0f0",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.35)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="p-2.5 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: text.trim() ? "#d97706" : "#1a1a1a",
              color: text.trim() ? "#080808" : "#404040",
              opacity: sending ? 0.65 : 1,
            }}
          >
            {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </form>
      </div>
    </div>
  );
}
