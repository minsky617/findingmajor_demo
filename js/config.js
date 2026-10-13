/**
 * 서울사이버대학교 학과찾기 프로그램 설정 파일
 * 통합 개발 기획서 V1.0 (2027학년도 학과 기준)
 */
(function() {
  window.SCU_CONFIG = {
    // 설정 버전
    configVersion: "2027-v1-proposal",
    
    // 점수 가중치 (기획서 5.1 및 10.3)
    weights: {
      Q1: 1,  // 관심 분야
      Q2: 2,  // 활동
      Q3: 2,  // 문제 관심
      Q4: 3,  // 학습 내용
      T1: 2,  // 맞춤 1번 (분야 안 관심 대상)
      T2: 3,  // 맞춤 2번 (해보고 싶은 역할)
      T3: 4   // 맞춤 3번 (심화 내용/과제)
    },
    
    // 동점 발생 시 중요 문항 비교 우선순위 (기획서 5.4 및 10.3)
    tiePriority: ["T3", "Q4", "T2", "T1", "Q3", "Q2", "Q1"],
    
    // 신설 학과 우선 적용 시점 및 대상 ID (기획서 5.4 및 10.3)
    newPriorityAt: "completeTie",
    newIds: ["D50", "D51", "D52"],
    
    // 완전 동점 시 최종 정렬 모드 ('nameKo': 한국어 가나다순, 'schoolId': 학교 지정 순번)
    finalSortMode: "nameKo",
    
    // 추천 순위 계산 제외 학과 (자유전공 D49)
    rankingExcludeIds: ["D49"],
    
    // 결과 화면 하단 '다른 배움도 살펴보세요' 홍보 풀 (기획서 8.1 및 10.3)
    // 문과형 (Q1에서 A, B, D, F 중 선택 시)
    promoHumanities: ["D49", "D50", "D51"],
    // 이과형 (Q1에서 C, E 중 선택 시)
    promoScience: ["D49", "D52"],
    // 홍보 자동 롤링 간격 (5초)
    promoIntervalMs: 3000,
    
    // 후속 안내 공식 링크 (미정 시 null, '안내 링크 준비 중' 비활성화)
    links: {
      entranceFinder: null,  // 나의 전형찾기
      admissionConsult: null, // 입학상담하기
      apply: null            // 지원하기
    },
    
    // 관심 분야 코드 및 명칭 매핑
    fieldNames: {
      A: "사람·지원",
      B: "사업·운영",
      C: "기술·분석",
      D: "표현·창작",
      E: "건강·생명",
      F: "인문·사회"
    },
    
    // 디자인 시스템 색상 토큰
    uiColors: {
      ciGreen: "#00A151",      // 학교 공식 CI 녹색
      primaryGreen: "#007A3D", // 버튼 및 강조
      selectBg: "#EAF6F0",     // 선택 배경
      pageBg: "#F7FAF8",       // 페이지 배경
      cardBg: "#FFFFFF",       // 카드 배경
      textPrimary: "#1E2B24",   // 본문
      textSecondary: "#59685F", // 보조 텍스트
      border: "#D7E4DC"        // 테두리
    }
  };
})();
