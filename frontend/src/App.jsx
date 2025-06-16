import React, { useState } from 'react';
import { ChefHat, Phone, MessageCircle, Clock, MapPin, Star } from 'lucide-react';
import LiveKitModal from './components/LiveKitModal';

function App() {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <ChefHat className="icon text-white" />
              </div>
              <div className="logo-text">
                <h1>Bella Vista Restaurant</h1>
                <p>Authentic Italian Cuisine</p>
              </div>
            </div>
            <button
              onClick={() => setShowSupport(true)}
              className="support-button"
            >
              <MessageCircle className="icon-sm" />
              <span>Get Support</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="main-content">
        <div className="hero-section">
          <h2 className="hero-title">
            Welcome to <span className="gradient-text">Bella Vista</span>
          </h2>
          <p className="hero-description">
            Experience the finest Italian cuisine in an elegant atmosphere. Our AI-powered customer support is here to help with reservations, menu questions, and special requests.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => setShowSupport(true)}
              className="primary-button"
            >
              <MessageCircle className="icon" />
              <span>Talk to Our AI Assistant</span>
            </button>
            <button className="secondary-button">
              <Phone className="icon" />
              <span>Call (555) 123-4567</span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <MessageCircle className="icon text-white" />
            </div>
            <h3 className="feature-title">AI Voice Support</h3>
            <p className="feature-description">
              Get instant help with reservations, menu questions, dietary restrictions, and special requests through our intelligent voice assistant.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">
              <Clock className="icon text-white" />
            </div>
            <h3 className="feature-title">24/7 Availability</h3>
            <p className="feature-description">
              Our AI assistant is available around the clock to help you with your dining needs, even outside regular business hours.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Star className="icon text-white" />
            </div>
            <h3 className="feature-title">Personalized Service</h3>
            <p className="feature-description">
              Our AI learns your preferences and provides personalized recommendations for dishes, wines, and dining experiences.
            </p>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="restaurant-info">
          <div className="restaurant-content">
            <div className="restaurant-details">
              <h3>Visit Our Restaurant</h3>
              <div className="restaurant-info-list">
                <div className="info-item">
                  <MapPin />
                  <span>123 Culinary Street, Food District, NY 10001</span>
                </div>
                <div className="info-item">
                  <Clock />
                  <span>Mon-Sun: 11:00 AM - 11:00 PM</span>
                </div>
                <div className="info-item">
                  <Phone />
                  <span>(555) 123-4567</span>
                </div>
              </div>
            </div>
            <div className="chef-quote">
              <div className="chef-quote-box">
                <ChefHat className="icon-xl" />
                <p className="chef-quote-text">
                  "Experience authentic Italian flavors crafted with passion and served with excellence."
                </p>
                <p className="chef-name">- Chef Marco Rossi</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Support Modal */}
      {showSupport && <LiveKitModal setShowSupport={setShowSupport} />}
    </div>
  );
}

export default App;