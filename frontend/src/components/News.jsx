// src/components/News.jsx
import React, { useState, useEffect } from "react";
import "../styles/News.css";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
      window.currentAudio = null; // Clear it
    }
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=454a26cfd5c94b498a36fcbee11138d9"
        );
        const data = await response.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="news-container">Loading latest news...</div>;
  }

  return (
    <div className="news-container">
      <h2 className="news-header">Latest News</h2>
      {news.length === 0 ? (
        <p className="news-message">No news available at the moment.</p>
      ) : (
        <div className="news-list-container">
          <ul className="news-list">
            {news.map((article, index) => (
              <li key={index} className="news-item">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-description">{article.description}</p>
                  <span className="news-source">{article.source.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default News;
