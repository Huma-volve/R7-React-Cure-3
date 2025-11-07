import React from 'react'
import { useState, useRef } from "react";
import axios from "axios";

export default function useChatAPI() {
   const API_BASE = "https://round7-cure.huma-volve.com/api/";
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fetchchats = async() => {
    const res = await axios.get(`${API_BASE}chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setConversations(res.data.data );
    console.log(res.data.data)
  };
  
  
  
    return (
    <div>
      
    </div>
  )
}
