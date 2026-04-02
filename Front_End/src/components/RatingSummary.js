import React from "react";
import "./RatingSummary.css";


const RatingSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="summary-container">
        <p>No reviews yet.</p>
      </div>
    );
  }

  const totalReviews = reviews.length;
  const avgRating =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Number(r.rating) === star).length
  );

  const maxCount = Math.max(...ratingCounts);

  const renderStars = (count) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"}>
        ★
      </span>
    ));

  return (
    <div className="summary-container">
      {/* LEFT SECTION */}
      <div className="summary-left">
        <div className="summary-score">
          {avgRating.toFixed(1)}
        </div>
        <div className="summary-total">out of 5</div>

        <div className="summary-stars">{renderStars(Math.round(avgRating))}</div>

        <div className="summary-total">
          {totalReviews} <br />
          Verified Reviews
        </div>
      </div>

      {/* BAR GRAPH SECTION */}
      <div className="summary-bars">
        {[5, 4, 3, 2, 1].map((star, index) => (
          <div className="rating-row" key={star}>
            <span>{star} ★</span>

            <div className="rating-bar">
              <div
                className="rating-bar-fill"
                style={{
                  width:
                    maxCount === 0
                      ? "0%"
                      : (ratingCounts[index] / maxCount) * 100 + "%",
                }}
              ></div>
            </div>

            <span>{ratingCounts[index]}</span>
          </div>
        ))}
      </div>

      {/* RIGHT SECTION */}
      <div className="summary-right">
        <p className="experience-title">Share Your Experience</p>
        <p className="experience-desc">
          Help others make better choices
        </p>

        <button className="write-btn">Write a Review</button>
      </div>
    </div>
  );
};

export default RatingSummary;
