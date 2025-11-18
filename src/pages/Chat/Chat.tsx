import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { chatApis } from "./chatApis";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import axios from "axios";
import type { Chat } from "./ChatList";

// ==== Define Types ====
// ==== Shared Types ====
// interface User {
//   id: number;
//   name: string;
//   email?: string;
//   avatar?: string;
// }

interface Message {
  id: number;
  body: string;
  sender_id: number;
  receiver_id: number;
  attachment_path?: string;
  attachment_mime?: string;
  type: string;
  created_at: string;
}

// interface ChatMeta {
//   favorite?: boolean;
//   archived?: boolean;
// }

// interface Chat {
//   id: number; 
//   chat_id: number;
//   receiver: User;
//   meta?: ChatMeta;
// }

// ✅ Fixed handleSelect to match expected (non-async)

import { useLocation } from "react-router-dom";

export default function ChatPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);
const location = useLocation();
const openChatId = location.state?.openChatId;

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(openChatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Mobile layout state
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  // ✅ handle adding new chat and selecting it
  const handleCreateChat = (chat: Chat) => {
    setChats(prev => [chat, ...prev]); // add new chat at the top
    setSelectedChat(chat);             // immediately open it
  };
  // Detect window size (for mobile vs desktop)
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowChatList(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch chats (poll every 5s)
  // useEffect(() => {
  //   if (!token) return;
  //   let mounted = true;
  //   const fetchChats = async () => {
  //     try {
  //       const data = await chatApis.getAllChats(token);
  //       if (mounted) setChats(data || []);
  //     } catch (err) {
  //       console.error("❌ Failed to fetch chats:", err);
  //     }
  //   };
  //   fetchChats();
  //   const interval = setInterval(fetchChats, 5000);
  //   return () => {
  //     mounted = false;
  //     clearInterval(interval);
  //   };
  // }, [token]);


const initialChatSelected = useRef(false);

useEffect(() => {
  if (!token) return;
  let mounted = true;

  const fetchChats = async () => {
    try {
      const data = await chatApis.getAllChats(token);
      if (!mounted) return;

      setChats(data || []);

      // Only select the initial chat once
      if (!initialChatSelected.current && openChatId) {
        const data: Chat[] = await chatApis.getAllChats(token);
        const targetChat = data.find((c) => c.chat_id === openChatId);
        if (targetChat) {
          setSelectedChat(targetChat);
          fetchMessages(targetChat.chat_id);
          if (isMobile) setShowChatList(false);
          initialChatSelected.current = true;
        }
      }

    } catch (err) {
      console.error("❌ Failed to fetch chats:", err);
    }
  };

  fetchChats();
  const interval = setInterval(fetchChats, 5000);
  return () => {
    mounted = false;
    clearInterval(interval);
  };
}, [token, openChatId, isMobile]);




  // Fetch messages for selected chat
  const fetchMessages = async (chatId: number) => {
    if (!token) return;
    setLoadingMessages(true);
    try {
      const msgs = await chatApis.getChatMessages(token, chatId);
      setMessages(msgs || []);
    } catch (err) {
      console.error("❌ Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

const handleSelect = (chat: Chat) => {
  setSelectedChat(chat);
  fetchMessages(chat.chat_id);
  if (isMobile) setShowChatList(false);
};



  const handleChatDelete = async () => {
    if (!selectedChat || !token) return;
    try {
      await chatApis.deleteChat(token, selectedChat.chat_id);
      setChats((prev: Chat[]) =>
        prev.filter((c) => c.chat_id !== selectedChat.chat_id)
      );
      setSelectedChat(null);
      setMessages([]);
      if (isMobile) setShowChatList(true);
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
    }
  };

  const handleEdit = async (id: number, newText: string) => {
    if (!token) return;
    try {
      await chatApis.updateMessage(token, id, newText);
      setMessages((prev: Message[]) =>
        prev.map((m) => (m.id === id ? { ...m, body: newText } : m))
      );
    } catch (err) {
      console.error("❌ Edit failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await chatApis.deleteMessage(token, id);
      setMessages((prev: Message[]) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const handleToggleFavorite = async (chatId: number) => {
    if (!token) return;
    try {
      const updatedMeta = await chatApis.toggleFavorite(token, chatId);
      setChats((prev: Chat[]) =>
        prev.map((c) =>
          c.chat_id === chatId
            ? { ...c, meta: { ...c.meta, ...updatedMeta } }
            : c
        )
      );
      if (selectedChat?.chat_id === chatId)
        setSelectedChat((prev) =>
          prev ? { ...prev, meta: { ...prev.meta, ...updatedMeta } } : null
        );
    } catch (err) {
      console.error("❌ Failed to toggle favorite:", err);
    }
  };

  const handleToggleArchive = async (chatId: number) => {
    if (!token) return;
    try {
      const updatedMeta = await chatApis.toggleArchive(token, chatId);
      setChats((prev: Chat[]) =>
        prev.map((c) =>
          c.chat_id === chatId
            ? { ...c, meta: { ...c.meta, ...updatedMeta } }
            : c
        )
      );
      if (selectedChat?.chat_id === chatId)
        setSelectedChat((prev) =>
          prev ? { ...prev, meta: { ...prev.meta, ...updatedMeta } } : null
        );
    } catch (err) {
      console.error("❌ Failed to toggle archive:", err);
    }
  };

// const handleSend = async (text: string, file?: File) => {
//   if (!selectedChat || !token) return;
//   const receiverId = selectedChat.receiver?.id;
//   if (!receiverId) return;

//   try {
//     const message = await chatApis.sendMessage(
//       token,
//       selectedChat.chat_id,
//       receiverId,
//       text,
//       file
//     );

//     if (message) {
//       setMessages((prev) => [...prev, message]);
//     }
// } catch (err: unknown) {
//   if (axios.isAxiosError(err)) {
//     console.error("❌ Failed to send message:", err.response?.data || err.message);
//   } else if (err instanceof Error) {
//     console.error("❌ Failed to send message:", err.message);
//   } else {
//     console.error("❌ Failed to send message:", err);
//   }
// }

// };
const handleSend = async (text: string, file?: File) => {
  if (!selectedChat || !token) return;
  const receiverId = selectedChat.receiver?.id;
  if (!receiverId) return;

  try {
    const res = await chatApis.sendMessage(
      token,
      selectedChat.chat_id,
      receiverId,
      text,
      file
    );

    // Extract the actual message object
    const msg: Message | null = res?.message ?? null;

    if (msg) {
      setMessages((prev) => [...prev, msg]);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("❌ Failed to send message:", err.response?.data || err.message);
    } else if (err instanceof Error) {
      console.error("❌ Failed to send message:", err.message);
    } else {
      console.error("❌ Failed to send message:", err);
    }
  }
};


  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Chat List Sidebar */}
      <div
        className={`${
          isMobile
            ? showChatList
              ? "w-full flex"
              : "hidden"
            : "w-[380px] border-r flex"
        } shrink-0 flex-col`}
      >
        <ChatList
          chats={chats}
          onSelect={handleSelect}
          selectedId={selectedChat?.chat_id}
          onCreateChat={handleCreateChat}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`flex flex-col h-full ${
          isMobile
            ? showChatList
              ? "hidden"
              : "flex w-full"
            : "flex flex-1"
        }`}
      >
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <ChatWindow
                messages={messages}
                currentUserId={currentUser?.id ?? 0}
                loading={loadingMessages}
                selectedChat={selectedChat}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChatDelete={handleChatDelete}
                onChatFavorite={() =>
                  handleToggleFavorite(selectedChat.chat_id)
                }
                onChatArchive={() =>
                  handleToggleArchive(selectedChat.chat_id)
                }
                onBack={() => setShowChatList(true)} // back on mobile
              />
            </div>

            <div className="sticky bottom-0 bg-white border-t">
              <MessageInput onSend={handleSend} />
            </div>
          </>
        ) : (
          !isMobile && (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat
            </div>
          )
        )}
      </div>
    </div>
  );
}
