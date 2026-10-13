/**
 * 서울사이버대학교 학과찾기 질문 및 선택지 데이터
 * 기획서 부록 B(공통문항 연결표) 및 부록 C(전체 문항과 선택지) 기반 구축
 */
(function() {
  var onboarding = [
  {
    "id": "OB01",
    "stepName": "기본정보",
    "title": "성별을 선택해 주세요",
    "subtitle": "이용 현황 파악에만 활용되며 추천 점수에는 반영되지 않습니다.",
    "allowSkip": true,
    "required": false,
    "maxSelect": 1,
    "options": [
      {
        "id": "OB01.01",
        "text": "여성"
      },
      {
        "id": "OB01.02",
        "text": "남성"
      },
      {
        "id": "OB01.03",
        "text": "기타"
      }
    ]
  },
  {
    "id": "OB02",
    "stepName": "기본정보",
    "title": "연령대를 선택해 주세요",
    "subtitle": "이용 현황 파악에만 활용되며 추천 점수에는 반영되지 않습니다.",
    "allowSkip": true,
    "required": false,
    "maxSelect": 1,
    "options": [
      {
        "id": "OB02.01",
        "text": "20세 미만"
      },
      {
        "id": "OB02.02",
        "text": "20대"
      },
      {
        "id": "OB02.03",
        "text": "30대"
      },
      {
        "id": "OB02.04",
        "text": "40대"
      },
      {
        "id": "OB02.05",
        "text": "50대"
      },
      {
        "id": "OB02.06",
        "text": "60대"
      },
      {
        "id": "OB02.07",
        "text": "70대 이상"
      }
    ]
  },
  {
    "id": "OB03",
    "stepName": "기본정보",
    "title": "현재 생활과 가장 가까운 상태를 선택해 주세요",
    "subtitle": "이용 현황 파악에만 활용되며 추천 점수에는 반영되지 않습니다.",
    "allowSkip": true,
    "required": false,
    "maxSelect": 1,
    "options": [
      {
        "id": "OB03.01",
        "text": "직장·경제활동"
      },
      {
        "id": "OB03.02",
        "text": "학생"
      },
      {
        "id": "OB03.03",
        "text": "가사·돌봄"
      },
      {
        "id": "OB03.04",
        "text": "취업·재취업 준비"
      },
      {
        "id": "OB03.05",
        "text": "은퇴·퇴직"
      },
      {
        "id": "OB03.06",
        "text": "휴직·휴식"
      },
      {
        "id": "OB03.07",
        "text": "기타"
      }
    ]
  },
  {
    "id": "OB03-1",
    "stepName": "기본정보",
    "title": "현재 하는 일에 가장 가까운 것을 선택해 주세요",
    "subtitle": "이용 현황 파악에만 활용되며 추천 점수에는 반영되지 않습니다.",
    "allowSkip": true,
    "required": false,
    "maxSelect": 1,
    "visibleWhen": {
      "questionId": "OB03",
      "optionId": "OB03.01"
    },
    "options": [
      {
        "id": "OB03-1.01",
        "text": "회사·기관 재직자"
      },
      {
        "id": "OB03-1.02",
        "text": "공무원"
      },
      {
        "id": "OB03-1.03",
        "text": "교직원"
      },
      {
        "id": "OB03-1.04",
        "text": "군인·군무원"
      },
      {
        "id": "OB03-1.05",
        "text": "농·어업 종사자"
      },
      {
        "id": "OB03-1.06",
        "text": "자영업·프리랜서"
      },
      {
        "id": "OB03-1.07",
        "text": "기타"
      }
    ]
  },
  {
    "id": "OB04",
    "stepName": "관심 탐색",
    "title": "현재 관심 있는 학과가 있나요?",
    "subtitle": "관심 학과를 미리 둘러볼 수 있으며, 추천 점수에는 영향을 주지 않습니다.",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "OB04.01",
        "text": "있어요"
      },
      {
        "id": "OB04.02",
        "text": "없어요"
      }
    ]
  },
  {
    "id": "OB05",
    "stepName": "관심 탐색",
    "title": "새로운 공부를 시작하려는 가장 큰 이유는 무엇인가요?",
    "subtitle": "선택하신 학습 목적은 결과 페이지의 안내 문맥에 활용됩니다.",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "OB05.01",
        "text": "학위 취득",
        "guideText": "관심 있는 학습 내용과 전공 과정을 확인해보세요."
      },
      {
        "id": "OB05.02",
        "text": "자격 취득",
        "guideText": "관련 자격과 교과·시험·실습 등 취득 요건을 함께 확인해보세요."
      },
      {
        "id": "OB05.03",
        "text": "커리어 성장",
        "guideText": "현재 하는 일에 연결할 수 있는 학습 내용과 역량을 살펴보세요."
      },
      {
        "id": "OB05.04",
        "text": "새로운 진로",
        "guideText": "주요 학습 내용과 진출 분야를 비교해 새로운 방향을 살펴보세요."
      },
      {
        "id": "OB05.05",
        "text": "창업·사업",
        "guideText": "관심 사업에 연결할 수 있는 학습 내용과 적용 분야를 확인해보세요."
      },
      {
        "id": "OB05.06",
        "text": "관심·자기계발",
        "guideText": "더 배우고 싶은 주제와 활동을 중심으로 전공을 살펴보세요."
      }
    ]
  }
];
  var common = [
  {
    "id": "Q1",
    "tier": "Q1",
    "weightKey": "Q1",
    "stepName": "관심 탐색",
    "title": "관심 분야",
    "prompt": "다양한 배움의 기회가 열렸어요. 먼저 살펴보고 싶은 분야는 무엇인가요?",
    "guideNotice": "최대 2개까지 선택할 수 있어요.",
    "allowSkip": false,
    "required": true,
    "minSelect": 1,
    "maxSelect": 2,
    "options": [
      {
        "id": "Q1.01",
        "field": "A",
        "text": "사람의 마음과 행동, 관계와 성장, 상담·복지·교육에 관한 분야",
        "departmentIds": [
          "D01",
          "D02",
          "D03",
          "D04",
          "D05",
          "D06",
          "D07",
          "D08",
          "D09",
          "D13",
          "D32",
          "D37",
          "D41",
          "D47",
          "D48",
          "D51"
        ]
      },
      {
        "id": "Q1.02",
        "field": "B",
        "text": "사업과 조직, 시장과 거래, 마케팅·재무·운영에 관한 분야",
        "departmentIds": [
          "D03",
          "D11",
          "D12",
          "D16",
          "D17",
          "D18",
          "D19",
          "D20",
          "D35",
          "D39",
          "D46"
        ]
      },
      {
        "id": "Q1.03",
        "field": "C",
        "text": "기술과 데이터, 수학과 컴퓨터, 기계·시스템에 관한 분야",
        "departmentIds": [
          "D14",
          "D21",
          "D22",
          "D23",
          "D24",
          "D25",
          "D26",
          "D27",
          "D42",
          "D45",
          "D52",
          "D53"
        ]
      },
      {
        "id": "Q1.04",
        "field": "D",
        "text": "글과 이야기, 디자인과 미술, 음악·공연·미디어 표현에 관한 분야",
        "departmentIds": [
          "D28",
          "D29",
          "D30",
          "D31",
          "D33",
          "D34",
          "D36",
          "D37",
          "D38",
          "D40",
          "D43",
          "D51"
        ]
      },
      {
        "id": "Q1.05",
        "field": "E",
        "text": "신체 건강과 운동, 생활습관과 영양, 동물·식물에 관한 분야",
        "departmentIds": [
          "D12",
          "D32",
          "D45",
          "D46",
          "D47",
          "D48"
        ]
      },
      {
        "id": "Q1.06",
        "field": "F",
        "text": "인간의 가치와 사상, 언어와 문화, 사회현상·법·제도에 관한 분야",
        "departmentIds": [
          "D11",
          "D13",
          "D15",
          "D41",
          "D50"
        ]
      }
    ]
  },
  {
    "id": "Q2",
    "tier": "Q2",
    "weightKey": "Q2",
    "stepName": "관심 탐색",
    "title": "활동",
    "prompt": "처음부터 배울 수 있다면, 어떤 일을 직접 해보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "minSelect": 1,
    "maxSelect": 1,
    "options": [
      {
        "id": "Q2.01",
        "text": "이야기를 듣고, 어려움을 함께 풀 방법 찾아보기",
        "departmentIds": [
          "D01",
          "D02",
          "D04",
          "D05",
          "D06",
          "D07",
          "D08",
          "D09",
          "D37",
          "D51"
        ]
      },
      {
        "id": "Q2.02",
        "text": "알고 있는 것을 설명하고, 다른 사람의 연습 도와주기",
        "departmentIds": [
          "D13",
          "D32",
          "D33",
          "D34",
          "D36",
          "D41",
          "D48"
        ]
      },
      {
        "id": "Q2.03",
        "text": "일의 순서를 짜고, 사람·예산·서비스 운영해보기",
        "departmentIds": [
          "D03",
          "D11",
          "D12",
          "D16",
          "D17",
          "D18",
          "D19",
          "D20",
          "D35",
          "D39",
          "D46"
        ]
      },
      {
        "id": "Q2.04",
        "text": "자료와 숫자 속에서 이유나 규칙 찾아보기",
        "departmentIds": [
          "D09",
          "D18",
          "D19",
          "D22",
          "D25",
          "D27",
          "D42",
          "D53"
        ]
      },
      {
        "id": "Q2.05",
        "text": "프로그램이나 장치가 원하는 대로 작동하게 만들어보기",
        "departmentIds": [
          "D21",
          "D22",
          "D23",
          "D24",
          "D25",
          "D26",
          "D42",
          "D45",
          "D52"
        ]
      },
      {
        "id": "Q2.06",
        "text": "글·이미지·공간을 만들거나 음악·연기로 표현해보기",
        "departmentIds": [
          "D28",
          "D29",
          "D30",
          "D31",
          "D33",
          "D34",
          "D36",
          "D37",
          "D38",
          "D40",
          "D43",
          "D51"
        ]
      },
      {
        "id": "Q2.07",
        "text": "몸의 상태나 동식물의 환경을 살피고 관리해보기",
        "departmentIds": [
          "D02",
          "D04",
          "D12",
          "D32",
          "D45",
          "D46",
          "D47",
          "D48"
        ]
      },
      {
        "id": "Q2.08",
        "text": "규칙과 현장을 살펴, 문제를 예방하거나 개선해보기",
        "departmentIds": [
          "D11",
          "D12",
          "D14",
          "D15",
          "D22"
        ]
      },
      {
        "id": "Q2.09",
        "text": "서로 다른 생각을 비교하고, 근거를 들어 질문·토론·글쓰기로 탐구해보기",
        "departmentIds": [
          "D09",
          "D13",
          "D15",
          "D30",
          "D41",
          "D50"
        ]
      }
    ]
  },
  {
    "id": "Q3",
    "tier": "Q3",
    "weightKey": "Q3",
    "stepName": "관심 탐색",
    "title": "문제 관심",
    "prompt": "관심 주제로 프로젝트에 참여할 기회가 생겼어요. 어떤 것에 도전하고 싶나요?",
    "allowSkip": false,
    "required": true,
    "minSelect": 1,
    "maxSelect": 1,
    "options": [
      {
        "id": "Q3.01",
        "text": "배움과 관계의 어려움을 풀어가는 ‘교육·소통·함께하는 삶’ 아이디어 공모전",
        "departmentIds": [
          "D01",
          "D02",
          "D04",
          "D05",
          "D06",
          "D07",
          "D08",
          "D09",
          "D13",
          "D41"
        ]
      },
      {
        "id": "Q3.02",
        "text": "데이터와 기술로 생활·산업의 문제를 해결하는 ‘미래 기술·서비스’ 공모전",
        "departmentIds": [
          "D14",
          "D20",
          "D21",
          "D22",
          "D23",
          "D24",
          "D25",
          "D26",
          "D27",
          "D39",
          "D42",
          "D43",
          "D45",
          "D52",
          "D53"
        ]
      },
      {
        "id": "Q3.03",
        "text": "안전·권리·가치의 해법을 찾는 ‘더 나은 공공사회’ 아이디어 공모전",
        "departmentIds": [
          "D01",
          "D11",
          "D12",
          "D14",
          "D15",
          "D50"
        ]
      },
      {
        "id": "Q3.04",
        "text": "몸과 마음의 건강, 동식물의 삶을 돌보는 ‘생명 보호’ 아이디어 공모전",
        "departmentIds": [
          "D02",
          "D04",
          "D05",
          "D08",
          "D09",
          "D12",
          "D32",
          "D37",
          "D45",
          "D46",
          "D47",
          "D48",
          "D51"
        ]
      },
      {
        "id": "Q3.05",
        "text": "동네 가게와 지역의 매력을 살리는 ‘로컬 브랜드·창업’ 공모전",
        "departmentIds": [
          "D03",
          "D16",
          "D17",
          "D18",
          "D19",
          "D20",
          "D29",
          "D31",
          "D35",
          "D39",
          "D46",
          "D53"
        ]
      },
      {
        "id": "Q3.06",
        "text": "이야기·음악·미술·공간을 새롭게 선보이는 ‘문화예술 콘텐츠’ 공모전",
        "departmentIds": [
          "D28",
          "D29",
          "D30",
          "D33",
          "D34",
          "D35",
          "D36",
          "D37",
          "D38",
          "D40",
          "D43",
          "D51"
        ]
      }
    ]
  },
  {
    "id": "Q4",
    "tier": "Q4",
    "weightKey": "Q4",
    "stepName": "관심 탐색",
    "title": "학습 내용",
    "prompt": "한 가지를 깊이 배운다면, 어떤 궁금증을 풀고 싶나요?",
    "allowSkip": false,
    "required": true,
    "minSelect": 1,
    "maxSelect": 1,
    "options": [
      {
        "id": "Q4.01",
        "text": "사람의 마음은 어떻게 발달하고, 관계 속에서 달라질까?",
        "departmentIds": [
          "D05",
          "D06",
          "D07",
          "D08",
          "D09",
          "D37",
          "D51"
        ]
      },
      {
        "id": "Q4.02",
        "text": "언어를 가르치거나, 배움·생활에 필요한 도움을 연결하려면 어떻게 할까?",
        "departmentIds": [
          "D01",
          "D02",
          "D03",
          "D04",
          "D13",
          "D41"
        ]
      },
      {
        "id": "Q4.03",
        "text": "고객과 조직을 이해하고, 사업·기관·돈을 잘 관리하려면 어떻게 할까?",
        "departmentIds": [
          "D03",
          "D11",
          "D12",
          "D16",
          "D17",
          "D18",
          "D19",
          "D20",
          "D35",
          "D39",
          "D46"
        ]
      },
      {
        "id": "Q4.04",
        "text": "수학·데이터·코드로 현상을 분석하고 문제를 풀려면 어떻게 할까?",
        "departmentIds": [
          "D21",
          "D22",
          "D25",
          "D27",
          "D42",
          "D53"
        ]
      },
      {
        "id": "Q4.05",
        "text": "전기와 기계는 어떻게 작동하고, 장치를 설계·제어하려면 어떻게 할까?",
        "departmentIds": [
          "D23",
          "D24",
          "D26",
          "D42",
          "D45",
          "D52"
        ]
      },
      {
        "id": "Q4.06",
        "text": "작품·공간을 구성하고, 소리·몸·이미지로 표현하려면 어떻게 할까?",
        "departmentIds": [
          "D28",
          "D29",
          "D30",
          "D31",
          "D33",
          "D34",
          "D35",
          "D36",
          "D37",
          "D38",
          "D40",
          "D43",
          "D51"
        ]
      },
      {
        "id": "Q4.07",
        "text": "운동·생활습관·동식물 관리에는 어떤 원리가 있고, 어떻게 실천할까?",
        "departmentIds": [
          "D32",
          "D45",
          "D46",
          "D47",
          "D48"
        ]
      },
      {
        "id": "Q4.08",
        "text": "법·정책·안전 기준을 실제 문제에 어떻게 적용할까?",
        "departmentIds": [
          "D11",
          "D12",
          "D14",
          "D15",
          "D53"
        ]
      },
      {
        "id": "Q4.09",
        "text": "인간과 세계를 바라보는 사상은 어떻게 다르고, 지식·가치·옳고 그름의 근거는 무엇일까?",
        "departmentIds": [
          "D09",
          "D15",
          "D50"
        ]
      }
    ]
  }
];
  var custom = [
  {
    "id": "A1",
    "field": "A",
    "tier": "T1",
    "weightKey": "T1",
    "stepName": "맞춤 탐색",
    "title": "사람·지원 맞춤 1",
    "prompt": "누구의 어떤 상황을 이해하고 돕는 일에 가장 관심이 있나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "A1.01",
        "text": "여러 연령의 생활 문제와 마음의 어려움",
        "departmentIds": [
          "D01",
          "D05",
          "D09",
          "D08",
          "D37",
          "D51"
        ]
      },
      {
        "id": "A1.02",
        "text": "아이의 성장과 가족의 관계·돌봄",
        "departmentIds": [
          "D04",
          "D06",
          "D08"
        ]
      },
      {
        "id": "A1.03",
        "text": "어르신의 생활과 노년기 적응",
        "departmentIds": [
          "D02",
          "D09"
        ]
      },
      {
        "id": "A1.04",
        "text": "군·경찰 구성원의 위기와 조직 적응",
        "departmentIds": [
          "D07"
        ]
      },
      {
        "id": "A1.05",
        "text": "한국어나 영어를 배우는 사람의 어려움",
        "departmentIds": [
          "D13",
          "D41"
        ]
      },
      {
        "id": "A1.06",
        "text": "운동과 건강한 생활습관을 실천하려는 사람",
        "departmentIds": [
          "D32",
          "D47"
        ]
      },
      {
        "id": "A1.07",
        "text": "요가·명상으로 몸과 마음을 돌보려는 사람",
        "departmentIds": [
          "D48"
        ]
      },
      {
        "id": "A1.08",
        "text": "복지서비스를 제공하는 기관과 조직",
        "departmentIds": [
          "D03"
        ]
      }
    ]
  },
  {
    "id": "A2",
    "field": "A",
    "tier": "T2",
    "weightKey": "T2",
    "stepName": "맞춤 탐색",
    "title": "사람·지원 맞춤 2",
    "prompt": "사람을 돕는 과정에서 어떤 역할을 더 배워보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "A2.01",
        "text": "필요한 돌봄과 복지서비스 연결하기",
        "departmentIds": [
          "D01",
          "D02",
          "D04"
        ]
      },
      {
        "id": "A2.02",
        "text": "이야기를 듣고 상담·코칭으로 변화 돕기",
        "departmentIds": [
          "D05",
          "D06",
          "D07"
        ]
      },
      {
        "id": "A2.03",
        "text": "마음과 행동의 원리를 연구하고 자료 분석하기",
        "departmentIds": [
          "D09"
        ]
      },
      {
        "id": "A2.04",
        "text": "놀이·미술·음악 활동으로 표현과 소통 돕기",
        "departmentIds": [
          "D08",
          "D37",
          "D51"
        ]
      },
      {
        "id": "A2.05",
        "text": "언어를 설명하고 소통 연습 돕기",
        "departmentIds": [
          "D13",
          "D41"
        ]
      },
      {
        "id": "A2.06",
        "text": "운동을 가르치고 신체 능력 향상 돕기",
        "departmentIds": [
          "D32"
        ]
      },
      {
        "id": "A2.07",
        "text": "생활습관이나 심신 수련의 꾸준한 실천 돕기",
        "departmentIds": [
          "D47",
          "D48"
        ]
      },
      {
        "id": "A2.08",
        "text": "복지기관의 인력·예산·서비스 운영하기",
        "departmentIds": [
          "D03"
        ]
      }
    ]
  },
  {
    "id": "A3",
    "field": "A",
    "tier": "T3",
    "weightKey": "T3",
    "stepName": "맞춤 탐색",
    "title": "사람·지원 맞춤 3",
    "prompt": "사람을 지원하는 데 필요한 내용 중 무엇을 더 깊이 배우고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "A3.01",
        "text": "돌봄·복지서비스의 제공과 기관 운영",
        "departmentIds": [
          "D01",
          "D02",
          "D03",
          "D04"
        ]
      },
      {
        "id": "A3.02",
        "text": "심리와 관계의 이해, 상담과 심리 연구",
        "departmentIds": [
          "D05",
          "D06",
          "D07",
          "D09"
        ]
      },
      {
        "id": "A3.03",
        "text": "놀이·인지학습·예술 등 여러 접근을 활용한 심리 지원",
        "departmentIds": [
          "D08"
        ]
      },
      {
        "id": "A3.04",
        "text": "음악활동을 활용한 치료와 참여 지원",
        "departmentIds": [
          "D37"
        ]
      },
      {
        "id": "A3.05",
        "text": "그림·미술 매체를 활용한 심리 지원",
        "departmentIds": [
          "D51"
        ]
      },
      {
        "id": "A3.06",
        "text": "한국어·한국문화와 한국어 교육 방법",
        "departmentIds": [
          "D13"
        ]
      },
      {
        "id": "A3.07",
        "text": "영어 듣기·말하기·읽기·쓰기와 영어 교육 방법",
        "departmentIds": [
          "D41"
        ]
      },
      {
        "id": "A3.08",
        "text": "운동·생활습관·요가·명상의 원리와 지도 방법",
        "departmentIds": [
          "D32",
          "D47",
          "D48"
        ]
      }
    ]
  },
  {
    "id": "B1",
    "field": "B",
    "tier": "T1",
    "weightKey": "T1",
    "stepName": "맞춤 탐색",
    "title": "사업·운영 맞춤 1",
    "prompt": "어떤 사업이나 기관의 일을 더 알아보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "B1.01",
        "text": "기업의 여러 부서와 조직 운영 전반",
        "departmentIds": [
          "D16"
        ]
      },
      {
        "id": "B1.02",
        "text": "고객 서비스·마케팅과 온라인 판매",
        "departmentIds": [
          "D20",
          "D39"
        ]
      },
      {
        "id": "B1.03",
        "text": "해외 거래·수출입과 상품 운송",
        "departmentIds": [
          "D17"
        ]
      },
      {
        "id": "B1.04",
        "text": "금융·보험과 회계·세금",
        "departmentIds": [
          "D18",
          "D19"
        ]
      },
      {
        "id": "B1.05",
        "text": "복지기관과 보건의료기관",
        "departmentIds": [
          "D03",
          "D12"
        ]
      },
      {
        "id": "B1.06",
        "text": "공연·전시와 문화예술 조직",
        "departmentIds": [
          "D35"
        ]
      },
      {
        "id": "B1.07",
        "text": "반려동물 관련 서비스와 사업",
        "departmentIds": [
          "D46"
        ]
      },
      {
        "id": "B1.08",
        "text": "공공기관·조직의 법무와 행정",
        "departmentIds": [
          "D11"
        ]
      }
    ]
  },
  {
    "id": "B2",
    "field": "B",
    "tier": "T2",
    "weightKey": "T2",
    "stepName": "맞춤 탐색",
    "title": "사업·운영 맞춤 2",
    "prompt": "사업이나 기관에서 어떤 업무를 맡아보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "B2.01",
        "text": "전략을 세우고 인력·예산·자원 관리하기",
        "departmentIds": [
          "D16",
          "D03",
          "D12",
          "D35"
        ]
      },
      {
        "id": "B2.02",
        "text": "고객을 분석하고 서비스·마케팅 개선하기",
        "departmentIds": [
          "D20"
        ]
      },
      {
        "id": "B2.03",
        "text": "온라인스토어를 만들고 판매 운영하기",
        "departmentIds": [
          "D39"
        ]
      },
      {
        "id": "B2.04",
        "text": "수출입 절차와 물류 흐름 관리하기",
        "departmentIds": [
          "D17"
        ]
      },
      {
        "id": "B2.05",
        "text": "금융상품·보험을 비교하고 자산계획 세우기",
        "departmentIds": [
          "D18"
        ]
      },
      {
        "id": "B2.06",
        "text": "회계자료를 분석하고 세무 업무 배우기",
        "departmentIds": [
          "D19"
        ]
      },
      {
        "id": "B2.07",
        "text": "현장의 이용자에게 맞는 프로그램·서비스 기획하기",
        "departmentIds": [
          "D03",
          "D12",
          "D35",
          "D46"
        ]
      },
      {
        "id": "B2.08",
        "text": "법과 제도를 해석해 기관의 업무 검토하기",
        "departmentIds": [
          "D11"
        ]
      }
    ]
  },
  {
    "id": "B3",
    "field": "B",
    "tier": "T3",
    "weightKey": "T3",
    "stepName": "맞춤 탐색",
    "title": "사업·운영 맞춤 3",
    "prompt": "운영을 잘하기 위해 어떤 내용을 더 깊이 배우고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "B3.01",
        "text": "조직의 전략·인사·재무를 연결하는 경영 원리",
        "departmentIds": [
          "D16"
        ]
      },
      {
        "id": "B3.02",
        "text": "AI·데이터를 활용한 고객 이해와 디지털 사업",
        "departmentIds": [
          "D20",
          "D39"
        ]
      },
      {
        "id": "B3.03",
        "text": "국제거래·통관·운송과 공급망 관리",
        "departmentIds": [
          "D17"
        ]
      },
      {
        "id": "B3.04",
        "text": "금융·보험·자산관리와 회계·세무의 원리",
        "departmentIds": [
          "D18",
          "D19"
        ]
      },
      {
        "id": "B3.05",
        "text": "사람의 돌봄·건강과 사회서비스 제공 체계",
        "departmentIds": [
          "D03",
          "D12"
        ]
      },
      {
        "id": "B3.06",
        "text": "공연·전시 기획과 예술조직 운영",
        "departmentIds": [
          "D35"
        ]
      },
      {
        "id": "B3.07",
        "text": "반려동물의 건강·행동과 관련 서비스 운영",
        "departmentIds": [
          "D46"
        ]
      },
      {
        "id": "B3.08",
        "text": "법률·행정 제도와 공공·조직 관리",
        "departmentIds": [
          "D11"
        ]
      }
    ]
  },
  {
    "id": "C1",
    "field": "C",
    "tier": "T1",
    "weightKey": "T1",
    "stepName": "맞춤 탐색",
    "title": "기술·분석 맞춤 1",
    "prompt": "기술과 분석을 배운다면 어떤 대상을 다뤄보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "C1.01",
        "text": "컴퓨터·소프트웨어와 데이터·수학",
        "departmentIds": [
          "D21",
          "D22",
          "D25",
          "D27"
        ]
      },
      {
        "id": "C1.02",
        "text": "전기·전자 장치와 통신 시스템",
        "departmentIds": [
          "D23"
        ]
      },
      {
        "id": "C1.03",
        "text": "기계·자동화 장치와 드론·로봇",
        "departmentIds": [
          "D24",
          "D26"
        ]
      },
      {
        "id": "C1.04",
        "text": "여러 기술을 결합해 만드는 제품·시스템",
        "departmentIds": [
          "D52"
        ]
      },
      {
        "id": "C1.05",
        "text": "국방 현장의 AI·첨단기술 시스템",
        "departmentIds": [
          "D42"
        ]
      },
      {
        "id": "C1.06",
        "text": "부동산 시장·입지와 공간정보",
        "departmentIds": [
          "D53"
        ]
      },
      {
        "id": "C1.07",
        "text": "작물 재배 환경과 스마트팜",
        "departmentIds": [
          "D45"
        ]
      },
      {
        "id": "C1.08",
        "text": "산업현장의 위험과 사고 예방",
        "departmentIds": [
          "D14"
        ]
      }
    ]
  },
  {
    "id": "C2",
    "field": "C",
    "tier": "T2",
    "weightKey": "T2",
    "stepName": "맞춤 탐색",
    "title": "기술·분석 맞춤 2",
    "prompt": "기술을 활용해 어떤 일을 더 해보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "C2.01",
        "text": "웹·앱과 컴퓨터 시스템 설계·개발하기",
        "departmentIds": [
          "D21"
        ]
      },
      {
        "id": "C2.02",
        "text": "AI의 원리를 배우고 문제에 맞는 모델 적용하기",
        "departmentIds": [
          "D25",
          "D42"
        ]
      },
      {
        "id": "C2.03",
        "text": "데이터와 수학·통계로 현상 분석하기",
        "departmentIds": [
          "D22",
          "D27",
          "D53"
        ]
      },
      {
        "id": "C2.04",
        "text": "정보와 시스템의 취약점을 찾아 보호하기",
        "departmentIds": [
          "D22"
        ]
      },
      {
        "id": "C2.05",
        "text": "전기·전자 또는 기계 장치의 작동 설계하기",
        "departmentIds": [
          "D23",
          "D24"
        ]
      },
      {
        "id": "C2.06",
        "text": "센서·제어 기술로 움직임이나 환경을 자동 조절하기",
        "departmentIds": [
          "D26",
          "D45"
        ]
      },
      {
        "id": "C2.07",
        "text": "요구사항에 맞게 기술을 결합하고 시제품 시험·개선하기",
        "departmentIds": [
          "D52"
        ]
      },
      {
        "id": "C2.08",
        "text": "사고 원인과 작업환경을 조사하고 예방 대책 세우기",
        "departmentIds": [
          "D14"
        ]
      }
    ]
  },
  {
    "id": "C3",
    "field": "C",
    "tier": "T3",
    "weightKey": "T3",
    "stepName": "맞춤 탐색",
    "title": "기술·분석 맞춤 3",
    "prompt": "기술을 이해하기 위해 어떤 내용을 더 깊이 배우고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "C3.01",
        "text": "프로그래밍과 소프트웨어·데이터 시스템의 원리",
        "departmentIds": [
          "D21",
          "D22",
          "D25"
        ]
      },
      {
        "id": "C3.02",
        "text": "수학적 모형과 통계적 추론의 근거",
        "departmentIds": [
          "D27"
        ]
      },
      {
        "id": "C3.03",
        "text": "전기·전자 회로와 통신의 원리",
        "departmentIds": [
          "D23"
        ]
      },
      {
        "id": "C3.04",
        "text": "기계 구조·움직임과 자동화·제어의 원리",
        "departmentIds": [
          "D24",
          "D26"
        ]
      },
      {
        "id": "C3.05",
        "text": "여러 기술을 연결하는 시스템 설계와 검증 방법",
        "departmentIds": [
          "D52",
          "D42"
        ]
      },
      {
        "id": "C3.06",
        "text": "특정 산업의 자료·환경을 분석하고 기술을 적용하는 방법",
        "departmentIds": [
          "D53",
          "D45"
        ]
      },
      {
        "id": "C3.07",
        "text": "산업안전 기준과 위험 진단·예방 방법",
        "departmentIds": [
          "D14"
        ]
      }
    ]
  },
  {
    "id": "D1",
    "field": "D",
    "tier": "T1",
    "weightKey": "T1",
    "stepName": "맞춤 탐색",
    "title": "표현·창작 맞춤 1",
    "prompt": "어떤 재료나 매체로 표현하는 일이 가장 끌리나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "D1.01",
        "text": "글과 이야기",
        "departmentIds": [
          "D30"
        ]
      },
      {
        "id": "D1.02",
        "text": "이미지·영상과 디지털 콘텐츠",
        "departmentIds": [
          "D28",
          "D43"
        ]
      },
      {
        "id": "D1.03",
        "text": "건축물·실내·전시 공간",
        "departmentIds": [
          "D29"
        ]
      },
      {
        "id": "D1.04",
        "text": "그림과 미술 재료",
        "departmentIds": [
          "D38",
          "D51"
        ]
      },
      {
        "id": "D1.05",
        "text": "악기·목소리와 음악",
        "departmentIds": [
          "D33",
          "D34",
          "D36",
          "D37"
        ]
      },
      {
        "id": "D1.06",
        "text": "몸·표정·대사와 연기",
        "departmentIds": [
          "D40"
        ]
      },
      {
        "id": "D1.07",
        "text": "헤어·메이크업·네일과 외적 이미지",
        "departmentIds": [
          "D31"
        ]
      }
    ]
  },
  {
    "id": "D2",
    "field": "D",
    "tier": "T2",
    "weightKey": "T2",
    "stepName": "맞춤 탐색",
    "title": "표현·창작 맞춤 2",
    "prompt": "표현 활동을 통해 무엇을 가장 해보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "D2.01",
        "text": "이야기를 구성해 독자나 시청자에게 전달하기",
        "departmentIds": [
          "D30",
          "D43"
        ]
      },
      {
        "id": "D2.02",
        "text": "사용 목적과 이용자에게 맞게 디자인하기",
        "departmentIds": [
          "D28",
          "D29",
          "D31"
        ]
      },
      {
        "id": "D2.03",
        "text": "나만의 생각과 시각을 미술작품으로 발전시키기",
        "departmentIds": [
          "D38"
        ]
      },
      {
        "id": "D2.04",
        "text": "연주·노래·연기로 무대나 영상에서 직접 표현하기",
        "departmentIds": [
          "D33",
          "D34",
          "D36",
          "D40"
        ]
      },
      {
        "id": "D2.05",
        "text": "제작 도구를 활용해 음원·미디어 콘텐츠 완성하기",
        "departmentIds": [
          "D36",
          "D43"
        ]
      },
      {
        "id": "D2.06",
        "text": "예술활동으로 다른 사람의 정서 표현과 소통 돕기",
        "departmentIds": [
          "D37",
          "D51"
        ]
      }
    ]
  },
  {
    "id": "D3",
    "field": "D",
    "tier": "T3",
    "weightKey": "T3",
    "stepName": "맞춤 탐색",
    "title": "표현·창작 맞춤 3",
    "prompt": "표현을 발전시키기 위해 어떤 내용을 더 깊이 배우고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "D3.01",
        "text": "문장·인물·이야기의 구성과 글쓰기",
        "departmentIds": [
          "D30"
        ]
      },
      {
        "id": "D3.02",
        "text": "시각 요소나 공간의 구성과 이용 경험 설계",
        "departmentIds": [
          "D28",
          "D29"
        ]
      },
      {
        "id": "D3.03",
        "text": "생성형 AI를 활용한 미디어 제작과 스토리텔링",
        "departmentIds": [
          "D43"
        ]
      },
      {
        "id": "D3.04",
        "text": "색·재료·화면과 미술 표현 과정",
        "departmentIds": [
          "D38",
          "D51"
        ]
      },
      {
        "id": "D3.05",
        "text": "클래식 피아노의 연주·반주와 곡 해석",
        "departmentIds": [
          "D33"
        ]
      },
      {
        "id": "D3.06",
        "text": "성악 발성과 노래의 해석·표현",
        "departmentIds": [
          "D34"
        ]
      },
      {
        "id": "D3.07",
        "text": "보컬·악기·리듬·선율을 활용한 다양한 음악활동",
        "departmentIds": [
          "D36",
          "D37"
        ]
      },
      {
        "id": "D3.08",
        "text": "몸의 움직임이나 외적 이미지를 통한 표현 기법",
        "departmentIds": [
          "D40",
          "D31"
        ]
      }
    ]
  },
  {
    "id": "E1",
    "field": "E",
    "tier": "T1",
    "weightKey": "T1",
    "stepName": "맞춤 탐색",
    "title": "건강·생명 맞춤 1",
    "prompt": "건강과 생명에 관해 가장 알아보고 싶은 것은 무엇인가요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "E1.01",
        "text": "운동과 체력·신체 수행 능력",
        "departmentIds": [
          "D32"
        ]
      },
      {
        "id": "E1.02",
        "text": "요가·명상과 몸·마음의 수련",
        "departmentIds": [
          "D48"
        ]
      },
      {
        "id": "E1.03",
        "text": "식생활·생활습관과 일상의 건강관리",
        "departmentIds": [
          "D47"
        ]
      },
      {
        "id": "E1.04",
        "text": "의료기관과 지역사회의 건강증진",
        "departmentIds": [
          "D12"
        ]
      },
      {
        "id": "E1.05",
        "text": "반려동물의 건강·영양·행동",
        "departmentIds": [
          "D46"
        ]
      },
      {
        "id": "E1.06",
        "text": "식물의 생육과 작물 재배 환경",
        "departmentIds": [
          "D45"
        ]
      }
    ]
  },
  {
    "id": "E2",
    "field": "E",
    "tier": "T2",
    "weightKey": "T2",
    "stepName": "맞춤 탐색",
    "title": "건강·생명 맞춤 2",
    "prompt": "건강과 생명을 다루는 과정에서 어떤 역할을 해보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "E2.01",
        "text": "다른 사람의 운동·수련·생활 실천 지도하기",
        "departmentIds": [
          "D32",
          "D48",
          "D47"
        ]
      },
      {
        "id": "E2.02",
        "text": "기관이나 사업의 프로그램·서비스 운영하기",
        "departmentIds": [
          "D12",
          "D46"
        ]
      },
      {
        "id": "E2.03",
        "text": "동물의 상태와 행동을 살피고 돌봄에 적용하기",
        "departmentIds": [
          "D46"
        ]
      },
      {
        "id": "E2.04",
        "text": "작물과 재배 환경을 관찰하고 관리하기",
        "departmentIds": [
          "D45"
        ]
      }
    ]
  },
  {
    "id": "E3",
    "field": "E",
    "tier": "T3",
    "weightKey": "T3",
    "stepName": "맞춤 탐색",
    "title": "건강·생명 맞춤 3",
    "prompt": "수업에서 작은 프로젝트를 한다면 무엇을 해보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "E3.01",
        "text": "몸의 움직임과 체력에 맞는 운동 계획 만들기",
        "departmentIds": [
          "D32"
        ]
      },
      {
        "id": "E3.02",
        "text": "요가 동작과 명상을 익혀 수련 프로그램 구성하기",
        "departmentIds": [
          "D48"
        ]
      },
      {
        "id": "E3.03",
        "text": "식생활·생활습관을 점검하고 건강 실천 계획 만들기",
        "departmentIds": [
          "D47"
        ]
      },
      {
        "id": "E3.04",
        "text": "지역 건강증진 사업이나 의료기관 업무 개선안 만들기",
        "departmentIds": [
          "D12"
        ]
      },
      {
        "id": "E3.05",
        "text": "반려동물의 행동·영양을 고려한 돌봄 서비스 구상하기",
        "departmentIds": [
          "D46"
        ]
      },
      {
        "id": "E3.06",
        "text": "생육 조건과 센서 자료를 활용해 재배 환경 개선하기",
        "departmentIds": [
          "D45"
        ]
      }
    ]
  },
  {
    "id": "F1",
    "field": "F",
    "tier": "T1",
    "weightKey": "T1",
    "stepName": "맞춤 탐색",
    "title": "인문·사회 맞춤 1",
    "prompt": "인간과 사회에 관한 주제 중 무엇을 더 알아보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "F1.01",
        "text": "인간과 세계, 지식·가치·옳고 그름에 관한 질문",
        "departmentIds": [
          "D50"
        ]
      },
      {
        "id": "F1.02",
        "text": "생활 속 법률과 행정·공공제도",
        "departmentIds": [
          "D11"
        ]
      },
      {
        "id": "F1.03",
        "text": "북한 사회와 남북관계·통일·안보",
        "departmentIds": [
          "D15"
        ]
      },
      {
        "id": "F1.04",
        "text": "한국어·한국문화와 다양한 배경의 학습자",
        "departmentIds": [
          "D13"
        ]
      },
      {
        "id": "F1.05",
        "text": "영어로 이루어지는 일상·문화·업무 소통",
        "departmentIds": [
          "D41"
        ]
      }
    ]
  },
  {
    "id": "F2",
    "field": "F",
    "tier": "T2",
    "weightKey": "T2",
    "stepName": "맞춤 탐색",
    "title": "인문·사회 맞춤 2",
    "prompt": "그 관심을 어떤 방식으로 더 탐구하고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "F2.01",
        "text": "서로 다른 사상·주장을 비교하고 논리적으로 토론하기",
        "departmentIds": [
          "D50"
        ]
      },
      {
        "id": "F2.02",
        "text": "법과 제도를 해석해 실제 사례에 적용하기",
        "departmentIds": [
          "D11"
        ]
      },
      {
        "id": "F2.03",
        "text": "사회·정책 자료를 읽고 변화와 쟁점 분석하기",
        "departmentIds": [
          "D15"
        ]
      },
      {
        "id": "F2.04",
        "text": "언어와 문화를 배우고 설명·소통에 활용하기",
        "departmentIds": [
          "D13",
          "D41"
        ]
      }
    ]
  },
  {
    "id": "F3",
    "field": "F",
    "tier": "T3",
    "weightKey": "T3",
    "stepName": "맞춤 탐색",
    "title": "인문·사회 맞춤 3",
    "prompt": "배운 내용을 활용해 무엇을 완성해보고 싶나요?",
    "allowSkip": false,
    "required": true,
    "maxSelect": 1,
    "options": [
      {
        "id": "F3.01",
        "text": "삶과 가치에 관한 질문을 근거와 논증으로 풀어낸 글",
        "departmentIds": [
          "D50"
        ]
      },
      {
        "id": "F3.02",
        "text": "생활 속 법무·행정 문제를 검토한 사례 보고서",
        "departmentIds": [
          "D11"
        ]
      },
      {
        "id": "F3.03",
        "text": "북한·남북관계의 쟁점을 정리한 분석·교육 자료",
        "departmentIds": [
          "D15"
        ]
      },
      {
        "id": "F3.04",
        "text": "한국어와 문화를 알려주는 수업 자료",
        "departmentIds": [
          "D13"
        ]
      },
      {
        "id": "F3.05",
        "text": "영어 발표문·번역문이나 업무 소통 자료",
        "departmentIds": [
          "D41"
        ]
      },
      {
        "id": "F3.06",
        "text": "영어 학습자의 이해와 연습을 돕는 수업 자료",
        "departmentIds": [
          "D41"
        ]
      }
    ]
  }
];
  var purposeGuide = {
  "OB05.01": "관심 있는 학습 내용과 전공 과정을 확인해보세요.",
  "OB05.02": "관련 자격과 교과·시험·실습 등 취득 요건을 함께 확인해보세요.",
  "OB05.03": "현재 하는 일에 연결할 수 있는 학습 내용과 역량을 살펴보세요.",
  "OB05.04": "주요 학습 내용과 진출 분야를 비교해 새로운 방향을 살펴보세요.",
  "OB05.05": "관심 사업에 연결할 수 있는 학습 내용과 적용 분야를 확인해보세요.",
  "OB05.06": "더 배우고 싶은 주제와 활동을 중심으로 전공을 살펴보세요."
};
  
  // 빠른 조회를 위한 맵 생성
  var allQuestions = [].concat(onboarding, common, custom);
  var allQuestionsMap = {};
  var allOptionsMap = {};
  
  for (var i = 0; i < allQuestions.length; i++) {
    var q = allQuestions[i];
    allQuestionsMap[q.id] = q;
    if (q.options && q.options.length) {
      for (var j = 0; j < q.options.length; j++) {
        var opt = q.options[j];
        allOptionsMap[opt.id] = opt;
      }
    }
  }
  
  window.SCU_QUESTIONS = {
    onboarding: onboarding,
    common: common,
    custom: custom,
    purposeGuide: purposeGuide,
    allQuestions: allQuestions,
    allQuestionsMap: allQuestionsMap,
    allOptionsMap: allOptionsMap
  };
})();
