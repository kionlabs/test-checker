import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import GradingResult from './components/GradingResult';
import InstructionGuide from './components/InstructionGuide';

function App() {
  const [view, setView] = useState('main'); // main, guide
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, complete, error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    
    // 이미지 파일인 경우 미리보기 URL 생성
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
  };

  // 메모리 누수 방지를 위한 미리보기 주소 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleStartGrading = async () => {
    if (!file) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '서버 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResult(data);
      setStatus('complete');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header animate-fade-in">
        <h1>AI 자동 시험지 채점</h1>
        <p style={{ marginBottom: '16px' }}>시험지 이미지를 올리면 구글 AI가 즉시 분석하여 채점해 드립니다.</p>
        <button 
          className="btn guide-toggle-btn" 
          onClick={() => setView(view === 'main' ? 'guide' : 'main')}
          style={{ 
            background: view === 'main' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)', 
            border: '1px solid var(--glass-border)', 
            fontSize: '0.9rem', 
            padding: '8px 16px' 
          }}
        >
          {view === 'main' ? '💡 수업 시연용 AI 지시서 복사하기' : '⬅️ 채점 도구 화면으로 돌아가기'}
        </button>
      </header>

      <main className="main-content">
        {view === 'guide' ? (
          <InstructionGuide />
        ) : (
          <>
            {/* 상단 파일 표시 영역 (항상 유지되나, 업로드 완료 시 축소 카드로 변경됨) */}
            <FileUpload 
              file={file}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect} 
              disabled={status === 'loading'}
            />

            {file && status !== 'complete' && (
              <div className="action-area animate-fade-in" style={{ textAlign: 'center' }}>
                {status === 'error' && (
                  <div className="error-message">
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button 
                  className={`btn ${status === 'loading' ? 'pulse-border' : ''}`}
                  onClick={handleStartGrading}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'AI가 열심히 채점하고 있습니다...' : '채점 시작'}
                </button>
              </div>
            )}

            {status === 'complete' && result && (
              <>
                <GradingResult result={result} />
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button className="btn" onClick={() => handleFileSelect(null)}>
                    새로운 시험지 채점하기
                  </button>
                </div>
              </>
            )}

            {/* 메인 페이지 상태에서 파일 업로드 전일 때만 다운로드 영역 표시 */}
            {status === 'idle' && !file && (
              <div className="example-download-section glass-panel animate-fade-in">
                <h4>📥 시연용 예시 시험지 다운로드</h4>
                <p>아래 시험지 이미지를 다운로드하여 즉시 AI 채점 성능을 테스트해 보세요.</p>
                <div className="download-buttons">
                  <a href="/2025숭덕고_수학_중간고사.jpeg" download className="btn download-btn">
                    📐 수학 시험지 다운로드
                  </a>
                  <a href="/영어시험지.jpeg" download className="btn download-btn">
                    🔤 영어 시험지 다운로드
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
