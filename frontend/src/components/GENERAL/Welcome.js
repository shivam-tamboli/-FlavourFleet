import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import '../CSS/Welcome.css'

const cities = [
  "Delhi NCR","Mumbai","Bengaluru","Hyderabad","Chennai","Kolkata",
  "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Goa",
  "Indore","Coimbatore","Kochi","Nagpur","Vadodara","Agra"
];

const countries = [
  {name:"India",flag:"../IMAGES/CF/india.png"},
  {name:"Australia",flag:"../IMAGES/CF/austallia.png"},
  {name:"Brazil",flag:"../IMAGES/CF/brazil.png"},
  {name:"Canada",flag:"../IMAGES/CF/canada.png"},
  {name:"Indonesia",flag:"../IMAGES/CF/indonesia.png"},
  {name:"Ireland",flag:"../IMAGES/CF/ireland.png"},
  {name:"Italy",flag:"../IMAGES/CF/italy.png"},
  {name:"Lebanon",flag:"../IMAGES/CF/lebanon.png"},
  {name:"Malaysia",flag:"../IMAGES/CF/malaysia.png"},
  {name:"New Zealand",flag:"../IMAGES/CF/new.png"},
  {name:"Philippines",flag:"../IMAGES/CF/philippines.png"},
  {name:"Portugal",flag:"../IMAGES/CF/portugal.png"},
  {name:"Qatar",flag:"../IMAGES/CF/qatar.png"},
  {name:"Singapore",flag:"../IMAGES/CF/singapore.png"},
  {name:"UAE",flag:"../IMAGES/CF/uae.png"},
  {name:"United Kingdom",flag:"../IMAGES/CF/unitedk.png"},
];

export class Welcome extends Component {
  render() {
    return (
      <div className="welcome-page">
        {/* ===== HERO ===== */}
        <div className="welcome-hero">
          <div className="welcome-nav">
            <div className="nav-logo"><span>🚀</span> FlavourFleet</div>
            <div className="nav-links">
              <Link id='AddRestaurantL' to="/">Partner with us</Link>
              <Link to="./Login" id='Login'>Log in</Link>
              <Link to='/Signup' id='Signup'>Sign up</Link>
            </div>
          </div>

          <div id='ZomatoTitle'>
            <h1 className="hero-brand">Flavour<span className="brand-dot">Fleet</span></h1>
            <p className="hero-sub">Discover the best food & drinks, delivered fast to your doorstep</p>
            <div className="hero-search">
              <input type="text" placeholder="Search for restaurants or cuisines..." />
              <button>Search</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="stat-num">500+</div><div className="stat-label">Restaurants</div></div>
              <div className="hero-stat"><div className="stat-num">10K+</div><div className="stat-label">Happy Customers</div></div>
              <div className="hero-stat"><div className="stat-num">50+</div><div className="stat-label">Cities</div></div>
            </div>
          </div>
        </div>

        {/* ===== FEATURES ===== */}
        <div className="features-section">
          <div className="ff-container" style={{textAlign:'center'}}>
            <h2 className="section-title">Why FlavourFleet?</h2>
            <p className="section-subtitle">We're not just delivery — we're an experience</p>
          </div>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-icon">⚡</div><h3>Lightning Fast</h3><p>Average delivery in under 30 minutes across all partner restaurants.</p></div>
            <div className="feature-card"><div className="feature-icon">🍳</div><h3>Curated Quality</h3><p>Every restaurant is hand-picked and reviewed for quality and hygiene.</p></div>
            <div className="feature-card"><div className="feature-icon">💰</div><h3>Best Prices</h3><p>No hidden fees. What you see is what you pay. Always.</p></div>
            <div className="feature-card"><div className="feature-icon">📍</div><h3>Live Tracking</h3><p>Know exactly where your food is — from kitchen to your door.</p></div>
          </div>
        </div>

        {/* ===== CITIES ===== */}
        <div className="cities-section">
          <div className="ff-container">
            <h2 className="section-title">Popular Cities</h2>
            <p className="section-subtitle">Find the best food wherever you are</p>
          </div>
          <div className="cities-grid">
            {cities.map((c,i)=><div className="city-chip" key={i}>{c}</div>)}
          </div>
        </div>

        {/* ===== COUNTRIES ===== */}
        <div className="countries-section">
          <div className="ff-container">
            <h2 className="section-title">We're Global</h2>
            <p className="section-subtitle">Available in 25+ countries worldwide</p>
          </div>
          <div className="countries-grid">
            {countries.map((c,i)=><div className="country-chip" key={i}><img src={c.flag} alt={c.name}/>{c.name}</div>)}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="ff-footer">
          <div className="ff-footer-grid">
            <div className="ff-footer-brand">
              <h2>🚀 FlavourFleet</h2>
              <p>Discover amazing food from the best restaurants, delivered fast to your doorstep. Your favourite meals, just a tap away.</p>
            </div>
            <div className="ff-footer-col">
              <h4>Company</h4>
              <a href="#!">Who We Are</a><a href="#!">Blog</a><a href="#!">Careers</a><a href="#!">Contact</a>
            </div>
            <div className="ff-footer-col">
              <h4>For You</h4>
              <a href="#!">Privacy</a><a href="#!">Terms</a><a href="#!">Security</a><a href="#!">Sitemap</a>
            </div>
            <div className="ff-footer-col">
              <h4>Partners</h4>
              <a href="#!">Add Restaurant</a><a href="#!">For Enterprise</a><a href="#!">Apps</a>
            </div>
            <div className="ff-footer-col">
              <h4>Social</h4>
              <a href="#!">Instagram</a><a href="#!">Twitter</a><a href="#!">LinkedIn</a><a href="#!">YouTube</a>
            </div>
          </div>
          <div className="ff-footer-bottom">© 2026 FlavourFleet™ — All rights reserved. Built with ❤️ for food lovers.</div>
        </footer>
      </div>
    )
  }
}

export default Welcome
