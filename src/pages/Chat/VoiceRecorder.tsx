// import { useEffect, useRef, useState } from "react";
// import { Mic, Square } from "lucide-react";

// interface VoiceRecorderProps {
//   onRecordComplete: (blob: Blob) => void;
// }

// export default function VoiceRecorder({ onRecordComplete }: VoiceRecorderProps) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<BlobPart[]>([]);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1);
//       }, 1000);
//     } else if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       chunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         onRecordComplete(blob);
//         stream.getTracks().forEach((track) => track.stop());
//         setRecordingTime(0);
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Microphone access denied or unavailable:", err);
//       alert("Unable to access microphone. Please check permissions.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const formatTime = (sec: number) => {
//     const m = Math.floor(sec / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = (sec % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   return (
//     <div className="flex items-center gap-2">
//       {isRecording && (
//         <span className="text-sm text-red-600 font-medium">
//           ⏺ {formatTime(recordingTime)}
//         </span>
//       )}
//       <button
//         onClick={isRecording ? stopRecording : startRecording}
//         className={`flex items-center justify-center w-10 h-10 rounded-full transition ${
//           isRecording
//             ? "bg-red-600 hover:bg-red-700"
//             : "bg-gray-200 hover:bg-gray-300"
//         }`}
//         title={isRecording ? "Stop Recording" : "Start Recording"}
//       >
//         {isRecording ? (
//           <Square className="w-5 h-5 text-white" />
//         ) : (
//           <Mic className="w-5 h-5 text-gray-600" />
//         )}
//       </button>
//     </div>
//   );
// }
