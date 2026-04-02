import React, { useState, useEffect } from "react";
import "./App.css";
import RatingSummary from "./components/RatingSummary";

function App() {
  const [reviewText, setReviewText] = useState("");
  const [predictedRating, setPredictedRating] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_reviews/")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  const predictRating = async () => {
    if (!reviewText.trim()) return;

    const res = await fetch(
      "http://127.0.0.1:8000/predict_review/?review=" +
        encodeURIComponent(reviewText)
    );
    const data = await res.json();

    setPredictedRating(data.predicted_rating);
    setReviews([{ review: reviewText, rating: data.predicted_rating }, ...reviews]);
    setReviewText("");
  };

  const renderStars = (count) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"}>
        ★
      </span>
    ));

  return (
    <>
      {/* HEADER */}
      <div className="header-section">
        <h1 className="header-title">Automated Review Rating System</h1>
      </div>

      {/* SUMMARY CARD */}
      <div className="summary-container">
        <RatingSummary reviews={reviews} />
      </div>

      {/* INPUT BOX */}
      <div className="input-section">
        <p className="section-heading">Write Your Review</p>
        <textarea
          className="review-box"
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <button className="predict-btn" onClick={predictRating}>
          Predict Rating
        </button>

        {predictedRating && (
          <div className="prediction-box">
    <p className="predict-title">Predicted Rating</p>

    <p className="predict-number">{predictedRating}/5</p>

    <div className="predict-stars">
        {renderStars(predictedRating)}
    </div>
</div>
        )}
      </div>

      {/* REVIEWS LIST */}
      {reviews.map((r, i) => (
        <div key={i} className="review-card">
          <div className="review-stars">{renderStars(r.rating)}</div>
          <p className="review-text">{r.review}</p>
        </div>
      ))}
    </>
  );
}

export default App;
