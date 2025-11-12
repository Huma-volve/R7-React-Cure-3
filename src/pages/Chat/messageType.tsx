// src/utils/messageType.ts

// Global helper to detect real type from file or attachment URL
export function getRealMessageType(file?: File, attachmentUrl?: string, body?: string | null) {
  if (file) {
    const mime = file.type;
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (mime === "application/pdf") return "pdf";
    return "file";
  }

  if (attachmentUrl) {
    const lower = attachmentUrl.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".gif"))
      return "image";
    if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".avi")) return "video";
    if (lower.endsWith(".mp3") || lower.endsWith(".wav") || lower.endsWith(".ogg")) return "audio";
    if (lower.endsWith(".pdf")) return "pdf";
    return "file";
  }

  // fallback for text messages
  if (body && body.trim()) return "text";
  return "unknown";
}
