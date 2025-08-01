import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Clock, Users, MapPin } from 'lucide-react';
import '../LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your Perfect
              <span className="highlight"> Stay</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing properties, book instantly, and create unforgettable memories.
              Your dream accommodation is just a click away.
            </p>
            <div className="hero-buttons">
              <Link to="/properties" className="btn btn-primary btn-large">
                Explore Properties
              </Link>
              <Link to="/register" className="btn btn-outline btn-large">
                Join Now
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-image"></div>
              <div className="card-content">
                <h3>Luxury Villa</h3>
                <p>Bali, Indonesia</p>
                <div className="card-rating">
                  <Star className="star-icon" />
                  <span>4.9</span>
                </div>
                <div className="card-price">$299/night</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Search />
              </div>
              <h3>Easy Search</h3>
              <p>Find your perfect property with our advanced search and filtering system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Secure Booking</h3>
              <p>Your payments and personal information are protected with bank-level security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock />
              </div>
              <h3>Instant Confirmation</h3>
              <p>Get immediate booking confirmation and start planning your trip right away.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is available around the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Guests</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Properties</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <div className="destination-image dest-1"></div>
              <div className="destination-content">
                <h3>Bali</h3>
                <p>120+ properties</p>
              </div>
            </div>
            <div className="destination-card">
              <div className="destination-image dest-2"></div>
              <div className="destination-content">
                <h3>Tokyo</h3>
                <p>85+ properties</p>
              </div>
            </div>
            <div className="destination-card">
              <div className="destination-image dest-3"></div>
              <div className="destination-content">
                <h3>Paris</h3>
                <p>95+ properties</p>
              </div>
            </div>
            <div className="destination-card">
              <div className="destination-image dest-4"></div>
              <div className="destination-content">
                <h3>New York</h3>
                <p>150+ properties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of travelers who trust us for their perfect stay.</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;