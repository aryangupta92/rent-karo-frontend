import { useEffect, useState } from "react";
import api from "../services/api";
import { MessageSquare, Loader2, ArrowUpRight } from "lucide-react";
import ChatModal from "../components/ChatModal";
import { useNavigate } from "react-router-dom";

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [chatRental,    setChatRental]    = useState(null);
  const navigate    = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await api.get("/api/rentals/inbox");
        setConversations(res.data);
      } catch (err) { console.error("Failed to load inbox", err); }
      finally      { setLoading(false); }
    };
    fetchInbox();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-16 px-6" style={{ background: "#080808", color: "#f0f0f0" }}>
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">
              Your <span className="gradient-text">Inbox</span>
            </h1>
            <p className="text-sm" style={{ color: "#737373" }}>
              Coordinate pickups and drop-offs with your renters and owners.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={36} style={{ color: "#f59e0b" }} />
          </div>
        ) : conversations.length === 0 ? (
          <div
            className="text-center py-24 animate-fade-in rounded-2xl"
            style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <MessageSquare size={56} className="mx-auto mb-5" style={{ color: "#1a1a1a" }} />
            <h3 className="text-2xl font-semibold mb-2" style={{ color: "#525252" }}>No active conversations</h3>
            <p className="mb-8" style={{ color: "#404040" }}>Chats will appear here when your rentals are confirmed.</p>
            <button onClick={() => navigate("/browse")} className="btn-primary flex items-center gap-2 mx-auto">
              Browse Items <ArrowUpRight size={15} />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((rental) => {
              const isOwner   = rental.owner._id === currentUser._id;
              const otherUser = isOwner ? rental.user : rental.owner;
              return (
                <div
                  key={rental._id}
                  onClick={() => setChatRental(rental)}
                  className="rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all duration-200 group animate-fade-in"
                  style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)";
                    e.currentTarget.style.background = "#111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.background = "#0f0f0f";
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {otherUser.avatar ? (
                        <img src={otherUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base font-bold" style={{ color: "#525252" }}>
                          {otherUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold transition-colors duration-200" style={{ color: "#f0f0f0" }}>
                        {otherUser.name}
                      </h3>
                      <p className="text-sm flex items-center gap-2 mt-0.5" style={{ color: "#525252" }}>
                        <span style={{ color: "#f59e0b", fontWeight: 500 }}>
                          {isOwner ? "Renting your" : "Owner of"}
                        </span>
                        {rental.productName}
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.18)",
                      color: "#fbbf24",
                    }}
                  >
                    Chat
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {chatRental && (
        <ChatModal rental={chatRental} onClose={() => setChatRental(null)} />
      )}
    </div>
  );
}

export default Inbox;
