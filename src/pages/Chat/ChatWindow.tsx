import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Archive,
  Edit2,
  Heart,
  MoreVertical,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { getRealMessageType } from "./messageType";
import {chatApis} from "./chatApis"
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Spinner from "@/components/Spinner";

interface User {
  id: number;
  name: string;
  profile_photo?: string | null;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  type: string;
  body: string | null;
  attachment_path?: string | null;
  attachment_mime?: string | null;
  created_at: string;
  sender?: User;
}

interface ChatMeta {
  favorite?: boolean;
  archived?: boolean;
}

interface Chat {
  chat_id: number;
  id: number;
  receiver?: User;
  meta?: ChatMeta;
  is_favorite?: boolean;
  favorite?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  currentUserId: number;
  loading: boolean;
  selectedChat?: Chat;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
  onChatDelete?: () => void;
  onChatArchive?: () => void;
  onChatFavorite?: () => void | Promise<void>;
  onBack?: () => void;
}

export default function ChatWindow({
  messages,
  currentUserId,
  loading,
  selectedChat,
  onEdit,
  onDelete,
  onChatDelete,
  onChatArchive,
  onChatFavorite,
  onBack,
}: ChatWindowProps) {
    const token = useSelector((state: RootState) => state.auth.token);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [favLoading, setFavLoading] = useState(false);
const [archiveLoading, setArchiveLoading] = useState(false);
const [deleteChatLoading, setDeleteChatLoading] = useState(false);


  useEffect(() => {
  setLocalMessages(messages);
}, [messages]);



//  const fetchMessages = async () => {
//   if (!selectedChat) return;
//   try {
//     const updatedMessages: Message[] = await chatApis.getChatMessages(token, selectedChat.chat_id);

//     const processedMessages = updatedMessages.map((m) => {
//       if (!m.body && (m.attachment_path || m.attachment_path)) {
//         return {
//           ...m,
//           body: m.attachment_path || m.attachment_path || "",
//         };
//       }
//       return m;
//     });

//     setLocalMessages(processedMessages);
//   } catch (err) {
//     console.error("Failed to fetch messages:", err);
//   }
// };
useEffect(() => {
  if (!selectedChat) return;
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const updatedMessages: Message[] = await chatApis.getChatMessages(token, selectedChat.chat_id);

      const processedMessages = updatedMessages.map((m) => {
        if (!m.body && (m.attachment_path || m.attachment_path)) {
          return {
            ...m,
            body: m.body  || "",
          };
        }
        return m;
      });

      setLocalMessages(processedMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  fetchMessages(); // initial fetch

  const interval = setInterval(fetchMessages, 1000);
  return () => clearInterval(interval);
}, [ token, selectedChat]);




  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 

  useEffect(() => {
    setIsFavorite(
      Boolean(
        selectedChat?.meta?.favorite ??
          selectedChat?.is_favorite ??
          selectedChat?.favorite ??
          false
      )
    );
  }, [selectedChat]);
const handleFavoriteClick = async () => {
  setFavLoading(true);             // start spinner
  setIsFavorite((prev) => !prev);

  try {
    await onChatFavorite?.();
  } catch {
    setIsFavorite((prev) => !prev);
  } finally {
    setFavLoading(false);          // stop spinner
  }
};
const handleArchiveClick = async () => {
  setArchiveLoading(true);

  try {
    await onChatArchive?.();
  } finally {
    setArchiveLoading(false);
  }
};
const handleDeleteChat = async () => {
  setDeleteChatLoading(true);

  try {
    await onChatDelete?.();
  } finally {
    setDeleteChatLoading(false);
  }
};



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropdownId !== null &&
        !dropdownRefs.current[openDropdownId]?.contains(e.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  if (loading)
    return <div className="flex-1 flex items-center pt-60 justify-center"><Spinner  /></div>;

  // if (!messages.length)
  //   return (
  //     <div className="flex-1 flex items-center justify-center text-gray-400">
  //       No messages yet
  //     </div>
  //   );

  const receiver = selectedChat?.receiver;

  return (
    <div className="flex flex-col flex-1 bg-gray-50 h-full w-full">
      {receiver && (
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                title="Go Back"
                onClick={onBack}
                className="mr-2 p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <img
              src={receiver.profile_photo || "/doctor.jpg"}
              alt={receiver.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-800">
                {receiver.name || "User"}
              </h2>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>

          <div className="flex gap-2">
      <button
  title="Favorite"
  onClick={handleFavoriteClick}
  disabled={favLoading}
  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
>
  {favLoading ? (
    // Spinner here
    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
  ) : (
    <Heart
      className={`w-5 h-5 ${
        isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
      }`}
    />
  )}
</button>

           <button
  title="Archive Chat"
  onClick={handleArchiveClick}
  disabled={archiveLoading}
  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
>
  {archiveLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
  ) : (
    <Archive
      className={`w-5 h-5 ${
        selectedChat?.meta?.archived
          ? "text-gray-500 fill-[#99A1AF]"
          : "text-gray-400"
      }`}
    />
  )}
</button>

            <button
  title="Delete Chat"
  onClick={handleDeleteChat}
  disabled={deleteChatLoading}
  className="p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
>
  {deleteChatLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
  ) : (
    <Trash2 className="w-5 h-5 text-red-500" />
  )}
</button>

          </div>
        </div>
      )}

      {/* ===== Messages ===== */}
      <div className="flex-1 overflow-y-auto p-4 w-full">
        {localMessages.map((m) => {
          const isMine = m.sender_id === currentUserId;
          const time = new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const url = m.attachment_path
            ? `https://round7-cure.huma-volve.com/storage/${m.attachment_path}`
            : null;

          return (
            <div
              key={m.id}
              className={`flex flex-col mb-4 ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`relative p-3 px-4 rounded-2xl max-w-[75%] ${
                  isMine
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {isMine && (
                  <div
                    ref={(el) => {
                      dropdownRefs.current[m.id] = el;
                    }}
                    className="absolute top-1 right-2"
                  >
                    <button
                      title="More Options"
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === m.id ? null : m.id)
                      }
                      className="p-1 py-1.5 rounded-full hover:bg-white/20"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openDropdownId === m.id && (
                      <div className="absolute right-0 mt-1 w-28 bg-white border rounded-md shadow-lg z-30">
                        <button
                          onClick={() => {
                            setEditingId(m.id);
                            setEditText(m.body || "");
                            setOpenDropdownId(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(m.id);
                            setOpenDropdownId(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {editingId === m.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full p-2 rounded-md text-white text-sm"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      title="Edit message"
                      placeholder="Edit your message"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          onEdit(m.id, editText);
                          setEditingId(null);
                        }}
                        className="bg-green-500 text-white px-2 py-1 rounded-md text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded-md text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
               ) : url ? (
  (() => {
    const realType = getRealMessageType(
      undefined,
      url,
      m.body
    );

    switch (realType) {
      case "image":
        return <img src={url} alt="img" className="max-h-60 pt-4 lg:w-[350px] rounded-lg" />;

      case "video":
        return (
          <video controls className="lg:w-[350px] md:w-[350px] pt-4 sm:w-full  rounded-lg">
            <source src={url} type={m.attachment_mime || "video/mp4"} />
          </video>
        );

      case "audio":
        return <audio controls src={url} className="lg:w-[350px] lg:pt-2 lg:pe-3 sm:w-[200px] pe-2 w-[200px] sm:pe-3 " />;

case "pdf":
case "file": {
  const fileName = url?.split("/").pop(); // get just the file name from URL
  return (
    <div className="flex pt-4 flex-col">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-100  w-full break-words lg:w-[350px] px-3 py-2 rounded-lg inline-block text-sm text-blue-600 hover:bg-gray-200"
      >
        {fileName || "Download File"}
      </a>

      {m.body?.trim() && (
        <p className="px-4 pt-2 pb-1 text-left">{m.body}</p>
      )}
    </div>
  );
}


    }
  })()
  
) : (
  <p className="px-4 pt-2 pb-1 text-left">{m.body}</p>
)}


                <div className="text-xs mt-1 opacity-70 text-right">{time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
