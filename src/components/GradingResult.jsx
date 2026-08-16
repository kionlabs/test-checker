import React from 'react';
import './GradingResult.css';

export default function GradingResult({ result }) {
  if (!result) return null;

  return (
    <div className="grading-result-container glass-panel animate-fade-in">
      <div className="result-header">
        <h2>채점 결과</h2>
      </div>
      
      <div className="score-summary">
        <div className="score-circle">
          <span className="score-value">{result.score}</span>
          <span className="score-label">총점</span>
        </div>
        
        <div className="stats-container">
          <div className="stat-box success">
            <span className="stat-number">{result.correct}</span>
            <span className="stat-label">맞은 개수</span>
          </div>
          <div className="stat-box danger">
            <span className="stat-number">{result.incorrect}</span>
            <span className="stat-label">틀린 개수</span>
          </div>
        </div>
      </div>

      <div className="feedback-section glass-panel">
        <h3>AI 학습 코멘트</h3>
        <p>{result.feedback}</p>
      </div>
    </div>
  );
}
