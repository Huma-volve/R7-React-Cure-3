import axios from "axios";

const BASE_URL = "https://round7-cure.huma-volve.com/api";
export const chatApis = {
  async getAllChats(token: string) {
    const res = await axios.get(`${BASE_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  async getChatMessages(token: string | null, chatId: number) {
    const res = await axios.get(`${BASE_URL}/chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.messages;
  },

  async updateMessage(token: string, id: number, newText: string) {
    const res = await axios.put(
      `${BASE_URL}/messages/${id}`,
      { body: newText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async deleteMessage(token: string, id: number) {
    const res = await axios.delete(`${BASE_URL}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  async deleteChat(token: string, chatId: number) {
    const res = await axios.delete(`${BASE_URL}/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async createChatWithDoctor(token: string, doctorId: number) {
    const res = await axios.post(
      `${BASE_URL}/chats`,
      { receiver_id: doctorId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res;
  },

  async toggleFavorite(token: string, chatId: number) {
    const res = await axios.patch(
      `${BASE_URL}/chats/${chatId}/favorite`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.meta;
  },

  async toggleArchive(token: string, chatId: number) {
    const res = await axios.patch(
      `${BASE_URL}/chats/${chatId}/archive`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.meta;
  },

// async sendMessage(
//   token: string,
//   chatId: number,
//   receiverId: number,
//   text?: string,
//   file?: File
// ) {
//   const formData = new FormData();
//   formData.append("receiver_id", receiverId.toString());
//   formData.append("chat_id", chatId.toString());

//   let realType = "text"; // used internally in the app

//   if (file) {
//     const mimeType = file.type;

//     if (mimeType.startsWith("image/")) realType = "image";
//     else if (mimeType.startsWith("video/")) realType = "video";
//     else if (mimeType.startsWith("audio/")) realType = "audio";
//     else if (mimeType === "application/pdf") realType = "pdf";
//     else realType = "file";

//     formData.append("attachment", file);
//     console.log("File attached:", file.name);
//     console.log("Detected type:", realType);
//   } else if (text) {
//     formData.append("body", text);
//   }

//   // Always send 'text' to API
//   formData.append("type", "text");

//   const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",
//       Accept: "application/json",
//     },
//   });
//   const data = res.data.data;
//     return data
  
// }


async  sendMessage(
  token: string,
  chatId: number,
  receiverId: number,
  text?: string,
  file?: File
) {
  const formData = new FormData();
  formData.append("receiver_id", receiverId.toString());
  formData.append("chat_id", chatId.toString());

  // ---- 1) Detect URL in body ----
  const isURL = text && /(https?:\/\/[^\s]+)/.test(text);
  let detectedType: "text" | "image" | "video" | "audio" | "pdf" | "file" = "text";

  if (isURL) {
    const url = text!;
    const ext = url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)) detectedType = "image";
    else if (["mp4", "webm"].includes(ext!)) detectedType = "video";
    else if (["mp3", "wav", "ogg"].includes(ext!)) detectedType = "audio";
    else if (ext === "pdf") detectedType = "pdf";
    else detectedType = "file";

    formData.append("body", url);
  }

  // ---- 2) If sending a file normally ----
  if (file) {
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) detectedType = "image";
    else if (mimeType.startsWith("video/")) detectedType = "video";
    else if (mimeType.startsWith("audio/")) detectedType = "audio";
    else if (mimeType === "application/pdf") detectedType = "pdf";
    else detectedType = "file";

    formData.append("attachment", file);
    formData.append("body", "");
  }

  // ---- 3) If normal text ----
  if (!file && !isURL && text) {
    formData.append("body", text);
    detectedType = "text";
  }

  // ✔ Backend wants "type" = text ALWAYS
  formData.append("type", "text");

  const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  // ---- 4) RETURN message with detectedType so UI can show it immediately ----
  return {
    chat: res.data.data.chat_id,
    message: {
      ...res.data.data.message,
      realType: detectedType,
      attachment_url: isURL ? text : res.data.data.message.attachment_url,
    },
  };
}

 

// async sendMessage(
//   token: string,
//   chatId: number,
//   receiverId: number,
//   text?: string,
//   file?: File
// ) {
//   const formData = new FormData();
//   formData.append("receiver_id", receiverId.toString());
//   formData.append("chat_id", chatId.toString());

//   // Detect file type
//   if (file) {
//     const mimeType = file.type;

//     let realType = "file"; // default
//     if (mimeType.startsWith("image/")) realType = "image";
//     else if (mimeType.startsWith("video/")) realType = "video";
//     else if (mimeType.startsWith("audio/")) realType = "audio";
//     else if (mimeType === "application/pdf") realType = "pdf";

//     formData.append("attachment", file);
//     formData.append("body", ""); // backend may require body
//   } else if (text) {
//     formData.append("body", text);
//   }

//   // API wants "text" always
//   formData.append("type", "text");

//   const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",
//       Accept: "application/json",
//     },
//   });

//   // 🚀 THIS is the part you want!
//   return {
//     chat: res.data.data.chat_id,
//     message: res.data.data.message,
//   };
// }

// async sendMessage(
//   token: string,
//   chatId: number,
//   receiverId: number,
//   text?: string,
//   file?: File
// ) {
//   const formData = new FormData();
//   formData.append("receiver_id", receiverId.toString());
//   formData.append("chat_id", chatId.toString());

//   const realType = getRealMessageType(file, undefined, text);

//   if (file) {
//     formData.append("attachment_path", file);
//   } else if (text) {
//     formData.append("body", text);
//   }

//   // Always send 'text' to the API
//   formData.append("type", "text");

//   const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",
//       Accept: "application/json",
//     },
//   });

//   // Return the realType separately for local UI usage
//   return { ...res.data.data, realType };
// }


//     async sendMessage(
//     token: string,
//     chatId: number,
//     receiverId: number,
//     text?: string,
//     file?: File
    
//   ) {
//     const formData = new FormData();
//     formData.append("receiver_id", receiverId.toString());
//     formData.append("chat_id", chatId.toString());

//     let type: "text" | "image" | "audio" | "video" | "file" = "text";
//     let attachmentUrl: string | null = null;

//     // 🔹 If there's a file, upload it to Cloudinary first
//     if (file) {
//       const mimeType = file.type;

//       if (mimeType.startsWith("image/")) type = "image";
//       else if (mimeType.startsWith("video/")) type = "video";
//       else if (mimeType.startsWith("audio/")) type = "audio";
//       else type = "file";

//       try {
//         const cloudData = new FormData();
//         cloudData.append("file", file);
//         cloudData.append("upload_preset", UPLOAD_PRESET);

//         // Upload to Cloudinary
//         const cloudRes = await axios.post(
//           `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
//           cloudData
//         );

//         attachmentUrl = cloudRes.data.secure_url;
//     if (attachmentUrl) {
//   formData.append("attachment_path", attachmentUrl);
// }

//       } catch (err) {
//         console.error("❌ Cloudinary upload failed:", err);
//         throw new Error("Failed to upload file to Cloudinary");
//       }
//     } else if (text) {
//       // 🔹 Regular text message
//       type = "text";
//       formData.append("body", text);
//     }

//     // Always include the message type
//     formData.append("type", type);

//     // 🔹 Send to your backend API
//     const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//         Accept: "application/json",
//       },
//     });

//     return res.data.data;
//   },
};
