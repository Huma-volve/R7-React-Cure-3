// import { useState } from "react";
// import { Paperclip, Send, X } from "lucide-react";

// export default function MessageInput({
//   onSend,
// }: {
//   onSend: (text: string, file?: File) => void;
// }) {
//   const [text, setText] = useState("");
//   const [file, setFile] = useState<File | null>(null);

//   const handleSend = () => {
//     if (!text.trim() && !file) return;
//     onSend(text, file || undefined);
//     setText("");
//     setFile(null);
//   };

//   return (
//     <div className="border-t bg-white p-3 flex flex-col gap-2">
//       {/* Attachment Preview */}
//       {file && (
//         <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-md">
//           {file.type.startsWith("image/") && (
//             <img
//               src={URL.createObjectURL(file)}
//               alt="preview"
//               className="w-16 h-16 object-cover rounded-md"
//             />
//           )}
//           <div className="flex-1 text-sm text-gray-700 truncate">
//             {file.name}
//           </div>
//           <button
//             title="Remove Attachment"
//             onClick={() => setFile(null)}
//             className="text-gray-500 hover:text-red-500"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Input & Actions */}
//       <div className="flex items-center gap-3">
//         <label className="p-2 cursor-pointer hover:bg-gray-100 rounded-full">
//           <Paperclip className="w-5 h-5 text-gray-500" />
//           <input
//            title="Attach File"
//            type="file"
//             className="hidden"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//           />
//         </label>

//         <div className="flex items-center bg-gray-100 rounded-2xl px-3 py-2 flex-1">
//           <input
//             type="text"
//             value={text}
//             placeholder="Type a message..."
//             onChange={(e) => setText(e.target.value)}
//             className="flex-1 bg-transparent outline-none px-2 text-sm"
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <button
//           title="Send Message"
//             onClick={handleSend}
//             className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
//           >
//             <Send className="w-4 h-4 text-white" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

export default function MessageInput({
  onSend,
}: {
  onSend: (text: string, file?: File) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      await onSend(text, file || undefined);
      setText("");
      setFile(null);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t bg-white p-3 flex flex-col gap-2">
      {/* Attachment Preview */}
      {file && (
        <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-md">
          {file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-16 h-16 object-cover rounded-md"
            />
          )}
          <div className="flex-1 text-sm text-gray-700 truncate">
            {file.name}
          </div>
          <button
            title="Remove Attachment"
            onClick={() => setFile(null)}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input & Actions */}
      <div className="flex items-center gap-3">
        <label className="p-2 cursor-pointer hover:bg-gray-100 rounded-full">
          <Paperclip className="w-5 h-5 text-gray-500" />
          <input
            title="Attach File"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={sending}
          />
        </label>

        <div className="flex items-center bg-gray-100 rounded-2xl px-3 py-2 flex-1">
          <input
            type="text"
            value={text}
            placeholder="Type a message..."
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent outline-none px-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={sending}
          />
          <button
            title="Send Message"
            onClick={handleSend}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center"
            disabled={sending}
          >
            {sending ? (
              <svg
                className="w-4 h-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
