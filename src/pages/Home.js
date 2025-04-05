// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';
import './Home.css'; 

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
      initParticles(canvas);
    }
    
    return () => {
      // Очистка при размонтировании
    };
  }, []);

  const handleStartNow = () => {
    window.location.href = '/exercises';
  };

  return (
    <div className="page home-page">
      <canvas id="particles-canvas" className="particles-background"></canvas>
      
      <div className={`home-content ${isLoaded ? 'fade-in' : ''}`}>
        <div className="home-container">
          <div className="home-header">
            <h1 className="animated-title">Единственный тренажер<br />по системному анализу</h1>
            <p className="animated-subtitle">Добро пожаловать в Метавижн - интерактивная платформа для развития навыков системного мышления</p>
          </div>

          <div className="home-hero">
            <div className="hero-content">
              <h2>Развивайте системное мышление с нашими упражнениями</h2>
              <p>Интерактивные задания, визуализации и практические примеры помогут вам освоить методы системного анализа и применить их в реальных проектах.</p>
              
              <div className="hero-actions">
                <button 
                  className="primary-button pulse-animation" 
                  onClick={handleStartNow}
                >
                  Начать сейчас
                </button>
                <Link to="/exercises" className="secondary-link">
                  Просмотреть упражнения
                </Link>
              </div>
            </div>
            
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>REST API</h3>
                <p>Практика работы с современными интеграциями и API</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>Системное мышление</h3>
                <p>Развитие навыков анализа сложных систем</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3>Интерактивность</h3>
                <p>Учитесь на практике, а не только в теории</p>
              </div>
            </div>
          </div>
          
          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Упражнений</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Категории</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Доступ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Функция для инициализации частиц на фоне
const initParticles = (canvas) => {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 50;
 
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: `rgba(138, 79, 255, ${Math.random() * 0.5 + 0.2})`
    });
  }
  
  function animate() {
    // Очищаем canvas с небольшой прозрачностью для эффекта следа
    ctx.fillStyle = 'rgba(249, 249, 249, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
           
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      // Соединяем частицы линиями, если они находятся близко друг к другу
      for (let j = i; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(138, 79, 255, ${0.1 * (1 - distance/100)})`; // Прозрачность увеличивается при сближении
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  animate();
};

export default Home;