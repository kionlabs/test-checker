import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 메모리에 파일을 임시 저장하는 방식
const upload = multer({ storage: multer.memoryStorage() });

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/grade', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }

    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `이 이미지는 학생의 시험지입니다. 이미지 내용을 세심하게 분석하여 자동 채점을 진행해주세요. 
    응답은 반드시 아래의 JSON 형식으로만 작성해야 하며, 다른 부가적인 텍스트는 절대 포함하지 마세요:
    {
      "score": 85,
      "correct": 17,
      "incorrect": 3,
      "feedback": "100자 내외의 한국어 피드백 코멘트를 여기에 작성하세요."
    }`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ];

    // 사용 가능한 여러 AI 모델을 순차적으로 시도하는 자동 폴백(Fallback) 목록
    const modelsToTry = [
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
      'gemini-flash-latest'
    ];

    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`인공지능 모델 호출 시도: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        result = await model.generateContent([prompt, ...imageParts]);
        console.log(`인공지능 모델 호출 성공: ${modelName}`);
        break; // 성공하면 시도 중단
      } catch (err) {
        console.warn(`인공지능 모델 ${modelName} 호출 실패:`, err.message);
        lastError = err;
      }
    }

    if (!result) {
      throw new Error(`모든 인공지능 모델 호출에 실패했습니다. (최종 오류: ${lastError ? lastError.message : '알 수 없음'})`);
    }

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText.trim());
    res.json(parsedData);

  } catch (error) {
    console.error('AI 분석 중 오류 발생:', error);
    res.status(500).json({ error: '오류 원인: ' + (error.message || '알 수 없는 서버 에러') });
  }
});

// 버셀 배포 환경이 아닐 때만 로컬 리슨 구동
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`백엔드 로컬 서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

export default app;
