import axios from "axios";

const BASE_URL = "https://round7-cure.huma-volve.com/api";

export const chatApis = {
  async getAllChats(token: string) {
    const res = await axios.get(`${BASE_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  async getChatMessages(token: string, chatId: number) {
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
    return res.data.data;
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

    let type = "text";

    if (file) {
      const mimeType = file.type;
      if (mimeType.startsWith("image/")) type = "image";
      else if (mimeType.startsWith("video/")) type = "video";
      else if (mimeType.startsWith("audio/")) type = "audio";
      else type = "file";

      formData.append("attachment_path", file);
    } else if (text) {
      formData.append("body", text);
    }

    formData.append("type", type);

    const res = await axios.post(`${BASE_URL}/chats/send`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return res.data.data;
  },
};
