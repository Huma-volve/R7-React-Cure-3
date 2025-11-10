// // import { Filter, Plus, Search } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import type { RootState } from "@/redux/store";
// // import { chatApis } from "./chatApis";

// // interface ChatListProps {
// //   chats: any[];
// //   onSelect: (chat: any) => void;
// //   selectedId?: number;
// //   onCreateChat: (chat: any) => void;
// // }

// // export default function ChatList({
// //   chats,
// //   onSelect,
// //   selectedId,
// //   onCreateChat,
// // }: ChatListProps) {
// //   const token = useSelector((state: RootState) => state.auth.token);

// //   const [showFilters, setShowFilters] = useState(false);
// //   const [showDoctors, setShowDoctors] = useState(false);
// //   const [doctors, setDoctors] = useState<any[]>([]);
// //   const [loadingDoctors, setLoadingDoctors] = useState(false);
// //   const [selectedFilter, setSelectedFilter] = useState<
// //     "all" | "favorites" | "archived" | "unread"
// //   >("all");

// //   const [showSearch, setShowSearch] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [searchLoading, setSearchLoading] = useState(false);
// //   const [filteredChats, setFilteredChats] = useState<any[]>(chats);

// //   // ✅ Fetch doctors when modal opens (no location / language)
// //   useEffect(() => {
// //     if (!showDoctors) return;

// //     const fetchDoctors = async () => {
// //       setLoadingDoctors(true);
// //       try {
// //         const response = await axios.get(
// //           "https://round7-cure.huma-volve.com/api/doctors",
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               Accept: "application/json",
// //             },
// //           }
// //         );
// //         setDoctors(response.data?.data || []);
// //       } catch (error) {
// //         console.error("❌ Failed to fetch doctors:", error);
// //       } finally {
// //         setLoadingDoctors(false);
// //       }
// //     };

// //     fetchDoctors();
// //   }, [showDoctors, token]);

// //   // 🔍 Chat search
// //   useEffect(() => {
// //     const delay = setTimeout(async () => {
// //       if (!searchTerm.trim()) {
// //         setFilteredChats(chats);
// //         return;
// //       }

// //       try {
// //         setSearchLoading(true);
// //         const response = await axios.get(
// //           `https://round7-cure.huma-volve.com/api/chats/search?name=${encodeURIComponent(
// //             searchTerm
// //           )}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               Accept: "application/json",
// //             },
// //           }
// //         );

// //         const results = response.data?.data || response.data?.chats || [];
// //         setFilteredChats(results);
// //       } catch (error: any) {
// //         console.error("❌ Chat search failed:", {
// //           message: error.message,
// //           status: error.response?.status,
// //           data: error.response?.data,
// //         });
// //       } finally {
// //         setSearchLoading(false);
// //       }
// //     }, 400);

// //     return () => clearTimeout(delay);
// //   }, [searchTerm, chats, token]);

// //   // ✅ Filter visible chats
// //   const baseChats = searchTerm.trim() ? filteredChats : chats;

// //   const visibleChats = baseChats.filter((c) => {
// //     switch (selectedFilter) {
// //       case "favorites":
// //         return !!c.meta?.favorite;
// //       case "archived":
// //         return !!c.meta?.archived;
// //       case "unread":
// //         return Number(c.unread_count) > 0;
// //       default:
// //         return true;
// //     }
// //   });

// //   const getLastMessageTime = (timestamp?: string | number) => {
// //     if (!timestamp) return "";
// //     const date = new Date(timestamp);
// //     const now = new Date();
// //     const isToday = date.toDateString() === now.toDateString();
// //     const isYesterday =
// //       new Date(Date.now() - 86400000).toDateString() === date.toDateString();

// //     if (isToday)
// //       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //     if (isYesterday) return "Yesterday";
// //     return date.toLocaleDateString([], { month: "short", day: "numeric" });
// //   };

// //   const getEmptyMessage = () => {
// //     if (searchTerm) return "No chats match your search.";
// //     switch (selectedFilter) {
// //       case "favorites":
// //         return "No favorite chats found.";
// //       case "archived":
// //         return "No archived chats.";
// //       case "unread":
// //         return "No unread chats.";
// //       default:
// //         return "No chats found.";
// //     }
// //   };

// //   // 🩺 Handle doctor click → create chat and open it
// //   const handleDoctorSelect = async (doc: any) => {
// //     if (!token) return;
// //     try {
// //       const res = await chatApis.createChatWithDoctor(token, doc.user.id);
// //       const newChat = res?.data || res;

// //       if (newChat) {
// //         onCreateChat(newChat); // tell parent to open the new chat
// //         setShowDoctors(false);
// //       }
// //     } catch (err: any) {
// //       console.error("❌ Failed to create chat:", err.response?.data || err);
// //     }
// //   };

// //   return (
// //     <aside className="w-full md:w-1/3 border-r overflow-y-hidden bg-white relative">
// //       {/* Header */}
// //       <div className="border-b flex items-center justify-between bg-primary-400 text-white relative">
// //         <h2 className="font-semibold text-xl p-4">Chats</h2>

// //         <button
// //           title="Filter"
// //           onClick={() => setShowFilters(!showFilters)}
// //           className="absolute top-4 right-20 p-2 rounded-full hover:bg-gray-500 transition"
// //         >
// //           <Filter className="w-5 h-5" />
// //         </button>

// //         <button
// //           title="Search"
// //           onClick={() => setShowSearch(!showSearch)}
// //           className="absolute top-4 right-12 p-2 rounded-full hover:bg-gray-500 transition"
// //         >
// //           <Search className="w-5 h-5" />
// //         </button>

// //         <button
// //           title="New Chat"
// //           onClick={() => setShowDoctors(true)}
// //           className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500 transition"
// //         >
// //           <Plus className="w-5 h-5" />
// //         </button>
// //       </div>

// //       {/* Search Input */}
// //       {showSearch && (
// //         <div className="p-2 border-b bg-gray-50">
// //           <input
// //             type="text"
// //             placeholder="Search chats..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring focus:ring-primary-300"
// //           />
// //         </div>
// //       )}

// //       {/* Filters */}
// //       {showFilters && (
// //         <div className="p-2 flex gap-3 bg-white text-gray-600 border-b">
// //           {["all", "favorites", "archived", "unread"].map((filter) => (
// //             <button
// //               key={filter}
// //               onClick={() => setSelectedFilter(filter as any)}
// //               className={`capitalize px-3 py-1 rounded-xl transition ${
// //                 selectedFilter === filter
// //                   ? "bg-gray-200 font-medium"
// //                   : "hover:bg-gray-100"
// //               }`}
// //             >
// //               {filter}
// //             </button>
// //           ))}
// //         </div>
// //       )}

// //       {/* Chat List */}
// //       <div className="overflow-y-auto">
// //         {searchLoading ? (
// //           <div className="p-6 text-center text-gray-400">Searching...</div>
// //         ) : visibleChats.length === 0 ? (
// //           <div className="p-6 text-center text-gray-400">{getEmptyMessage()}</div>
// //         ) : (
// //           visibleChats.map((rawChat) => {
// //             const c = {
// //               chat_id: rawChat.chat_id || rawChat.id,
// //               receiver:
// //                 rawChat.receiver ||
// //                 rawChat.user_one ||
// //                 rawChat.user_two ||
// //                 null,
// //               last_message: rawChat.last_message || null,
// //               unread_count: rawChat.unread_count || 0,
// //             };

// //             const user = c.receiver;
// //             const lastMessage =
// //               c.last_message?.type === "file"
// //                 ? "📎 File"
// //                 : c.last_message?.type === "image"
// //                 ? "🖼️ Image"
// //                 : c.last_message?.type === "audio"
// //                 ? "🎙️ Voice message"
// //                 : c.last_message?.body || "No messages yet";

// //             const lastTime =
// //               c.last_message?.created_at || c.last_message?.timestamp;

// //             return (
// //               <button
// //                 key={c.chat_id}
// //                 onClick={() => onSelect(c)}
// //                 className={`w-full flex items-center gap-3 p-3 text-left transition ${
// //                   c.chat_id === selectedId ? "bg-gray-100" : "hover:bg-gray-50"
// //                 }`}
// //               >
// //                 <img
// //                   src={user?.profile_photo || "/doctor.jpg"}
// //                   alt={user?.name || "User"}
// //                   className="w-10 h-10 rounded-full object-cover"
// //                 />
// //                 <div className="flex-1 flex flex-col">
// //                   <div className="flex justify-between items-center">
// //                     <div className="font-medium text-gray-800 truncate">
// //                       {user?.name || "Unknown"}
// //                     </div>
// //                     <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
// //                       {getLastMessageTime(lastTime)}
// //                     </div>
// //                   </div>
// //                   <div className="text-sm text-gray-500 truncate">{lastMessage}</div>
// //                 </div>
// //                 {c.unread_count > 0 && (
// //                   <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
// //                     {c.unread_count}
// //                   </span>
// //                 )}
// //               </button>
// //             );
// //           })
// //         )}
// //       </div>

// //       {/* 🩺 Doctor Modal */}
// //       {showDoctors && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-4 relative">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-3">
// //               Select a Doctor
// //             </h3>

// //             <button
// //               onClick={() => setShowDoctors(false)}
// //               className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
// //             >
// //               ✕
// //             </button>

// //             {loadingDoctors ? (
// //               <div className="p-6 text-center text-gray-400">Loading...</div>
// //             ) : doctors.length === 0 ? (
// //               <div className="p-6 text-center text-gray-400">No doctors found.</div>
// //             ) : (
// //               <div className="max-h-80 overflow-y-auto">
// //                 {doctors.map((doc) => (
// //                   <button
// //                     key={doc.id}
// //                     onClick={() => handleDoctorSelect(doc)}
// //                     className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition"
// //                   >
// //                     <img
// //                       src={doc.user?.profile_photo || "/doctor.jpg"}
// //                       alt={doc.user?.name}
// //                       className="w-10 h-10 rounded-full object-cover"
// //                     />
// //                     <div className="flex flex-col items-start">
// //                       <span className="font-medium text-gray-700">
// //                         {doc.user?.name}
// //                       </span>
// //                       <span className="text-xs text-gray-400">
// //                         {doc.specialty || ""}
// //                       </span>
// //                     </div>
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </aside>
// //   );
// // }
// // ChatList.tsx
// import { Filter, Plus, Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";
// import { chatApis } from "./chatApis";

// interface ChatListProps {
//   chats: any[];
//   onSelect: (chat: any) => void;
//   selectedId?: number;
//   onCreateChat: (chat: any) => void;
// }

// export default function ChatList({
//   chats,
//   onSelect,
//   selectedId,
//   onCreateChat,
// }: ChatListProps) {
//   const token = useSelector((state: RootState) => state.auth.token);

//   const [showFilters, setShowFilters] = useState(false);
//   const [showDoctors, setShowDoctors] = useState(false);
//   const [doctors, setDoctors] = useState<any[]>([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState<
//     "all" | "favorites" | "archived" | "unread"
//   >("all");

//   const [showSearch, setShowSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [filteredChats, setFilteredChats] = useState<any[]>(chats);

//   // keep local filteredChats in sync if parent chats change
//   useEffect(() => {
//     setFilteredChats(chats);
//   }, [chats]);

//   useEffect(() => {
//     if (!showDoctors) return;

//     const fetchDoctors = async () => {
//       setLoadingDoctors(true);
//       try {
//         const response = await axios.get(
//           "https://round7-cure.huma-volve.com/api/doctors",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         setDoctors(response.data?.data || []);
//       } catch (error) {
//         console.error("❌ Failed to fetch doctors:", error);
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };

//     fetchDoctors();
//   }, [showDoctors, token]);

//   // Search (debounced)
//   useEffect(() => {
//     const delay = setTimeout(async () => {
//       if (!searchTerm.trim()) {
//         setFilteredChats(chats);
//         return;
//       }
//       try {
//         setSearchLoading(true);
//         const response = await axios.get(
//           `https://round7-cure.huma-volve.com/api/chats/search?name=${encodeURIComponent(
//             searchTerm
//           )}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         const results = response.data?.data || response.data?.chats || [];
//         setFilteredChats(results);
//       } catch (error: any) {
//         console.error("❌ Chat search failed:", {
//           message: error.message,
//           status: error.response?.status,
//           data: error.response?.data,
//         });
//       } finally {
//         setSearchLoading(false);
//       }
//     }, 350);

//     return () => clearTimeout(delay);
//   }, [searchTerm, chats, token]);

//   const baseChats = searchTerm.trim() ? filteredChats : chats;
//   const visibleChats = baseChats.filter((c) => {
//     switch (selectedFilter) {
//       case "favorites":
//         return !!c.meta?.favorite;
//       case "archived":
//         return !!c.meta?.archived;
//       case "unread":
//         return Number(c.unread_count) > 0;
//       default:
//         return true;
//     }
//   });

//   const getLastMessageTime = (timestamp?: string | number) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     const now = new Date();
//     if (date.toDateString() === now.toDateString())
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     if (
//       new Date(Date.now() - 86400000).toDateString() === date.toDateString()
//     )
//       return "Yesterday";
//     return date.toLocaleDateString([], { month: "short", day: "numeric" });
//   };

//   const getEmptyMessage = () => {
//     if (searchTerm) return "No chats match your search.";
//     switch (selectedFilter) {
//       case "favorites":
//         return "No favorite chats found.";
//       case "archived":
//         return "No archived chats.";
//       case "unread":
//         return "No unread chats.";
//       default:
//         return "No chats found.";
//     }
//   };

//   // create chat with doctor (calls parent)
//   const handleDoctorSelect = async (doc: any) => {
//     if (!token) return;
//     try {
//       const res = await chatApis.createChatWithDoctor(token, doc.user.id);
//       const newChat = res?.data || res;
//       if (newChat) {
//         onCreateChat(newChat);
//         setShowDoctors(false);
//       }
//     } catch (err: any) {
//       console.error("❌ Failed to create chat:", err.response?.data || err);
//     }
//   };

//   // NOTE: This component intentionally does not force a width.
//   // The parent (ChatPage) will decide whether it's full width (mobile) or 1/3 width (desktop).
//   return (
//     <aside className="h-full bg-white flex flex-col">
//       {/* header */}
//       <div className="border-b flex items-center justify-between bg-primary-400 text-white relative">
//         <h2 className="font-semibold text-xl p-4">Chats</h2>

//         <button
//           title="Filter"
//           onClick={() => setShowFilters(!showFilters)}
//           className="absolute top-4 right-20 p-2 rounded-full hover:bg-gray-500 transition"
//         >
//           <Filter className="w-5 h-5" />
//         </button>

//         <button
//           title="Search"
//           onClick={() => setShowSearch(!showSearch)}
//           className="absolute top-4 right-12 p-2 rounded-full hover:bg-gray-500 transition"
//         >
//           <Search className="w-5 h-5" />
//         </button>

//         <button
//           title="New Chat"
//           onClick={() => setShowDoctors(true)}
//           className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500 transition"
//         >
//           <Plus className="w-5 h-5" />
//         </button>
//       </div>

//       {showSearch && (
//         <div className="p-2 border-b bg-gray-50">
//           <input
//             type="text"
//             placeholder="Search chats..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring focus:ring-primary-300"
//           />
//         </div>
//       )}

//       {showFilters && (
//         <div className="p-2 flex gap-3 bg-white text-gray-600 border-b">
//           {["all", "favorites", "archived", "unread"].map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setSelectedFilter(filter as any)}
//               className={`capitalize px-3 py-1 rounded-xl transition ${
//                 selectedFilter === filter ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>
//       )}

//       <div className="overflow-y-auto flex-1">
//         {searchLoading ? (
//           <div className="p-6 text-center text-gray-400">Searching...</div>
//         ) : visibleChats.length === 0 ? (
//           <div className="p-6 text-center text-gray-400">{getEmptyMessage()}</div>
//         ) : (
//           visibleChats.map((rawChat) => {
//             const c = {
//               chat_id: rawChat.chat_id || rawChat.id,
//               receiver: rawChat.receiver || rawChat.user_one || rawChat.user_two || null,
//               last_message: rawChat.last_message || null,
//               unread_count: rawChat.unread_count || 0,
//             };
//             const user = c.receiver;
//             const lastMessage =
//               c.last_message?.type === "file"
//                 ? "📎 File"
//                 : c.last_message?.type === "image"
//                 ? "🖼️ Image"
//                 : c.last_message?.type === "audio"
//                 ? "🎙️ Voice message"
//                 : c.last_message?.body || "No messages yet";
//             const lastTime = c.last_message?.created_at || c.last_message?.timestamp;

//             return (
//               <button
//                 key={c.chat_id}
//                 onClick={() => onSelect(c)}
//                 className={`w-full flex items-center gap-3 p-3 text-left transition ${
//                   c.chat_id === selectedId ? "bg-gray-100" : "hover:bg-gray-50"
//                 }`}
//               >
//                 <img
//                   src={user?.profile_photo || "/doctor.jpg"}
//                   alt={user?.name || "User"}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex-1 flex flex-col">
//                   <div className="flex justify-between items-center">
//                     <div className="font-medium text-gray-800 truncate">{user?.name || "Unknown"}</div>
//                     <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">{getLastMessageTime(lastTime)}</div>
//                   </div>
//                   <div className="text-sm text-gray-500 truncate">{lastMessage}</div>
//                 </div>
//                 {c.unread_count > 0 && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">{c.unread_count}</span>}
//               </button>
//             );
//           })
//         )}
//       </div>

//       {/* doctor modal */}
//       {showDoctors && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-4 relative">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a Doctor</h3>

//             <button onClick={() => setShowDoctors(false)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600">✕</button>

//             {loadingDoctors ? (
//               <div className="p-6 text-center text-gray-400">Loading...</div>
//             ) : doctors.length === 0 ? (
//               <div className="p-6 text-center text-gray-400">No doctors found.</div>
//             ) : (
//               <div className="max-h-80 overflow-y-auto">
//                 {doctors.map((doc) => (
//                   <button
//                     key={doc.id}
//                     onClick={() => handleDoctorSelect(doc)}
//                     className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition"
//                   >
//                     <img src={doc.user?.profile_photo || "/doctor.jpg"} alt={doc.user?.name} className="w-10 h-10 rounded-full object-cover" />
//                     <div className="flex flex-col items-start">
//                       <span className="font-medium text-gray-700">{doc.user?.name}</span>
//                       <span className="text-xs text-gray-400">{doc.specialty || ""}</span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }
import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { chatApis } from "./chatApis";

// ===============================
// ✅ TYPE DEFINITIONS
// ===============================
interface User {
  id: number;
  name: string;
  profile_photo?: string;
}

interface Message {
  id: number;
  chat_id: number;
  body?: string;
  type?: "text" | "file" | "image" | "audio";
  created_at?: string;
  timestamp?: string;
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

// ===============================
// ✅ COMPONENT
// ===============================
export default function ChatList({
  chats,
  onSelect,
  selectedId,
  onCreateChat,
}: ChatListProps) {
  const token = useSelector((state: RootState) => state.auth.token);

  const [showFilters, setShowFilters] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "favorites" | "archived" | "unread"
  >("all");

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats);

  // keep local filteredChats in sync if parent chats change
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
  // Debounce the search to avoid spamming API
  const delay = setTimeout(async () => {
    // If search term is empty — show all chats
    if (!searchTerm.trim()) {
      setFilteredChats(chats);
      return;
    }

    if (!token) return; // prevent API call without token

    try {
      setSearchLoading(true);
      const response = await axios.get(
        `https://round7-cure.huma-volve.com/api/chats/search?name=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ✅ Set search results
      setFilteredChats(response.data?.chats || []);
      console.log("✅ Chat search results:", response.data || []);
    } catch (error) {
      console.error("❌ Chat search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  }, 350);

  // Cleanup on unmount or searchTerm change
  return () => clearTimeout(delay);
}, [searchTerm, chats, token]);


  // Filters
  const baseChats = searchTerm.trim() ? filteredChats : chats;
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

  // Format timestamps
  const getLastMessageTime = (timestamp?: string | number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString())
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (
      new Date(Date.now() - 86400000).toDateString() === date.toDateString()
    )
      return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getEmptyMessage = () => {
    if (searchTerm) return "No chats match your search.";
    switch (selectedFilter) {
      case "favorites":
        return "No favorite chats found.";
      case "archived":
        return "No archived chats.";
      case "unread":
        return "No unread chats.";
      default:
        return "No chats found.";
    }
  };

  // Create chat with doctor
  const handleDoctorSelect = async (doc: Doctor) => {
    if (!token) return;
    try {
      const res = await chatApis.createChatWithDoctor(token, doc.user.id);
      const newChat: Chat = res?.data || res;
      if (newChat) {
        onCreateChat(newChat);
        setShowDoctors(false);
      }
    } catch (err) {
      console.error("❌ Failed to create chat:", err);
    }
  };

  // ===============================
  // ✅ RENDER
  // ===============================
  return (
    <aside className="h-full bg-white flex flex-col">
      {/* header */}
      <div className="border-b flex items-center justify-between bg-primary-400 text-white relative">
        <h2 className="font-semibold text-xl p-4">Chats</h2>

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
                selectedFilter === filter
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {searchLoading ? (
          <div className="p-6 text-center text-gray-400">Searching...</div>
        ) : visibleChats.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            {getEmptyMessage()}
          </div>
        ) : (
         visibleChats.map((c) => {
  const user = c.receiver || c.user_one || c.user_two;
  const lastMessage =
    c.last_message?.type === "file"
      ? "📎 File"
      : c.last_message?.type === "image"
      ? "🖼️ Image"
      : c.last_message?.type === "audio"
      ? "🎙️ Voice message"
      : c.last_message?.body || "No messages yet";
  const lastTime =
    c.last_message?.created_at || c.last_message?.timestamp;

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
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-800 truncate">
            {user?.name || "Unknown"}
          </div>
          <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
            {getLastMessageTime(lastTime)}
          </div>
        </div>
        <div className="text-sm text-gray-500 truncate">
          {lastMessage}
        </div>
      </div>

      {/* ✅ show only if unread_count > 0 */}
      {Number(c.unread_count ?? 0) > 0 && (
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
          {Number(c.unread_count)}
        </span>
      )}
    </button>
  
            );
          })
        )}
      </div>

      {/* Doctor Modal */}
      {showDoctors && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-4 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Select a Doctor
            </h3>

            <button
              onClick={() => setShowDoctors(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {loadingDoctors ? (
              <div className="p-6 text-center text-gray-400">Loading...</div>
            ) : doctors.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No doctors found.
              </div>
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
                      <span className="font-medium text-gray-700">
                        {doc.user?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {doc.specialty || ""}
                      </span>
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
