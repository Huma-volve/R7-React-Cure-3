import React, { useState, useEffect, useMemo, useRef, type JSX } from "react";
import {
  Plus,
  Send,
  Mic,
  ArrowLeft,
  Image as ImageIcon,
  Paperclip,
  Mic as MicIcon,
} from "lucide-react";

// interface User {
//   id: string;
//   name: string;
//   avatar: string;
// }
interface MessageFile {
  name: string;
  type: string;
  url: string;
}
interface Message {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  text?: string;
  file?: MessageFile;
  createdAt: string;
}
interface Conversation {
  id: string;
  participants: string[];
  unread: number;
  lastMessage: string;
  name: string;
  user_id: string;
}
interface FakeDB {
  users: {
    [key: string]: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  conversations: Conversation[];
  messages: {
    [conversationId: string]: Message[];
  };
}

const initialFakeDB: FakeDB = {
  users: {
    me: { id: "me", name: "You", avatar: "public/Ellipse 1538 (1).png" },
    doctor: {
      id: "doctor",
      name: "Dr. Smith",
      avatar: "public/Ellipse 1538 (1).png",
    },
    nurse: {
      id: "nurse",
      name: "Dr. Emily",
      avatar: "public/Ellipse 1538 (1).png",
    },
  },
  conversations: [
    {
      id: "1",
      name: "Dr. Smith",
      user_id: "doctor",
      participants: ["me", "doctor"],
      unread: 2,
      lastMessage: "Don’t forget to take your meds.",
    },
    {
      id: "2",
      name: "Nurse Emily",
      user_id: "nurse",
      participants: ["me", "nurse"],
      unread: 0,
      lastMessage: "Glad to hear you’re feeling better!",
    },
  ],
  messages: {
    "1": [
      {
        id: "m1",
        conversationId: "1",
        from: "doctor",
        to: "me",
        text: "Hello! How are you feeling today?",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        id: "m2",
        conversationId: "1",
        from: "me",
        to: "doctor",
        text: "A bit tired, doctor.",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: "m3",
        conversationId: "1",
        from: "doctor",
        to: "me",
        text: "Don’t forget to take your meds.",
        createdAt: new Date().toISOString(),
      },
    ],
    "2": [
      {
        id: "m4",
        conversationId: "2",
        from: "nurse",
        to: "me",
        text: "Glad to hear you’re feeling better!",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
  },
};

function loadFakeDB() {
  try {
    const saved = localStorage.getItem("chatAppDB");
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn("Error loading DB:", err);
  }
  return initialFakeDB;
}
function saveFakeDB(db: FakeDB) {
  try {
    localStorage.setItem("chatAppDB", JSON.stringify(db));
  } catch (err) {
    console.warn("Error saving DB:", err);
  }
}

const fakeAPI = {
  fetchConversations: async (db: FakeDB) => db.conversations,
  fetchMessages: async (db: FakeDB, id: string) => db.messages[id] || [],
  sendMessage: async (db: FakeDB, msg: Message) => {
    await new Promise((r) => setTimeout(r, 200));
    const newMsg = {
      ...msg,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!db.messages[msg.conversationId]) db.messages[msg.conversationId] = [];
    db.messages[msg.conversationId].push(newMsg);

    // ✅ Determine lastMessage preview
    const conv = db.conversations.find(
      (c: Conversation) => c.id === msg.conversationId
    );
    if (conv) {
      if (msg.file) {
        if (msg.file.type.startsWith("image/"))
          conv.lastMessage = "🖼️ Image";
        else if (msg.file.type.startsWith("audio/"))
          conv.lastMessage = "🎤 Voice message";
        else conv.lastMessage = "📎 File";
      } else {
        conv.lastMessage = msg.text || "";
      }
    }

    saveFakeDB(db);
    return newMsg;
  },
};

export default function Chat(): JSX.Element {
  const [fakeDB, setFakeDB] = useState(loadFakeDB());
  const currentUser = fakeDB.users.me;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    (async () => {
      const convs = await fakeAPI.fetchConversations(fakeDB);
      setConversations(convs);
    })();
  }, [fakeDB]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function selectConversation(conv: Conversation) {
    setSelectedConv(conv);
    const msgs = await fakeAPI.fetchMessages(fakeDB, conv.id);
    setMessages(msgs.slice());
    conv.unread = 0;
    setConversations((prev) => [...prev]);
    if (window.innerWidth < 768) setMobileView("chat");
  }

  async function handleSend(text?: string, file?: MessageFile) {
    if (!selectedConv || (!text && !file)) return;
    const recipient = selectedConv.participants.find(
      (p) => p !== currentUser.id
    )!;
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConv.id,
      from: currentUser.id,
      to: recipient,
      text,
      file,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    const serverMsg = await fakeAPI.sendMessage(fakeDB, optimistic);
    setFakeDB({ ...fakeDB });
    setMessages((prev) =>
      prev.map((m) => (m.id === optimistic.id ? serverMsg : m))
    );
    setConversations((prev) => [...prev]);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedConv) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    await handleSend(undefined, { name: file.name, type: file.type, url });
    e.target.value = "";
  }

  async function startRecording() {
    try {
      if (recording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      setRecording(true);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      // ✅ FIXED SECTION — convert audio blob to Base64 so it persists after refresh
      mediaRecorder.onstop = async () => {
        if (chunks.length === 0) return;
        const blob = new Blob(chunks, { type: "audio/webm" });

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          await handleSend(undefined, {
            name: `audio-${Date.now()}.webm`,
            type: blob.type,
            url: base64,
          });
          stream.getTracks().forEach((t) => t.stop());
          setRecording(false);
          mediaRecorderRef.current = null;
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Recording error:", err);
      setRecording(false);
    }
  }

  const { otherUser } = useMemo(() => {
    if (!selectedConv) return { otherUser: null };
    const otherId = selectedConv.participants.find(
      (p) => p !== currentUser.id
    )!;
    return { otherUser: fakeDB.users[otherId] };
  }, [selectedConv, currentUser.id, fakeDB]);

  return (
    <div className="w-screen h-screen bg-white text-gray-800 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
      
        <aside
          className={`border-r border-gray-300 flex flex-col bg-white md:col-span-1 ${
            mobileView === "chat" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-50">
            <div className="flex gap-3 items-center">
              <img
                src={currentUser.avatar}
                alt="me"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-lg font-semibold">{currentUser.name}</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const msgs = fakeDB.messages[c.id] || [];
              const lastMsg = msgs[msgs.length - 1];
              const lastTime = lastMsg
                ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              const otherId = c.participants.find(
                (p) => p !== currentUser.id
              )!;
              const user = fakeDB.users[otherId];

              let previewIcon = null;
              if (c.lastMessage.startsWith("🖼️"))
                previewIcon = (
                  <ImageIcon className="w-3 h-3 inline mr-1 text-gray-500" />
                );
              else if (c.lastMessage.startsWith("🎤"))
                previewIcon = (
                  <MicIcon className="w-3 h-3 inline mr-1 text-gray-500" />
                );
              else if (c.lastMessage.startsWith("📎"))
                previewIcon = (
                  <Paperclip className="w-3 h-3 inline mr-1 text-gray-500" />
                );

              return (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c)}
                  className={`w-full flex items-center p-3 gap-3 text-left transition ${
                    selectedConv?.id === c.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-400">{lastTime}</div>
                    </div>
                    <div className="text-sm text-gray-500 truncate flex items-center">
                      {previewIcon}
                      {c.lastMessage.replace(
                        /^(\p{Emoji_Presentation}|\p{Emoji}\ufe0f)\s*/u,
                        ""
                      )}
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      {c.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat */}
        <main
          className={`md:col-span-2 flex flex-col bg-white ${
            mobileView === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="p-4 border-b border-gray-300 flex items-center gap-4 bg-gray-50">
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden mr-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {otherUser ? (
              <>
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-11 h-11 rounded-full"
                />
                <div>
                  <div className="font-semibold">{otherUser.name}</div>
                  <div className="text-xs text-green-600">online</div>
                </div>
              </>
            ) : (
              <div className="text-gray-400">Select a conversation</div>
            )}
          </div>

          {/* Messages */}
          <div className="p-4 overflow-y-auto h-[75vh] bg-gray-50">
            {!selectedConv ? (
              <div className="text-center text-gray-400 mt-20">
                No conversation selected
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.from === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  } mb-3`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[70%] md:max-w-[75%] ${
                      m.from === currentUser.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    } mx-3 md:mx-0`}
                  >
                    {m.text && (
                      <div className="text-sm whitespace-pre-wrap">
                        {m.text}
                      </div>
                    )}
                    {m.file && (
                      <div className="mt-2">
                        {m.file.type.startsWith("image/") ? (
                          <img
                            src={m.file.url}
                            alt={m.file.name}
                            className="rounded-lg max-w-[200px]"
                          />
                        ) : m.file.type.startsWith("audio/") ? (
                          <audio src={m.file.url} controls />
                        ) : (
                          <a
                            href={m.file.url}
                            download={m.file.name}
                            onClick={(e) => {
                              if (
                                m.file?.url.startsWith("blob:") ||
                                m.file?.url.startsWith("data:")
                              ) {
                                e.preventDefault();
                                const link = document.createElement("a");
                                link.href = m.file.url;
                                link.download = m.file.name || "file";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                            className="text-sm underline"
                          >
                            {m.file.name}
                          </a>
                        )}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400 mt-1 text-right">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-300 flex items-center gap-3 bg-gray-50">
            <label className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
              <Plus className="w-5 h-5 text-gray-700" />
              <input
                title="Upload file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder={selectedConv ? "Type a message..." : "Select a chat"}
              className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none"
              disabled={!selectedConv}
            />

            <button
              onClick={startRecording}
              disabled={!selectedConv}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                recording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {recording ? "●" : <Mic className="w-5 h-5" />}
            </button>

            <button
              title="Send Message"
              onClick={() => handleSend(input)}
              disabled={!selectedConv}
              className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
