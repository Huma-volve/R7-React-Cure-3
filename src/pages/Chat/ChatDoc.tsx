/**
 * Imports React and several hooks for state management and side effects.
 * Also imports UI icons from `lucide-react` to use in the chat interface.
 */

/**
 * MessageFile Interface
 * Represents a file (image, audio, document) attached to a chat message.
 */
 
/**
 * Message Interface
 * Represents a single chat message with optional text or file data.
 * Includes metadata like sender, receiver, and creation timestamp.
 */

/**
 * Conversation Interface
 * Represents a chat conversation between two participants.
 * Stores unread message count and last message preview.
 */

/**
 * FakeDB Interface
 * Defines the entire in-memory/localStorage database structure:
 * - users: user profiles by ID
 * - conversations: list of chat conversations
 * - messages: dictionary of messages grouped by conversation ID
 */

/**
 * initialFakeDB
 * Pre-populated mock database with:
 * - 3 users (you, doctor, nurse)
 * - 2 sample conversations
 * - Several example messages.
 * This acts as a local data seed before loading from localStorage.
 */

/**
 * loadFakeDB()
 * Loads the fake database from localStorage if available.
 * Falls back to `initialFakeDB` if not found or if parsing fails.
 * This allows persistent chat data between page reloads.
 */

/**
 * saveFakeDB(db)
 * Persists the given fake database object into localStorage as JSON.
 * Ensures messages and conversations are saved locally after updates.
 */

/**
 * fakeAPI
 * A simulated API layer that mimics real network calls using promises.
 * Provides:
 * - fetchConversations: retrieves conversation list
 * - fetchMessages: retrieves all messages for a conversation
 * - sendMessage: adds a new message, updates conversation preview,
 *   and saves the updated database.
 * 
 * Uses small delays (via setTimeout) to imitate async server behavior.
 */

/**
 * Chat Component
 * The main React functional component that renders the chat UI.
 * Handles conversation selection, message sending, file uploads, and audio recording.
 */
 
/**
 * React State Variables:
 * - fakeDB: holds the current in-memory database
 * - conversations: list of all chat conversations
 * - selectedConv: the currently active conversation
 * - messages: all messages for the selected conversation
 * - input: text currently typed by the user
 * - recording: whether voice recording is active
 * - mobileView: toggles between 'list' and 'chat' views on small screens
 */

/**
 * Refs:
 * - messagesEndRef: scroll target to auto-scroll chat to bottom
 * - mediaRecorderRef: reference to the MediaRecorder instance for audio capture
 */

/**
 * useEffect: Load Conversations
 * Runs when the fake database changes.
 * Fetches the conversation list and updates the state.
 */

/**
 * useEffect: Auto-scroll
 * Automatically scrolls the chat view to the bottom
 * whenever the messages array changes.
 */

/**
 * selectConversation(conv)
 * Triggered when a user clicks a conversation.
 * Loads its messages, resets unread count, and switches view (on mobile).
 */

/**
 * handleSend(text?, file?)
 * Sends a new message to the selected conversation.
 * Supports both text and file messages.
 * Implements optimistic UI (shows message immediately before fakeAPI responds).
 * Updates last message preview and saves to localStorage.
 */

/**
 * handleFileChange(e)
 * Handles file input change events.
 * Creates a temporary blob URL for the selected file,
 * then calls `handleSend` to send it as a file message.
 */

/**
 * startRecording()
 * Starts or stops recording audio using the browser MediaRecorder API.
 * When stopped, converts the recorded audio to Base64 data URL
 * and sends it as an audio message.
 * Handles microphone permissions and stream cleanup.
 */

/**
 * useMemo: otherUser
 * Derives the "other participant" (doctor/nurse) in the selected conversation.
 * Used to display their name, avatar, and online status.
 */

/**
 * JSX Layout Overview:
 * The component layout is divided into two main sections:
 *
 * 1. Sidebar (Conversation List)
 *    - Displays all conversations with avatars, last message, and unread count.
 *    - Shows user info at the top.
 *
 * 2. Main Chat Area
 *    - Displays header with recipient info.
 *    - Shows message list (with text, image, audio, or file previews).
 *    - Contains input area for typing, sending files, and voice messages.
 */

/**
 * Message Rendering
 * Each message is aligned left or right depending on sender.
 * Supports displaying:
 * - plain text
 * - inline images
 * - audio player
 * - downloadable file links
 * Shows timestamp for each message below its bubble.
 */

/**
 * Input Section
 * Provides:
 * - File upload button
 * - Text input field (with Enter-to-send)
 * - Microphone button (for recording)
 * - Send button
 * Each control is conditionally enabled only if a conversation is selected.
 */

/**
 * Mobile Responsiveness
 * Uses `mobileView` state to toggle between
 * the conversation list and the active chat
 * when viewed on small screen devices.
 */
