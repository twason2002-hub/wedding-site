'use client';

import { useEffect, useState } from 'react';

export default function WeddingInvitation() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Fireworks animation on page load
    const fireworkImages = ['/images/fireworks/fire-1.png', '/images/fireworks/fire-2.png', '/images/fireworks/fire-3.png', '/images/fireworks/fire-4.png'];
    
    const createFirework = (delay: number, index: number) => {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // Distribute between left, center, and right
        let xPosition;
        const section = index % 3;
        if (section === 0) {
          // Left side
          xPosition = Math.random() * (window.innerWidth / 3);
        } else if (section === 1) {
          // Center
          xPosition = window.innerWidth / 3 + Math.random() * (window.innerWidth / 3);
        } else {
          // Right side
          xPosition = (2 * window.innerWidth / 3) + Math.random() * (window.innerWidth / 3 - 400);
        }
        
        firework.style.left = xPosition + 'px';
        firework.style.top = '50%';
        firework.style.transform = 'translateY(-50%)';
        
        const img = document.createElement('img');
        const randomImage = fireworkImages[Math.floor(Math.random() * fireworkImages.length)];
        img.src = randomImage;
        img.alt = 'firework';
        img.style.width = '100%';
        img.style.height = '100%';
        
        firework.appendChild(img);
        document.body.appendChild(firework);
        
        setTimeout(() => {
          if (document.body.contains(firework)) {
            document.body.removeChild(firework);
          }
        }, 6000);
      }, delay);
    };
    
    // Create multiple fireworks with different delays
    for (let i = 0; i < 5; i++) {
      createFirework(i * 1500, i);
    }
    
    let musicStarted = false;
    
    // Enhanced Parallax effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector('.hero') as HTMLElement;
      
      if (hero && scrollY < window.innerHeight) {
        hero.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
      }
      
      // Show sticky header after scrolling past hero
      setShowStickyHeader(scrollY > 300);
      
      // Start music on scroll if not playing
      if (!musicStarted && scrollY > 10) {
        const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
        if (audio && audio.paused) {
          audio.volume = 0.2;
          audio.play().then(() => {
            setIsMusicPlaying(true);
            musicStarted = true;
          }).catch(() => {
            // Still blocked, try on next user interaction
            document.addEventListener('click', () => {
              if (audio.paused) {
                audio.play().then(() => {
                  setIsMusicPlaying(true);
                  musicStarted = true;
                });
              }
            }, { once: true });
          });
        }
      }
    };

    // Enhanced Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animation code removed for simplicity
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Remove event observation for no animations
    // document.querySelectorAll('.event').forEach(card => observer.observe(card));

    // Countdown timer
    const weddingDate = new Date('February 15, 2026 00:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Toast message after 3 seconds
    const toastTimer = setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 15000);
    }, 3000);

    // Auto-play background music immediately
    setTimeout(() => {
      const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
      if (audio) {
        audio.volume = 0.2;
        audio.play().then(() => setIsMusicPlaying(true)).catch(() => {
          console.log('Auto-play blocked - waiting for user interaction');
        });
      }
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      clearTimeout(toastTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Montserrat', sans-serif;
          color: #2e2e2e;
          background: linear-gradient(135deg, #f5f5dc 0%, #e6ddd4 100%);
          padding: 0 5px;
        }
        .page-wrapper {
          opacity: ${isLoaded ? 1 : 0};
          transition: opacity 0.3s ease;
          position: relative;
          z-index: 1;
          width: 90%;
          margin: 0 auto;
          background: #ffffff;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          border-left: 2px solid #d4af37;
          border-right: 2px solid #d4af37;
          overflow: hidden;
        }
        .parallax-lamp {
          position: absolute;
          height: auto;
          z-index: 1;
          pointer-events: none;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .lamp-small { width: 100px; }
        .lamp-medium { width: 150px; }
        .lamp-large { width: 200px; }
        .lamp-1 { top: 5%; left: 5%; animation-delay: 0s; }
        .lamp-2 { top: 10%; right: 8%; animation-delay: 0.5s; }
        .lamp-3 { top: 25%; left: 15%; animation-delay: 1s; }
        .lamp-4 { top: 35%; right: 12%; animation-delay: 1.5s; }
        .lamp-5 { top: 50%; left: 8%; animation-delay: 2s; }
        .lamp-6 { top: 65%; right: 15%; animation-delay: 2.5s; }
        .lamp-7 { top: 75%; left: 18%; animation-delay: 0.3s; }
        .lamp-8 { top: 85%; right: 10%; animation-delay: 0.8s; }
        .lamp-9 { top: 20%; left: 50%; transform: translateX(-50%); animation-delay: 1.2s; }
        .lamp-10 { top: 15%; left: 70%; animation-delay: 1.8s; }
        .lamp-11 { top: 45%; left: 3%; animation-delay: 2.2s; }
        .lamp-12 { top: 60%; right: 25%; animation-delay: 0.7s; }
        .lamp-13 { top: 30%; right: 30%; animation-delay: 1.4s; }
        .lamp-14 { top: 80%; left: 35%; animation-delay: 2.8s; }
        .hero {
          height: 70vh;
          position: relative;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 0 5%;
          color: #b8860b;
          overflow: hidden;
          z-index: 10;
          margin: 0;
        }
        .hero-content {
          width: 45%;
          animation: float 4s ease-in-out infinite;
          z-index: 3;
          position: relative;
          text-align: center;
        }
        .hero-image {
          width: 30%;
          height: 50vh;
          background-image: url('/images/back-5.jpg');
          background-size: cover;
          background-position: center;
          animation: float 4s ease-in-out infinite;
        }
        .hero h1, .hero p {
          position: relative;
          z-index: 2;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          margin: 10px 0;
          color: #8b6914;
        }
        .hero p {
          letter-spacing: 3px;
          font-size: 1rem;
          color: #8b6914;
        }
        section {
          max-width: 900px;
          margin: auto;
          padding: 70px 20px;
          position: relative;
        }
        section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -50vw;
          width: 200vw;
          height: 100%;
          background: url('/images/floral.png') repeat;
          background-size: 100px;
          opacity: 0.1;
          pointer-events: none;
          z-index: -1;
        }
        .title {
          text-align: center;
          margin-bottom: 40px;
        }
        .title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.3rem;
          margin-bottom: 10px;
          color: #b8860b;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        .title h2::before,
        .title h2::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40px;
          height: 25px;
          background: url('/images/floral.png') no-repeat center;
          background-size: contain;
          transform: translateY(-50%);
        }
        .title h2::before {
          left: -50px;
        }
        .title h2::after {
          right: -50px;
          transform: translateY(-50%) scaleX(-1);
        }
        .event-grid {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }
        .event-grid::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, #d4af37, #ffd700, #d4af37);
          transform: translateX(-50%);
        }
        .event {
          background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 15px 35px rgba(0,0,0,.1);
          border: 1px solid rgba(212,175,55,.2);
          text-align: center;
          position: relative;
          width: 45%;
          margin: 20px 0;
          opacity: 1;
        }
        .event::before {
          content: '✨';
          position: absolute;
          width: 30px;
          height: 30px;
          background: transparent;
          border: none;
          border-radius: 50%;
          top: 30px;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .event:nth-child(odd) {
          margin-left: 0;
        }
        .event:nth-child(odd)::before {
          right: -41px;
        }
        .event:nth-child(even) {
          margin-left: 55%;
        }
        .event:nth-child(even)::before {
          left: -41px;
        }
        .about {
          text-align: center;
          line-height: 1.8;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .info {
          background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 15px 35px rgba(0,0,0,.1);
          border: 1px solid rgba(212,175,55,.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
        }
        .info h4 {
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
          color: #b8860b;
          font-size: 1.2rem;
        }
        footer {
          background: linear-gradient(135deg, #2c1810 0%, #1a0f08 100%);
          color: #e6c875;
          text-align: center;
          padding: 40px 20px;
          font-size: .85rem;
        }
        .footer-nav {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .footer-nav a {
          color: #d4af37;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .footer-nav a:hover {
          color: #ffd700;
        }
        button {
          padding: 12px 30px;
          border: none;
          border-radius: 25px;
          background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
          color: #fff;
          cursor: pointer;
          letter-spacing: 2px;
          box-shadow: 0 8px 20px rgba(212,175,55,.3);
          transition: all 0.3s ease;
        }
        button:hover {
          background: linear-gradient(135deg, #b8860b 0%, #8b6914 100%);
          box-shadow: 0 12px 25px rgba(212,175,55,.4);
          transform: translateY(-2px);
        }
        .countdown {
          max-width: 900px;
          margin: 60px auto;
          padding: 50px 20px;
          text-align: center;
          color: #2c1810;
          z-index: 5;
          position: relative;
        }
        .countdown h2 {
          color: #b8860b;
          margin-bottom: 30px;
          text-shadow: 0 1px 2px rgba(255,215,0,.3);
          text-align: center;
        }
        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        .countdown-item {
          background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
          border-radius: 15px;
          padding: 20px 10px;
          border: 1px solid rgba(212,175,55,.2);
          box-shadow: 0 15px 35px rgba(0,0,0,.1);
        }
        .countdown-number {
          font-size: 2.5rem;
          font-weight: 700;
          display: block;
          margin-bottom: 5px;
          color: #b8860b;
          text-shadow: 0 2px 4px rgba(184,134,11,0.3);
        }
        .countdown-label {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #8b6914;
          font-weight: 600;
        }
        .event h3 {
          font-family: 'Playfair Display', serif;
          margin-bottom: 10px;
          color: #b8860b;
          font-size: 1.4rem;
        }
        .event span {
          display: block;
          font-size: .9rem;
          color: #8b6914;
          font-weight: 500;
        }

        .event.show-left {
          animation: popLeft 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .event.show-right {
          animation: popRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .event.show-up {
          animation: popUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popLeft {
          0% { 
            opacity: 0; 
            transform: translateX(-100px) translateY(30px) scale(0.8) rotateY(-15deg); 
          }
          70% { 
            opacity: 1; 
            transform: translateX(10px) translateY(-5px) scale(1.05) rotateY(5deg); 
          }
          100% { 
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1) rotateY(0deg); 
          }
        }
        @keyframes popRight {
          0% { 
            opacity: 0; 
            transform: translateX(100px) translateY(30px) scale(0.8) rotateY(15deg); 
          }
          70% { 
            opacity: 1; 
            transform: translateX(-10px) translateY(-5px) scale(1.05) rotateY(-5deg); 
          }
          100% { 
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1) rotateY(0deg); 
          }
        }
        @keyframes popUp {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.9); 
          }
          70% { 
            opacity: 1; 
            transform: translateY(-10px) scale(1.02); 
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1); 
          }
        }
        @media(max-width: 768px) {
          .hero h1 { font-size: 2.2rem; }
          .hero {
            flex-direction: column;
            height: auto;
            min-height: 80vh;
            padding: 40px 20px;
            gap: 20px;
            overflow: hidden;
          }
          .hero-content, .hero-image {
            width: 90%;
            z-index: 10;
            position: relative;
          }
          .hero-image {
            height: 40vh;
            width: 70%;
          }
          .parallax-lamp {
            display: none !important;
          }
          .sticky-header {
            padding: 10px 15px;
            font-size: 0.8rem;
          }
          .sticky-header h3 {
            font-size: 1.2rem;
          }
          .sticky-header p {
            font-size: 0.7rem !important;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .countdown-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .countdown-number {
            font-size: 2rem;
          }
          body {
            overflow-x: hidden;
          }
          .page-wrapper {
            max-width: 100vw;
            overflow-x: hidden;
          }
          .firework {
            width: 150px;
            height: 150px;
          }
        }
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 350px;
          background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
          border: 2px solid #d4af37;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,.2);
          z-index: 1000;
          transform: translateX(400px);
          opacity: 0;
          transition: all 1.5s ease;
        }
        .toast.show {
          transform: translateX(0);
          opacity: 1;
        }
        .toast-close {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 20px;
          color: #b8860b;
          cursor: pointer;
        }
        .toast h4 {
          color: #b8860b;
          margin: 0 0 10px 0;
          font-family: 'Playfair Display', serif;
        }
        .toast p {
          color: #8b6914;
          font-size: 0.85rem;
          line-height: 1.4;
          margin: 0;
        }
        .toast-icon {
          display: inline-block;
          font-size: 1.2rem;
          margin-right: 8px;
          animation: wave 2s ease-in-out infinite;
        }
        @keyframes fireworkUp {
          0% {
            transform: translateY(50vh) scale(0.3);
            opacity: 0;
          }
          30% {
            transform: translateY(-10vh) scale(0.8);
            opacity: 1;
          }
          70% {
            transform: translateY(-20vh) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-20vh) scale(1.2);
            opacity: 0;
          }
        }
        .firework {
          position: fixed;
          width: 300px;
          height: 300px;
          z-index: 1001;
          pointer-events: none;
          animation: fireworkUp 5s ease-out;
        }
        .firework img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .sticky-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #b8860b 100%);
          color: white;
          text-align: center;
          padding: 15px 20px;
          z-index: 1000;
          transform: translateY(-100%);
          transition: transform 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .sticky-header.show {
          transform: translateY(0);
        }
        .sticky-header h3 {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
        }
        .music-control {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .music-control:hover {
          transform: scale(1.1);
        }
        @media(max-width: 480px) {
          .countdown-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .countdown-number {
            font-size: 1.8rem;
          }
          .toast {
            max-width: 300px;
            right: 10px;
            bottom: 10px;
          }
        }
      `}</style>

      <div className="page-wrapper">
        <audio id="backgroundMusic" loop>
          <source src="/music/bg-music.mp3" type="audio/mpeg" />
        </audio>
        
        <button 
          className="music-control"
          onClick={() => {
            const audio = document.getElementById('backgroundMusic') as HTMLAudioElement;
            if (isMusicPlaying) {
              audio.pause();
              setIsMusicPlaying(false);
            } else {
              audio.volume = 0.2;
              audio.play().then(() => setIsMusicPlaying(true));
            }
          }}
        >
          {isMusicPlaying ? '♪' : '♫'}
        </button>
        <div className={`sticky-header ${showStickyHeader ? 'show' : ''}`}>
          <p style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>ॐ श्री गणेशाय नम</p>
          <h3>Tushar & Babitta</h3>
          <p style={{margin: '5px 0', fontSize: '0.8rem', letterSpacing: '1px'}}>WE INVITE YOU TO CELEBRATE OUR WEDDING</p>
          <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold'}}>15th February 2026</p>
        </div>
        {showToast && (
          <div className={`toast ${showToast ? 'show' : ''}`}>
            <button className="toast-close" onClick={() => setShowToast(false)}>×</button>
            <h4><span className="toast-icon">👋</span>Thanks for Visiting!</h4>
            <p>
              We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness. We are looking forward to see you at the wedding.
            </p>
          </div>
        )}
        <div className="hero">
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-1 lamp-medium" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-2 lamp-small" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-3 lamp-large" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-4 lamp-small" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-5 lamp-medium" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-6 lamp-large" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-7 lamp-small" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-8 lamp-medium" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-9 lamp-large" />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-10 lamp-small" style={{top: '40%', left: '45%'}} />
          <img src="/images/lamp.png" alt="" className="parallax-lamp lamp-11 lamp-medium" style={{top: '60%', left: '55%'}} />
          
          <div className="hero-content">
            <p>ॐ श्री गणेशाय नम</p>
            <h1>Tushar & Babitta</h1>
            <p>WE INVITE YOU TO CELEBRATE OUR WEDDING</p>
            <div className="wedding-date" style={{marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: '#8b6914'}}>
              15th February 2026
            </div>
          </div>
          
          <div className="hero-image"></div>
        </div>

      <section>
        <div className="title">
          <h2>Wedding Events</h2>
        </div>
        <div className="event-grid">
          <div className="event haldi-mehndi">
            <h3>Sagan Ceremony</h3>
            <span>11 February 2026</span>
            <span>Mapple Gold Banquet, Hall No. 4</span>
            <span>7:00 PM Onwards</span>
            <a href="https://maps.google.com/?q=Mapple+Gold+Banquet+Paschim+Vihar+Delhi" target="_blank" style={{color: '#d4af37', textDecoration: 'none', fontSize: '0.9rem', marginTop: '10px', display: 'block'}}>See the Route →</a>
          </div>
          <div className="event haldi-mehndi">
            <h3>Mehandi Night</h3>
            <span>12 February 2026</span>
            <span>Anubhav Banquet Hall, Vikaspuri</span>
            <span>7:00 PM Onwards</span>
            <a href="https://maps.google.com/?q=Anubhav+Banquet+Hall+Vikaspuri+Delhi" target="_blank" style={{color: '#d4af37', textDecoration: 'none', fontSize: '0.9rem', marginTop: '10px', display: 'block'}}>See the Route →</a>
          </div>
          <div className="event">
            <h3>Wedding Ceremony</h3>
            <span>15 February 2026</span>
            <span>J9 Grand Banquet Hall, Jalandhar</span>
            <span>4:00 PM Onwards</span>
            <a href="https://maps.google.com/?q=J9+Grand+Banquet+Hall+Jalandhar" target="_blank" style={{color: '#d4af37', textDecoration: 'none', fontSize: '0.9rem', marginTop: '10px', display: 'block'}}>See the Route →</a>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="title">
          <h2>Meet the Bride & Groom</h2>
        </div>
        <p>
          With the blessings of Lord Ganesha, we joyfully invite you to bless and celebrate 
          the wedding of our beloved Tushar with Babitta. Your presence will make our happiness complete.
        </p>
        <p style={{marginTop: '20px', fontStyle: 'italic'}}>
          ✨ Compliments from the Wassan Family ✨
        </p>
        <button onClick={() => alert('RSVP coming soon!')} style={{marginTop: '30px'}}>RSVP</button>
      </section>

      <section style={{maxWidth: '1600px', padding: '70px 40px'}}>
        <div className="title">
          <h2>Venue Details & Contacts</h2>
        </div>
        <div className="info-grid" style={{maxWidth: '1400px', gap: '30px'}}>
          <div className="info">
            <h4>Sagan Ceremony</h4>
            Mapple Gold Banquet, Hall No. 4<br/>
            Near Radisson Blu Hotel, Paschim Vihar<br/>
            New Delhi – 110085<br/>
            <button onClick={() => window.open('https://maps.google.com/?q=Mapple+Gold+Banquet+Paschim+Vihar+Delhi', '_blank')} style={{marginTop: '10px', fontSize: '0.8rem', padding: '8px 16px'}}>View Location</button>
          </div>
          <div className="info">
            <h4>Mehandi Night</h4>
            Anubhav Banquet Hall<br/>
            J3, J-Block Road, Vikaspuri<br/>
            New Delhi – 110018<br/>
            <button onClick={() => window.open('https://maps.google.com/?q=Anubhav+Banquet+Hall+Vikaspuri+Delhi', '_blank')} style={{marginTop: '10px', fontSize: '0.8rem', padding: '8px 16px'}}>View Location</button>
          </div>
          <div className="info">
            <h4>Wedding Ceremony</h4>
            J9 Grand Banquet Hall<br/>
            G.T. Road, Bypass, Opp. IOCT Terminal<br/>
            Jalandhar<br/>
            <button onClick={() => window.open('https://maps.google.com/?q=J9+Grand+Banquet+Hall+Jalandhar', '_blank')} style={{marginTop: '10px', fontSize: '0.8rem', padding: '8px 16px'}}>View Location</button>
          </div>
          <div className="info">
            <h4>Contact Numbers</h4>
            9056314930<br/>
            9811899227<br/>
            9999250975<br/>
            <button onClick={() => window.open('https://wa.me/919056314930', '_blank')} style={{marginTop: '10px', fontSize: '0.8rem', padding: '8px 16px', backgroundColor: '#25D366', color: 'white'}}>WhatsApp</button>
          </div>
        </div>
      </section>

      <section>
        <div className="title">
          <h2>Things To Know</h2>
        </div>
        <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
          <div style={{background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)', padding: '30px', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,.1)', border: '1px solid rgba(212,175,55,.2)', marginBottom: '20px'}}>
            <h4 style={{color: '#b8860b', marginBottom: '15px', fontFamily: 'Playfair Display, serif'}}>Family Contact</h4>
            <p style={{margin: '5px 0', color: '#8b6914'}}>Sh. Rajinder Kumar Wassan & Smt. Rekha Rani</p>
          </div>
          <div style={{background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)', padding: '30px', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,.1)', border: '1px solid rgba(212,175,55,.2)', marginBottom: '20px'}}>
            <h4 style={{color: '#b8860b', marginBottom: '15px', fontFamily: 'Playfair Display, serif'}}>Blessings From</h4>
            <p style={{margin: '5px 0', color: '#8b6914'}}>Late Sh. Krishan Lal Wassan & Late Smt. Soma Wanti Wassan</p>
          </div>
          <div style={{background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)', padding: '30px', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,.1)', border: '1px solid rgba(212,175,55,.2)'}}>
            <h4 style={{color: '#b8860b', marginBottom: '15px', fontFamily: 'Playfair Display, serif'}}>RSVP</h4>
            <p style={{margin: '5px 0', color: '#8b6914'}}>Your presence is our blessing</p>
          </div>
        </div>
      </section>

      <section className="countdown">
        <div className="title">
          <h2>Countdown to Our Wedding</h2>
        </div>
        <div className="countdown-grid">
          {countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0 ? (
            <>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.days}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.hours}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.minutes}</span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.seconds}</span>
                <span className="countdown-label">Seconds</span>
              </div>
            </>
          ) : (
            <div style={{gridColumn: '1 / -1', fontSize: '2rem', fontWeight: 'bold'}}>
              Our Wedding Day is Here! 🎉
            </div>
          )}
        </div>
      </section>

        <footer>
          <div className="footer-nav">
            <a href="#events" onClick={(e) => {e.preventDefault(); document.querySelector('.event-grid')?.scrollIntoView({behavior: 'smooth'});}}>Events</a>
            <a href="#venues" onClick={(e) => {e.preventDefault(); document.querySelector('[style*="maxWidth: 1600px"]')?.scrollIntoView({behavior: 'smooth'});}}>Venues</a>
            <a href="#about" onClick={(e) => {e.preventDefault(); document.querySelector('.about')?.scrollIntoView({behavior: 'smooth'});}}>About</a>
            <a href="#countdown" onClick={(e) => {e.preventDefault(); document.querySelector('.countdown')?.scrollIntoView({behavior: 'smooth'});}}>Countdown</a>
          </div>
          © 2025 Tushar & Babitta – Wedding Invitation
        </footer>
      </div>
    </>
  );
}
