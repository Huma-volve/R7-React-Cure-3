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

async sendMessage(
  token: string,
  chatId: number,
  receiverId: number,
  text?: string,
  file?: File
) {
  const formData = new FormData();
  formData.append("receiver_id", receiverId.toString());
  formData.append("chat_id", chatId.toString());

  let realType = "text"; // used internally in the app

  if (file) {
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) realType = "image";
    else if (mimeType.startsWith("video/")) realType = "video";
    else if (mimeType.startsWith("audio/")) realType = "audio";
    else if (mimeType === "application/pdf") realType = "pdf";
    else realType = "file";

    formData.append("attachment_path", file);
    console.log("File attached:", file.name);
    console.log("Detected type:", realType);
  } else if (text) {
    formData.append("body", text);
  }

  // Always send 'text' to API
  formData.append("type", "text");

  const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
  const data = res.data.data;
    return data
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
