import { useState, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { ChefHat, X, Utensils } from "lucide-react";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";

const LiveKitModal = ({ setShowSupport }) => {
  const [isSubmittingName, setIsSubmittingName] = useState(true);
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getToken = useCallback(async (userName) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/getToken?name=${encodeURIComponent(userName)}`
      );
      const token = await response.text();
      setToken(token);
      setIsSubmittingName(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      getToken(name);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-bg"></div>
          <div className="modal-header-content">
            <div className="modal-header-info">
              <div className="modal-header-icon">
                <ChefHat className="icon text-white" />
              </div>
              <div className="modal-header-text">
                <h1>Restaurant Support</h1>
                <p>How can we help you today?</p>
              </div>
            </div>
            <button
              onClick={() => setShowSupport(false)}
              className="modal-close-button"
            >
              <X className="icon text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {isSubmittingName ? (
            <div className="name-form-container">
              <div className="name-form-header">
                <div className="name-form-icon">
                  <Utensils className="icon-lg text-white" />
                </div>
                <h2 className="name-form-title">Welcome to Our Restaurant</h2>
                <p className="name-form-subtitle">Connect with our AI assistant for reservations, menu questions, and support</p>
              </div>
              
              <form onSubmit={handleNameSubmit} className="name-form">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={isLoading}
                    className="name-input"
                  />
                </div>
                
                <div className="form-buttons">
                  <button
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className="submit-button"
                  >
                    {isLoading ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      "Start Conversation"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowSupport(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : token ? (
            <LiveKitRoom
              serverUrl={import.meta.env.VITE_LIVEKIT_URL}
              token={token}
              connect={true}
              video={false}
              audio={true}
              onDisconnected={() => {
                setShowSupport(false);
                setIsSubmittingName(true);
              }}
            >
              <RoomAudioRenderer />
              <SimpleVoiceAssistant />
            </LiveKitRoom>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LiveKitModal;