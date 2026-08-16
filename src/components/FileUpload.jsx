import React, { useRef, useState } from 'react';
import './FileUpload.css';

export default function FileUpload({ file, previewUrl, onFileSelect, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !file) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || file) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  // 이미 파일이 업로드된 상태의 화면 표시
  if (file) {
    return (
      <div className="file-preview-container glass-panel animate-fade-in">
        {previewUrl ? (
          <div className="preview-image-wrapper">
            <img src={previewUrl} alt="시험지 미리보기" className="uploaded-image-preview" />
          </div>
        ) : (
          <div className="document-icon-wrapper">📄</div>
        )}
        <div className="file-info-details">
          <span className="file-status-badge">시험지 인식 완료</span>
          <h4 className="uploaded-file-name">{file.name}</h4>
          <p className="uploaded-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    );
  }

  // 대기(업로드 전) 상태의 화면 표시
  return (
    <div 
      className={`file-upload-container glass-panel ${isDragging ? 'dragging pulse-border' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,.pdf" 
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <div className="upload-content">
        <div className="upload-icon">📁</div>
        <h3>시험지 파일 업로드</h3>
        <p>클릭하거나 파일을 이곳으로 드래그하세요</p>
        <span className="file-hint">지원 형식: 이미지 (JPG, PNG) 또는 PDF</span>
      </div>
    </div>
  );
}
