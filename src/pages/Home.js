// src/pages/Home.jsx
import React from 'react';
import './Pages.css';

const Home = () => {
  return (
    <div className="page">
      <h1>Единственный тренажер по системному анализу</h1>
      <p>Добро пожаловать в Метавижн - тренажер по системному анализу.</p>
      <div className="home-hero">
        <h2>Развивайте системное мышление с нашими упражнениями</h2>
        <p>Интерактивные задания, визуализации и практические примеры помогут вам освоить методы системного анализа.</p>
        <button className="primary-button">Начать сейчас</button>
      </div>
    </div>
  );
};

export default Home;