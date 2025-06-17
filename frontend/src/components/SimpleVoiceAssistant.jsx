import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState, useRef } from "react";
import { Bot, User, Mic, MicOff } from "lucide-react";
import "./SimpleVoiceAssistant.css";

const Message = ({ type, text }) => {
  return (
    <div className={`message-bubble ${type === "agent" ? "agent" : "user"}`}>
      <div className="message-avatar">
        {type === "agent" ? (
          <Bot className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>
      <div className="message-content">
        <div className="message-header">
          {type === "agent" ? "Restaurant Assistant" : "You"}
        </div>
        <div className="message-text">{text}</div>
      </div>
    </div>
  );
};

const SimpleVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const conversationRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  // Update messages when transcriptions change
  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  // Auto-scroll when messages change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  // Also scroll when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  const getStateIcon = () => {
    switch (state) {
      case "listening":
        return <Mic className="w-6 h-6 text-green-500 animate-pulse" />;
      case "thinking":
        return <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />;
      case "speaking":
        return <Bot className="w-6 h-6 text-blue-500 animate-bounce" />;
      default:
        return <MicOff className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStateText = () => {
    switch (state) {
      case "listening":
        return "Listening to your request...";
      case "thinking":
        return "Processing your request...";
      case "speaking":
        return "Assistant is responding...";
      default:
        return "Ready to help you";
    }
  };

  return (
    <div className="restaurant-voice-container">
      {/* Status Header */}
      <div className="status-header">
        <div className="status-indicator">
          {getStateIcon()}
          <span className="status-text">{getStateText()}</span>
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="visualizer-section">
        <div className="visualizer-wrapper">
          <BarVisualizer 
            state={state} 
            barCount={12} 
            trackRef={audioTrack}
            className="restaurant-visualizer"
          />
        </div>
        <div className="visualizer-glow"></div>
      </div>

      {/* Control Bar */}
      <div className="control-section">
        <VoiceAssistantControlBar />
      </div>

      {/* Conversation */}
      <div className="conversation-section">
        <div className="conversation-header">
          <h3>Conversation</h3>
          <div className="conversation-count">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </div>
        </div>
        <div className="conversation-messages" ref={conversationRef}>
          {messages.length === 0 ? (
            <div className="empty-conversation">
              <Bot className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-gray-500">Start speaking to begin your conversation with our restaurant assistant</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <Message key={msg.id || index} type={msg.type} text={msg.text} />
              ))}
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleVoiceAssistant;