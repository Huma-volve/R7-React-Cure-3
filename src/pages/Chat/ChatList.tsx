
import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { chatApis } from "./chatApis";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaMusic, FaFileAlt } from "react-icons/fa";
import Spinner from "@/components/Spinner";

// ===============================
// ✅ TYPE DEFINITIONS
// ===============================
interface User {
  id: number;
  name: string;
  profile_photo?: string;
}
type RawChatApi = {
  chat_id: number;
  last_message?: {
    id: number;
    body?: string;
    attachment_url?: string;
    attachment_path?: string;
    created_at?: string;
  };
  receiver?: User;
  unread_count?: number;
  meta?: ChatMeta;
};


interface Message {
  id: number;
  chat_id: number;
  body?: string;
  type?: "text" | "file" | "image" | "audio" | "video";
  created_at?: string;
  timestamp?: string;
  realType?: string;
  attachment_url?: string;
  attachment_path?: string;
}

interface ChatMeta {
  favorite?: boolean;
  archived?: boolean;
}

export interface Chat {
  id: number;
  chat_id: number;
  receiver?: User;
  user_one?: User;
  user_two?: User;
  last_message?: Message;
  unread_count?: number;
  meta?: ChatMeta;
  messages?: Message[];
}

interface Doctor {
  id: number;
  specialty?: string;
  user: User;
}

interface ChatListProps {
  chats: Chat[];
  onSelect: (chat: Chat) => void;
  selectedId?: number;
  onCreateChat: (chat: Chat) => void;
}

export default function ChatList({
  chats,
  onSelect,
  selectedId,
  onCreateChat,
}: ChatListProps) {
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showFilters, setShowFilters] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "favorites" | "archived" | "unread">("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats);

  // Keep filteredChats in sync with parent chats
  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);


   // Fetch doctors list
  useEffect(() => {
    if (!showDoctors) return;

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await axios.get<{ data: Doctor[] }>(
          "https://round7-cure.huma-volve.com/api/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setDoctors(response.data?.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [showDoctors, token]);
  

  // Search (debounced)
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setFilteredChats(chats);
        return;
      }
      if (!token) return;

      try {
        setSearchLoading(true);
        const response = await axios.get(
          `https://round7-cure.huma-volve.com/api/chats/search?name=${encodeURIComponent(searchTerm)}`,
          {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }
        );

        const rawChats = response.data?.chats || [];
        console.log("row", rawChats)

        const normalizedChats: Chat[] = rawChats.map((c: RawChatApi) => {
          const lastMsg: Message | undefined = c.last_message
            ? {
                id: c.last_message.id,
                chat_id: c.chat_id,
                body: c.last_message.body || "",
                attachment_url: c.last_message.attachment_url || c.last_message.attachment_path || "",
              }
            : undefined;

          return {
            ...c,
            last_message: lastMsg,
            receiver: c.receiver,
            unread_count: c.unread_count ?? 0,
          };
        });

        setFilteredChats(normalizedChats);
      } catch (error) {
        console.error("❌ Chat search failed:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, chats, token, currentUser]);

  const baseChats = searchTerm.trim() ? filteredChats : chats;
  console.log("bbbb",baseChats)
  const visibleChats = baseChats.filter((c) => {
    switch (selectedFilter) {
      case "favorites":
        return !!c.meta?.favorite;
      case "archived":
        return !!c.meta?.archived;
      case "unread":
        return Number(c.unread_count) > 0;
      default:
        return true;
    }
  });

  const sortedChats = [...visibleChats].sort((a, b) => {
    const aTime = a.last_message
      ? new Date(a.last_message.created_at ?? a.last_message.timestamp ?? 0).getTime()
      : Infinity;
    const bTime = b.last_message
      ? new Date(b.last_message.created_at ?? b.last_message.timestamp ?? 0).getTime()
      : Infinity;
    return bTime - aTime;
  });
console.log("sssssss",sortedChats)
 // ✅ Returns the last message text from chat
const getLastMessageText = (chat: Chat) => {
  // Use last_message if available
  let msg = chat.last_message;

  // If messages array exists, pick the latest one by created_at or timestamp
  if (!msg && chat.messages?.length) {
    msg = chat.messages.reduce((prev, curr) => {
      const prevTime = new Date(prev.created_at || prev.timestamp || 0).getTime();
      const currTime = new Date(curr.created_at || curr.timestamp || 0).getTime();
      return currTime > prevTime ? curr : prev;
    });
  }
const getAttachmentTypeFromUrl = (url: string ) => {
  const ext = url.split(".").pop()?.toLowerCase();
  if (!ext) return "file";

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return "file";

  return "file"; // fallback
};

 if (!msg) return "No messages yet";

  // If attachment URL exists, check type and show icon/label
 if (msg.attachment_url || msg.attachment_path) {
  const type = getAttachmentTypeFromUrl(msg.attachment_url || msg.attachment_path || "" );
  switch (type) {
    case "video":
      return (
        <div className="flex items-center pt-1 gap-1 text-gray-700">
          <FaVideo className="w-4 h-4 text-blue-500" />
          <span>Video</span>
        </div>
      );

    case "audio":
      return (
        <div className="flex items-center gap-1 pt-1 text-gray-700">
          <FaMusic className="w-4 h-4 text-blue-500" />
          <span>Audio</span>
        </div>
      );

    case "file":
      return (
        <div className="flex items-center gap-1 pt-1 text-gray-700">
          <FaFileAlt className="w-4 text-blue-500 h-4" />
          <span>File</span>
        </div>
      );

    case "image":
      return (
        <div className="flex items-center gap-1 pt-1  text-gray-700">
          <FaImage className="w-4 pt-1 text-blue-500 h-4" />
          <span>Image</span>
        </div>
      );}
}

  // Otherwise, show text body if exists
  if (msg.body) return msg.body;

  return "No messages yet" ;

};


const getLastMessageTime = (chat: Chat) => {
  let msg = chat.last_message;
  if (!msg && chat.messages?.length) {
    msg = chat.messages.reduce((prev, curr) => {
      const prevTime = new Date(prev.created_at || prev.timestamp || 0).getTime();
      const currTime = new Date(curr.created_at || curr.timestamp || 0).getTime();
      return currTime > prevTime ? curr : prev;
    });
  }
  const timestamp = msg?.created_at || msg?.timestamp;
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();

  if (date.toDateString() === now.toDateString())
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (new Date(Date.now() - 86400000).toDateString() === date.toDateString())
    return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};


  const getEmptyMessage = () => {
    if (searchTerm) return "No chats match your search.";
    switch (selectedFilter) {
      case "favorites": return "No favorite chats found.";
      case "archived": return "No archived chats.";
      case "unread": return "No unread chats.";
      default: return <Spinner />;
    }
  };

  const handleDoctorSelect = async (doc: Doctor) => {
    if (!token) return;

    try {
      const res = await chatApis.createChatWithDoctor(token, doc.user.id);
      const chatData = res?.data?.chat;
      if (!chatData) {
        console.error("❌ No chat data returned:", res?.data);
        return;
      }

      const receiver =
        chatData.user_one.id === currentUser?.id
          ? chatData.user_two
          : chatData.user_one;

      const newChat: Chat = {
        chat_id: chatData.id,
        id: chatData.id,
        user_one: chatData.user_one,
        user_two: chatData.user_two,
        receiver,
        last_message: chatData.last_message || undefined,
        unread_count: 0,
        meta: {
          favorite: chatData.meta?.[0]?.favorite,
          archived: chatData.meta?.[0]?.archived,
        },
      };

      const exists = chats.some((c) => c.chat_id === newChat.chat_id);
      if (!exists) onCreateChat(newChat);

      onSelect(newChat);
      setShowDoctors(false);
    } catch (err) {
      console.error("❌ Failed to create chat:", err);
    }
  };

  const navigate = useNavigate();

  return (
    <aside className="h-full bg-white flex flex-col">
      {/* header */}
      <div className="border-b flex items-center justify-between bg-primary-400 text-white relative">
        <div className="flex items-center font-semibold p-4 text-xl gap-4">
          <FaArrowLeft onClick={() => navigate(-1)} size={20} className="cursor-pointer" />
          <h2>Chats</h2>
        </div>

        <button
          title="Filter"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute top-4 right-20 p-2 rounded-full hover:bg-gray-500 transition"
        >
          <Filter className="w-5 h-5" />
        </button>

        <button
          title="Search"
          onClick={() => setShowSearch(!showSearch)}
          className="absolute top-4 right-12 p-2 rounded-full hover:bg-gray-500 transition"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          title="New Chat"
          onClick={() => setShowDoctors(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showSearch && (
        <div className="p-2 border-b bg-gray-50">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring focus:ring-primary-300"
          />
        </div>
      )}

      {showFilters && (
        <div className="p-2 flex gap-3 bg-white text-gray-600 border-b">
          {["all", "favorites", "archived", "unread"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
              className={`capitalize px-3 py-1 rounded-xl transition ${
                selectedFilter === filter ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {searchLoading ? (
          <div className="p-6 text-center text-gray-400"> <Spinner /></div>
        ) : sortedChats.length === 0 ? (
          <div className="p-6 text-center text-gray-400">{getEmptyMessage()}</div>
        ) : (
         sortedChats.map((c) => {
  const user = c.receiver || c.user_one || c.user_two;
  const lastMessage = getLastMessageText(c);   // Pass the full chat
  const lastTime = getLastMessageTime(c);      // Pass the full chat

            return (
              <button
                key={c.chat_id || c.id}
                onClick={() => onSelect(c)}
                className={`w-full flex items-center gap-3 p-3 text-left transition ${
                  c.chat_id === selectedId ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <img
                  src={user?.profile_photo || "/doctor.jpg"}
                  alt={user?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-gray-800 truncate">{user?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">{lastTime}</div>

                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="text-sm text-gray-500 w-60 truncate">{lastMessage}</div>
                    {Number(c.unread_count ?? 0) > 0 && (
                      <span className="text-sm bg-blue-500 text-white justify-center font-bold w-5 h-5 text-center badge rounded-full">
                        {Number(c.unread_count)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {showDoctors && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-4 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a Doctor</h3>
            <button
              onClick={() => setShowDoctors(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {loadingDoctors ? (
              <div className="p-6 text-center text-gray-400">Loading...</div>
            ) : doctors.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No doctors found.</div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <img
                      src={doc.user?.profile_photo || "/doctor.jpg"}
                      alt={doc.user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-700">{doc.user?.name}</span>
                      <span className="text-xs text-gray-400">{doc.specialty || ""}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

