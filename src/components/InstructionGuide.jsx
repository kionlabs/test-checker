import React, { useState } from 'react';
import './InstructionGuide.css';

export default function InstructionGuide() {
  const [copiedKey, setCopiedKey] = useState(null); // 'agent-system', 'user-0', etc.

  const agentSystemPrompt = `[기획 · 프롬프트 엔지니어 에이전트 지침서]
[너의 역할]
너는 비개발자가 떠올린 아이디어를, 코딩 AI가 바로 만들 수 있는 지시서로 바꿔주는 기획 파트너다.

사용자는 개발을 모른다. 코드를 쓸 줄도 모르고, 전문용어도 모른다. 하지만 자기 일에 대해서는 누구보다 잘 안다. 너의 일은 그 사람 머릿속에 있는 것을 꺼내서, 만들 수 있는 형태로 정리하는 것이다.

너는 코드를 쓰지 않는다. 기획서와 지시서까지만 만든다.

절대 규칙 (이걸 어기면 실패다)
1. 질문은 전체 대화에서 최대 2개만 한다. 그 이상 물으면 사용자가 지친다. 모르는 건 묻지 말고 네가 가장 단순한 방식으로 정한다.
2. 이런 것은 절대 묻지 않는다. 네가 정한다.
- 데이터를 어떤 형식으로 넣을지
- 화면을 몇 개로 할지
- 결과를 어떻게 보여줄지
- 어떤 방식이 편한지 → 전부 가장 단순한 쪽으로 네가 결정하고 "이렇게 만들겠습니다"라고 알려준다.
3. 사용자에게는 "맞나요?"만 묻는다. 사용자가 할 일은 확인 또는 수정 요청뿐이다.
4. 3번 주고받기 안에 최종 지시서까지 끝낸다. 1턴: 아이디어 듣기 → 2턴: 기획안 제시 + 확인 → 3턴: 지시서 출력(마크다운형식으로 바로 복사할 수 있도록).
5. 전문용어를 쓰지 않는다. 데이터베이스·API·백엔드 같은 말 금지.
6. 답변은 짧게. 길면 읽지 않는다.`;

  const steps = [
    {
      title: "1단계: 메인 화면 구성 및 가상 채점 기능 구현",
      description: "생성한 기획 에이전트에게 구현하고 싶은 웹 애플리케이션의 핵심 아이디어를 설명하여 1단계 가상 채점용 코딩 지시서를 도출하는 단계입니다.",
      userPrompt: `학생들이 올린 시험지를 읽어서 자동으로 채점해주고 점수랑 코멘트를 보여주는 사이트를 만들고 싶어. 화면에는 파일 올리는 곳이랑 채점 시작 버튼이 있고, 결과로 총점, 맞고 틀린 개수 요약, 그리고 AI가 쓴 코멘트가 100자 정도 나왔으면 좋겠어. 디자인은 화려하고 세련된 글라스모피즘 스타일로 해줘. 실제 AI 연결은 나중에 할 거니까 일단은 3초 뒤에 결과가 나오는 가상 채점 기능으로 먼저 틀을 짜줘.`,
      aiInstruction: `[AI 지시서: AI 자동 시험지 채점 도구]
1. 만들려는 것
학생의 시험지 파일을 올리면, 인공지능(AI)이 내용을 분석해 자동으로 채점하고 결과를 보여주는 웹 도구.
2. 화면 구성 (총 1개)
+ 메인 화면:
 - 학생의 시험지 파일(이미지 또는 PDF)을 올릴 수 있는 '파일 업로드' 칸
 - '채점 시작' 버튼
 - 결과 출력 구역:
  -- 총점 및 맞은 개수 / 틀린 개수 요약
  -- AI가 작성한 100자 내외의 학습 코멘트
3. 핵심 기능 및 동작 방식
 - 사용자가 시험지 파일을 올리고 '채점 시작' 버튼을 누른다.
 - 처음에는 실제 API 연동 대신 3초 정도의 가상 대기 시간(시뮬레이션)을 거친 후 결과가 화면에 나타나게 작성해줘.`
    },
    {
      title: "2단계: 이미지 미리보기 기능 및 API 보안을 위한 백엔드 연동",
      description: "기획 에이전트에게 이미지 미리보기를 추가하고 구글 API 키를 숨기기 위한 서버 연동 지시서를 요청하는 단계입니다.",
      userPrompt: `만든 채점 사이트에 시험지 올리면 지금은 파일명만 보이는데, 올린 시험지 이미지 미리보기를 작게 보여줬으면 좋겠어. 그리고 구글 AI 키를 발급받을 예정인데, 키 노출 없이 안전하게 구동되도록 환경변수 파일이랑 연동되는 백엔드 서버(Node.js Express)를 만들어서 프론트랑 연결해줘.`,
      aiInstruction: `[AI 지시서: 이미지 미리보기 및 백엔드 연동]
1. 이미지 미리보기 추가:
 - 메인페이지에서 시험지 이미지를 업로드하면 파일명뿐만 아니라 업로드한 이미지의 축소판(미리보기 썸네일)을 화면 상단에 예쁘게 보여줘.
2. 백엔드 서버 구축:
 - API 키 유출 방지를 위해 Node.js(Express) 서버를 연동하고, 프로젝트 최상단 폴더에 .env 파일을 생성해 GEMINI_API_KEY=발급받은키 형식으로 저장할 수 있게 해줘.
 - 프론트엔드가 보낸 이미지 파일을 서버가 받아 구글 제미나이(Gemini) API와 안전하게 통신하도록 설정해줘.`
    },
    {
      title: "3단계: API 예외 처리(폴백) 및 최종 화면 흐름(UX) 개선",
      description: "기획 에이전트에게 API 과부하 대비 폴백(Fallback) 기능과, 리셋 시 초기 화면으로 매끄럽게 복귀하는 UX 최적화 지시서를 도출하는 단계입니다.",
      userPrompt: `API 연결을 했는데 구글 API가 가끔 과부하 때문에 503 에러가 나면서 뻗어버려. 이거 대비해서 다른 플래시 모델들로 자동으로 순서대로 다시 시도해보는 폴백(Fallback) 기능을 백엔드에 넣어줘. 그리고 UX도 좀 다듬고 싶어. 채점이 끝나도 상단에 올렸던 시험지 미리보기가 카드 모양으로 계속 남아있으면 좋겠고, 하단에 새로운 시험지 채점하기 버튼 누르면 다시 처음 빈 업로드 화면으로 깔끔하게 돌아가게 만들어줘.`,
      aiInstruction: `[AI 지시서: 모델 폴백 및 UX 최종 개선]
1. 자동 모델 폴백(Fallback) 구축:
 - 구글 API 서버가 일시적인 과부하(503 Service Unavailable) 등으로 응답하지 않을 때를 대비해, 작동 가능한 모델(gemini-3.5-flash-lite, gemini-flash-lite-latest, gemini-3.5-flash, gemini-flash-latest)을 순차적으로 자동 시도하도록 백엔드 서버 코드를 보완해줘.
2. 화면 흐름(UX) 개선:
 - 채점 완료 결과 페이지에서도 상단에 업로드했던 시험지 미리보기가 카드 형태로 깔끔하게 남아있게 해줘.
 - 하단에 있는 '새로운 시험지 채점하기'를 클릭하면 파일 데이터가 초기화되면서 첫 메인페이지(업로드 점선 박스 화면)로 자연스럽게 돌아가게 해줘.`
    }
  ];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div className="instruction-guide-container glass-panel animate-fade-in">
      <div className="guide-header">
        <h2>💡 바이브코딩 시연 및 수업 가이드</h2>
        <p>비개발자의 추상적인 아이디어를 '기획 에이전트'를 거쳐 어떻게 명확한 'AI 코딩 지시서'로 만들고 적용하는지 실습합니다.</p>
      </div>

      {/* 기획 에이전트 지침서 섹션 */}
      <div className="agent-instructions-card glass-panel">
        <div className="step-header">
          <h3>🤖 기획 · 프롬프트 엔지니어 에이전트 지침서</h3>
          <button 
            className={`btn copy-btn ${copiedKey === 'agent-system' ? 'copied' : ''}`}
            onClick={() => handleCopy(agentSystemPrompt, 'agent-system')}
            style={{ borderColor: '#f59e0b', color: copiedKey === 'agent-system' ? 'white' : '#f59e0b' }}
          >
            {copiedKey === 'agent-system' ? '복사 완료! ✓' : '지침서 복사 📋'}
          </button>
        </div>
        <p className="step-desc" style={{ marginTop: '8px' }}>
          사용하고 계시는 인공지능 채팅창(예: ChatGPT, Claude 등)의 <strong>System Prompt(맞춤형 지침 설정)</strong> 또는 대화방 첫 메시지에 아래 지침서를 먼저 복사해 입력하세요. 비개발자 맞춤형 기획 에이전트가 생성됩니다.
        </p>
        <pre className="step-prompt agent-prompt-block">
          <code>{agentSystemPrompt}</code>
        </pre>
      </div>

      <div className="steps-list">
        {steps.map((step, index) => (
          <div key={index} className="step-card glass-panel">
            <div className="step-card-header">
              <h3>{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>

            {/* 사용자 프롬프트 영역 */}
            <div className="code-block-section user-prompt-section">
              <div className="block-header">
                <span className="block-tag user-tag">[사용자 프롬프트 예시]</span>
                <button 
                  className={`btn copy-btn ${copiedKey === `user-${index}` ? 'copied' : ''}`}
                  onClick={() => handleCopy(step.userPrompt, `user-${index}`)}
                >
                  {copiedKey === `user-${index}` ? '복사 완료! ✓' : '프롬프트 복사 📋'}
                </button>
              </div>
              <div className="prompt-text-box">
                {step.userPrompt}
              </div>
            </div>

            {/* AI 지시문 영역 */}
            <div className="code-block-section ai-instruction-section">
              <div className="block-header">
                <span className="block-tag ai-tag">[AI가 작성한 코딩 지시서]</span>
                <button 
                  className={`btn copy-btn ${copiedKey === `ai-${index}` ? 'copied' : ''}`}
                  onClick={() => handleCopy(step.aiInstruction, `ai-${index}`)}
                >
                  {copiedKey === `ai-${index}` ? '복사 완료! ✓' : '지시서 복사 📋'}
                </button>
              </div>
              <pre className="step-prompt">
                <code>{step.aiInstruction}</code>
              </pre>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
