/**
 * 서울사이버대학교 학과찾기 - 메인 애플리케이션 모듈 (js/app.js)
 * 제1부 4단계 및 5단계: 온보딩/질문 흐름, 점수 계산(score2), TOP4 추출, 학과 월드컵(토너먼트)
 */
(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. 애플리케이션 상태 (State)
  // --------------------------------------------------------------------------
  var state = {
    currentScreenId: 'screen-start', // 'screen-start' | 'screen-question' | 'screen-top4' | 'screen-cup' | 'screen-result'
    currentQuestionIndex: 0,
    answers: {},                     // { [questionId]: string[] | null }
    selectedFields: [],              // ['A', 'B', ...] (Q1에서 선택된 분야 목록)
    interestedDeptId: null,          // OB04-1 둘러보기에서 선택한 관심 학과 (점수 미반영)
    hasCompletedQuestions: false,    // 질문 완료 여부
    rankingResult: null,             // { rankedList, top4, hasEnoughCandidates, positiveCount }
    cupState: null,                  // SCU_CUP 상태 객체
    promoCurrentIndex: 0,            // 현재 프로모션 카드 인덱스
    promoPaused: false,               // 자동 롤링 일시정지 여부
    accordionOpen: false,             // 결과 아코디언 열림 상태
  };

  // 현재 유효한 질문 객체들의 배열 (동적으로 재구성됨)
  var questionSequence = [];

  // DOM 요소 캐시
  var dom = {};

  // --------------------------------------------------------------------------
  // 2. 초기화 및 DOM 캐싱
  // --------------------------------------------------------------------------
  function initApp() {
    cacheDomElements();
    bindEvents();
    renderBrowseModalList(''); // 51개 전체 학과 둘러보기 목록 사전 렌더링

    // 저장된 세션 복구 시도
    var savedState = window.SCU_STORAGE ? window.SCU_STORAGE.loadState() : null;
    if (savedState && savedState.answers && Object.keys(savedState.answers).length > 0) {
      state = savedState;
      rebuildQuestionSequence();

      // 인덱스 범위 안전 보정
      if (state.currentQuestionIndex >= questionSequence.length) {
        state.currentQuestionIndex = Math.max(0, questionSequence.length - 1);
      }

      // 월드컵 상태 복구
      if (state.cupState && window.SCU_CUP) {
        window.SCU_CUP.restoreState(state.cupState);
      }

      // 랭킹 복구 또는 재계산
      if (state.hasCompletedQuestions && (!state.rankingResult || !state.rankingResult.top4)) {
        computeRankingAndSetupCup();
      }

      showScreen(state.currentScreenId || 'screen-start');

      if (state.currentScreenId === 'screen-question') {
        renderCurrentQuestion();
      } else if (state.currentScreenId === 'screen-top4') {
        if (state.rankingResult && state.rankingResult.top4) {
          renderTop4Screen(state.rankingResult.top4);
        }
      } else if (state.currentScreenId === 'screen-cup') {
        renderCupMatch();
      } else if (state.currentScreenId === 'screen-result') {
        renderResultScreen();
      }
    } else {
      rebuildQuestionSequence();
      showScreen('screen-start');
    }
  }

  function cacheDomElements() {
    dom.progressContainer = document.getElementById('progressContainer');
    dom.progressStageBadge = document.getElementById('progressStageBadge');
    dom.progressStageText = document.getElementById('progressStageText');
    dom.progressCountText = document.getElementById('progressCountText');
    dom.progressBarFill = document.getElementById('progressBarFill');

    dom.screenSections = document.querySelectorAll('.screen-section');
    dom.btnStartExplore = document.getElementById('btnStartExplore');

    // 질문 화면 요소
    dom.qCodeBadge = document.getElementById('qCodeBadge');
    dom.qTagText = document.getElementById('qTagText');
    dom.questionTitle = document.getElementById('questionTitle');
    dom.questionHelp = document.getElementById('questionHelp');
    dom.qAlertLimit = document.getElementById('qAlertLimit');
    dom.optionsList = document.getElementById('optionsList');
    dom.btnPrevQuestion = document.getElementById('btnPrevQuestion');
    dom.btnSkipQuestion = document.getElementById('btnSkipQuestion');
    dom.btnNextQuestion = document.getElementById('btnNextQuestion');

    // 둘러보기 모달 요소
    dom.browseModal = document.getElementById('browseModal');
    dom.searchDeptInput = document.getElementById('searchDeptInput');
    dom.browseGrid = document.getElementById('browseGrid');
    dom.btnHeaderBrowse = document.getElementById('btnHeaderBrowse');
    dom.btnPreviewModal = document.getElementById('btnPreviewModal');
    dom.btnModalClose = document.getElementById('btnModalClose');
    dom.btnModalConfirm = document.getElementById('btnModalConfirm');

    // TOP4 화면 요소
    dom.top4Grid = document.querySelector('.top4-grid');
    dom.btnStartCupMatch = document.getElementById('btnStartCupMatch');

    // 월드컵 화면 요소
    dom.cupStageBadge = document.getElementById('cupStageBadge');
    dom.cupTitle = document.getElementById('cupTitle');
    dom.cupSubtitle = document.querySelector('.cup-subtitle');
    dom.cupVersusGrid = document.querySelector('.cup-versus-grid');
    dom.cupCardLeft = document.getElementById('cupCardLeft');
    dom.cupCardRight = document.getElementById('cupCardRight');
    dom.btnSelectLeft = document.getElementById('btnSelectLeft');
    dom.btnSelectRight = document.getElementById('btnSelectRight');

    // 결과 화면 요소
    dom.resultMainGrid = document.getElementById('resultMainGrid');
    dom.resultReasonText = document.getElementById('resultReasonText');
    dom.resultPurposeText = document.getElementById('resultPurposeText');
    dom.btnRestartCup = document.getElementById('btnRestartCup');
    dom.btnRestartAll = document.getElementById('btnRestartAll');
    dom.headerLogo = document.getElementById('headerLogo');

    // 개발용 미리보기 바 탭
    dom.previewTabs = document.querySelectorAll('.dev-preview-btn[data-target]');
  }

  // --------------------------------------------------------------------------
  // 3. 동적 질문 시퀀스 구성 로직
  // --------------------------------------------------------------------------
  /**
   * 온보딩 분기(OB03-1) 및 Q1 선택 분야에 따라 질문 목록을 동적으로 생성
   */
  function rebuildQuestionSequence() {
    var seq = [];
    var qData = window.SCU_QUESTIONS;
    if (!qData) return;

    var obMap = {};
    qData.onboarding.forEach(function(q) { obMap[q.id] = q; });

    var commonMap = {};
    qData.common.forEach(function(q) { commonMap[q.id] = q; });

    // 1. 고정 온보딩: OB01, OB02, OB03
    if (obMap['OB01']) seq.push(obMap['OB01']);
    if (obMap['OB02']) seq.push(obMap['OB02']);
    if (obMap['OB03']) seq.push(obMap['OB03']);

    // 2. 조건부 온보딩: OB03-1
    var ob03Ans = state.answers['OB03'];
    var isEmployed = Array.isArray(ob03Ans) && ob03Ans.indexOf('OB03.01') !== -1;
    if (isEmployed && obMap['OB03-1']) {
      seq.push(obMap['OB03-1']);
    } else {
      if (state.answers['OB03-1']) {
        state.answers['OB03-1'] = null;
      }
    }

    // 3. 관심 학과 유무 & 학습 목적: OB04, OB05
    if (obMap['OB04']) seq.push(obMap['OB04']);
    if (obMap['OB05']) seq.push(obMap['OB05']);

    // 4. 공통 질문: Q1, Q2, Q3, Q4
    if (commonMap['Q1']) seq.push(commonMap['Q1']);
    if (commonMap['Q2']) seq.push(commonMap['Q2']);
    if (commonMap['Q3']) seq.push(commonMap['Q3']);
    if (commonMap['Q4']) seq.push(commonMap['Q4']);

    // 5. 맞춤 질문: Q1 선택 분야를 알파벳(A->F) 순서로 정렬하여 각 3문항씩 추가
    var q1Ans = state.answers['Q1'];
    var selectedFields = [];
    if (Array.isArray(q1Ans) && q1Ans.length > 0 && commonMap['Q1']) {
      commonMap['Q1'].options.forEach(function(opt) {
        if (q1Ans.indexOf(opt.id) !== -1 && opt.field) {
          selectedFields.push(opt.field);
        }
      });
    }

    // A->F 정렬 보장
    selectedFields.sort();
    state.selectedFields = selectedFields;

    // 제외된 분야의 맞춤 질문 답 정리
    cleanOrphanCustomAnswers(selectedFields);

    // 각 분야별 맞춤 문항 1->2->3번 순서로 시퀀스에 추가
    var customList = qData.custom || [];
    selectedFields.forEach(function(fieldCode) {
      for (var tierNum = 1; tierNum <= 3; tierNum++) {
        var qId = fieldCode + tierNum;
        var foundQ = customList.find(function(item) { return item.id === qId; });
        if (foundQ) {
          seq.push(foundQ);
        }
      }
    });

    questionSequence = seq;
  }

  function cleanOrphanCustomAnswers(activeFields) {
    var allFieldCodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    allFieldCodes.forEach(function(field) {
      if (activeFields.indexOf(field) === -1) {
        delete state.answers[field + '1'];
        delete state.answers[field + '2'];
        delete state.answers[field + '3'];
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. 화면 전환 및 렌더링
  // --------------------------------------------------------------------------
  function showScreen(screenId) {
    state.currentScreenId = screenId;
    dom.screenSections.forEach(function(sec) {
      sec.classList.toggle('active', sec.id === screenId);
    });

    if (dom.previewTabs) {
      dom.previewTabs.forEach(function(tab) {
        tab.classList.toggle('active', tab.getAttribute('data-target') === screenId);
      });
    }

    if (screenId === 'screen-start') {
      dom.progressContainer.style.display = 'none';
    } else {
      dom.progressContainer.style.display = 'block';
      updateProgressBar(screenId);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    persistState();
  }

  function updateProgressBar(screenId) {
    if (screenId === 'screen-question') {
      var currentQ = questionSequence[state.currentQuestionIndex];
      var totalCount = questionSequence.length;
      var curIndex = state.currentQuestionIndex;

      var stageText = '기본 정보';
      var stageBadge = '1단계';

      if (currentQ) {
        if (currentQ.id.indexOf('OB01') === 0 || currentQ.id.indexOf('OB02') === 0 || currentQ.id.indexOf('OB03') === 0) {
          stageBadge = '1단계';
          stageText = '기본 정보 파악';
        } else if (currentQ.id === 'OB04' || currentQ.id === 'OB05' || currentQ.id.indexOf('Q') === 0) {
          stageBadge = '2단계';
          stageText = '관심 탐색 (공통 질문)';
        } else {
          stageBadge = '3단계';
          stageText = '맞춤 심층 탐색 (' + (currentQ.fieldTag || '전공') + ' 분야)';
        }
      }

      dom.progressStageBadge.textContent = stageBadge;
      dom.progressStageText.textContent = stageText;
      dom.progressCountText.innerHTML = '<span>질문 ' + (curIndex + 1) + '</span> / <span>' + totalCount + '</span>';

      var percent = Math.round(((curIndex + 1) / totalCount) * 100);
      dom.progressBarFill.style.width = percent + '%';
      dom.progressBarFill.parentElement.setAttribute('aria-valuenow', percent);
    } else if (screenId === 'screen-top4') {
      dom.progressStageBadge.textContent = '4단계';
      dom.progressStageText.textContent = '추천 상위 4개 학과 확인';
      dom.progressCountText.innerHTML = '<span>탐색 완료</span>';
      dom.progressBarFill.style.width = '75%';
    } else if (screenId === 'screen-cup') {
      var match = window.SCU_CUP ? window.SCU_CUP.getCurrentMatch() : null;
      var badgeName = (match && match.roundBadge) ? match.roundBadge : '1:1 학과 토너먼트';
      dom.progressStageBadge.textContent = '4단계';
      dom.progressStageText.textContent = badgeName;
      dom.progressCountText.innerHTML = '<span>비교 진행 중</span>';
      dom.progressBarFill.style.width = '85%';
    } else if (screenId === 'screen-result') {
      dom.progressStageBadge.textContent = '5단계';
      dom.progressStageText.textContent = '최종 추천 및 선택 결과';
      dom.progressCountText.innerHTML = '<span>최종 완료</span>';
      dom.progressBarFill.style.width = '100%';
    }
  }

  // --------------------------------------------------------------------------
  // 5. 질문 화면 렌더링 및 선택 제어
  // --------------------------------------------------------------------------
  function renderCurrentQuestion() {
    if (state.currentQuestionIndex < 0 || state.currentQuestionIndex >= questionSequence.length) {
      console.warn('[SCU_APP] 유효하지 않은 질문 인덱스:', state.currentQuestionIndex);
      return;
    }

    var q = questionSequence[state.currentQuestionIndex];
    if (!q) return;

    dom.qCodeBadge.textContent = q.id;
    dom.qTagText.textContent = q.stepName || (q.fieldTag ? q.fieldTag + ' 분야 맞춤 질문' : '관심 탐색');

    var titleText = q.prompt || q.title || '';
    dom.questionTitle.textContent = titleText;

    var helpText = '';
    if (q.id === 'Q1') {
      helpText = '최대 2개까지 선택할 수 있어요.';
    } else if (q.required) {
      helpText = '필수 질문입니다. 1개를 선택해 주세요.';
    } else if (q.allowSkip) {
      helpText = '선택하거나 건너뛸 수 있습니다. (추천 점수에 미반영)';
    }
    dom.questionHelp.textContent = helpText;
    dom.qAlertLimit.style.display = 'none';

    dom.optionsList.innerHTML = '';
    var curSelected = state.answers[q.id] || [];
    var isMulti = (q.maxSelect && q.maxSelect > 1);

    q.options.forEach(function(opt) {
      var itemEl = document.createElement('div');
      itemEl.className = 'option-item';
      itemEl.setAttribute('role', isMulti ? 'checkbox' : 'radio');
      itemEl.setAttribute('tabindex', '0');
      itemEl.setAttribute('data-opt-id', opt.id);

      var isChecked = curSelected.indexOf(opt.id) !== -1;
      if (isChecked) {
        itemEl.classList.add('selected');
        itemEl.setAttribute('aria-checked', 'true');
      } else {
        itemEl.setAttribute('aria-checked', 'false');
      }

      var indicatorEl = document.createElement('div');
      indicatorEl.className = 'option-indicator';
      indicatorEl.setAttribute('aria-hidden', 'true');
      var checkIcon = document.createElement('span');
      checkIcon.className = 'option-indicator-icon';
      checkIcon.textContent = '✔';
      indicatorEl.appendChild(checkIcon);

      var textWrapEl = document.createElement('div');
      textWrapEl.className = 'option-text-wrap';

      var labelEl = document.createElement('div');
      labelEl.className = 'option-label';
      labelEl.textContent = opt.text;
      textWrapEl.appendChild(labelEl);

      if (opt.desc) {
        var descEl = document.createElement('div');
        descEl.className = 'option-desc';
        descEl.textContent = opt.desc;
        textWrapEl.appendChild(descEl);
      }

      itemEl.appendChild(indicatorEl);
      itemEl.appendChild(textWrapEl);

      itemEl.addEventListener('click', function() {
        handleOptionSelect(q, opt.id);
      });

      itemEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOptionSelect(q, opt.id);
        }
      });

      dom.optionsList.appendChild(itemEl);
    });

    if (q.allowSkip) {
      dom.btnSkipQuestion.style.display = 'inline-flex';
    } else {
      dom.btnSkipQuestion.style.display = 'none';
    }

    updateNextButtonState(q);
    updateProgressBar('screen-question');
  }

  function updateNextButtonState(q) {
    var curSelected = state.answers[q.id];
    var hasAnswer = Array.isArray(curSelected) && curSelected.length > 0;

    if (q.required && !hasAnswer) {
      dom.btnNextQuestion.setAttribute('aria-disabled', 'true');
    } else {
      dom.btnNextQuestion.removeAttribute('aria-disabled');
    }
  }

  function handleOptionSelect(q, optId) {
    var curAns = state.answers[q.id];
    if (!Array.isArray(curAns)) {
      curAns = [];
    }

    var isMulti = (q.maxSelect && q.maxSelect > 1);

    if (isMulti) {
      var idx = curAns.indexOf(optId);
      if (idx !== -1) {
        curAns.splice(idx, 1);
        dom.qAlertLimit.style.display = 'none';
      } else {
        if (curAns.length >= (q.maxSelect || 2)) {
          dom.qAlertLimit.textContent = '최대 ' + q.maxSelect + '개까지만 선택할 수 있어요. 기존 선택을 해제한 후 골라주세요.';
          dom.qAlertLimit.style.display = 'block';
          return;
        }
        curAns.push(optId);
        dom.qAlertLimit.style.display = 'none';
      }
      state.answers[q.id] = curAns;
    } else {
      state.answers[q.id] = [optId];
    }

    // 질문 답변이 수정되면 기존 추천 결과 및 월드컵 결과 무효화 (기획서 지침)
    state.rankingResult = null;
    state.hasCompletedQuestions = false;
    if (window.SCU_CUP) {
      window.SCU_CUP.initCup([]);
    }

    if (q.id === 'OB03' || q.id === 'Q1') {
      rebuildQuestionSequence();
    }

    syncOptionsUI(q);
    updateNextButtonState(q);
    persistState();
  }

  function syncOptionsUI(q) {
    var curSelected = state.answers[q.id] || [];
    var items = dom.optionsList.querySelectorAll('.option-item');
    items.forEach(function(item) {
      var optId = item.getAttribute('data-opt-id');
      var isChecked = curSelected.indexOf(optId) !== -1;
      item.classList.toggle('selected', isChecked);
      item.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    });
  }

  // --------------------------------------------------------------------------
  // 6. 네비게이션 제어 (다음, 이전, 건너뛰기)
  // --------------------------------------------------------------------------
  function goNextQuestion() {
    var q = questionSequence[state.currentQuestionIndex];
    if (!q) return;

    var curAns = state.answers[q.id];
    var hasAnswer = Array.isArray(curAns) && curAns.length > 0;

    if (q.required && !hasAnswer) {
      var noticeMsg = (q.id === 'Q1') ? '관심 분야를 최소 1개 이상 선택해 주세요.' : '선택지를 하나 선택해 주세요.';
      dom.qAlertLimit.textContent = noticeMsg;
      dom.qAlertLimit.style.display = 'block';
      setTimeout(function() {
        if (dom.qAlertLimit) dom.qAlertLimit.style.display = 'none';
      }, 2500);
      return;
    }

    // OB04 '있어요' 분기 (둘러보기 모달 제공)
    if (q.id === 'OB04' && Array.isArray(curAns) && curAns.indexOf('OB04.01') !== -1 && !state.hasViewedBrowse) {
      state.hasViewedBrowse = true;
      openBrowseModal(function() {
        advanceToNextQuestion();
      });
      return;
    }

    advanceToNextQuestion();
  }

  function advanceToNextQuestion() {
    if (state.currentQuestionIndex < questionSequence.length - 1) {
      state.currentQuestionIndex++;
      renderCurrentQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      persistState();
    } else {
      // 모든 질문 완료! 점수 계산 수행 및 TOP4 추출 (skip TOP4, 바로 월드컵 시작)
      state.hasCompletedQuestions = true;
      var success = computeRankingAndSetupCup();
      if (success) {
        // 바로 월드컵 화면으로 전환
        startCupTournament();
      }
    }
  }

  function goPrevQuestion() {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderCurrentQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      persistState();
    } else {
      showScreen('screen-start');
    }
  }

  function skipCurrentQuestion() {
    var q = questionSequence[state.currentQuestionIndex];
    if (!q || !q.allowSkip) return;

    state.answers[q.id] = null;
    state.rankingResult = null;
    state.hasCompletedQuestions = false;

    if (q.id === 'OB03') {
      rebuildQuestionSequence();
    }

    advanceToNextQuestion();
  }

  // --------------------------------------------------------------------------
  // 7. 점수 계산 (5단계 SCU_SCORING 연동)
  // --------------------------------------------------------------------------
  function computeRankingAndSetupCup() {
    if (!window.SCU_SCORING) {
      console.error('[SCU_APP] SCU_SCORING 모듈이 로드되지 않았습니다.');
      return false;
    }

    var result = window.SCU_SCORING.calculateRanking(state.answers);
    state.rankingResult = result;

    if (!result.hasEnoughCandidates) {
      alert('답변을 바탕으로 추천할 수 있는 후보 학과(양의 점수)가 부족합니다 (' + result.positiveCount + '개).\n앞선 질문으로 돌아가 관심 분야를 다시 확인해 주세요.');
      return false;
    }

    if (window.SCU_CUP) {
      window.SCU_CUP.initCup(result.top4);
      state.cupState = window.SCU_CUP.getState();
    }

    persistState();
    return true;
  }

  // --------------------------------------------------------------------------
  // 8. TOP4 안내 화면 (SC20) 렌더링
  // --------------------------------------------------------------------------
  function renderTop4Screen(top4List) {
    if (!dom.top4Grid || !Array.isArray(top4List) || top4List.length < 4) return;
    dom.top4Grid.innerHTML = '';

    top4List.forEach(function(dept) {
      var card = document.createElement('article');
      card.className = 'top4-card';

      // 16:9 썸네일 박스
      var imgWrap = document.createElement('div');
      imgWrap.className = 'aspect-16-9-box';
      imgWrap.innerHTML = '<div class="dept-img-placeholder">' +
        '<span class="placeholder-college">' + dept.college + '</span>' +
        '<strong class="placeholder-name">' + dept.name + '</strong>' +
        '<span class="placeholder-tag">ID: ' + dept.id + '</span>' +
        '</div>';
      card.appendChild(imgWrap);

      var contentWrap = document.createElement('div');
      contentWrap.className = 'top4-card-content';

      // 배지 라인 (기획서 원칙: 순위 및 점수 비노출!)
      var badgeLine = document.createElement('div');
      badgeLine.style.display = 'flex';
      badgeLine.style.gap = '4px';
      badgeLine.style.flexWrap = 'wrap';

      var collegeBadge = document.createElement('span');
      collegeBadge.className = 'scu-badge scu-badge-college';
      collegeBadge.textContent = dept.college;
      badgeLine.appendChild(collegeBadge);

      if (dept.isNew) {
        var newBadge = document.createElement('span');
        newBadge.className = 'scu-badge scu-badge-new';
        newBadge.textContent = 'NEW';
        badgeLine.appendChild(newBadge);
      }
      contentWrap.appendChild(badgeLine);

      var nameEl = document.createElement('h3');
      nameEl.className = 'top4-card-name';
      nameEl.textContent = dept.name;
      contentWrap.appendChild(nameEl);

      var introEl = document.createElement('p');
      introEl.className = 'top4-card-intro';
      introEl.textContent = (dept.compare && dept.compare.intro) ? dept.compare.intro : (dept.college + ' 소속 전공');
      contentWrap.appendChild(introEl);

      // 대표 자격 태그
      if (dept.compare && dept.compare.certificates) {
        var tagsWrap = document.createElement('div');
        tagsWrap.className = 'top4-card-tags';

        var certs = dept.compare.certificates.split(',').slice(0, 2);
        certs.forEach(function(c) {
          var tag = document.createElement('span');
          tag.className = 'scu-badge';
          tag.style.background = '#F0F5F2';
          tag.style.fontSize = '12px';
          tag.textContent = c.trim();
          tagsWrap.appendChild(tag);
        });
        contentWrap.appendChild(tagsWrap);
      }

      card.appendChild(contentWrap);
      dom.top4Grid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 9. 월드컵 토너먼트 진행 및 화면 렌더링 (SC21, SC22, SC23)
  // --------------------------------------------------------------------------
  function startCupTournament() {
    if (!window.SCU_CUP || !state.rankingResult || !state.rankingResult.top4) {
      computeRankingAndSetupCup();
    }
    renderCupMatch();
    showScreen('screen-cup');
  }

  function renderCupMatch() {
    if (!window.SCU_CUP) return;
    var match = window.SCU_CUP.getCurrentMatch();
    if (!match) return;

    dom.cupStageBadge.textContent = match.roundBadge;
    dom.cupTitle.textContent = match.roundTitle;
    dom.cupSubtitle.textContent = match.roundDesc;

    // 좌측 학과 카드 렌더링
    renderCupDeptCard(dom.cupCardLeft, match.leftDept, dom.btnSelectLeft);

    // 우측 학과 카드 렌더링
    renderCupDeptCard(dom.cupCardRight, match.rightDept, dom.btnSelectRight);

    updateProgressBar('screen-cup');
    persistState();
  }

  function renderCupDeptCard(cardEl, dept, btnEl) {
    if (!cardEl || !dept) return;

    // 이미지 박스
    var imgWrap = cardEl.querySelector('.aspect-16-9-box');
    if (imgWrap) {
      imgWrap.innerHTML = '<div class="dept-img-placeholder">' +
        '<span class="placeholder-college">' + dept.college + '</span>' +
        '<strong class="placeholder-name">' + dept.name + '</strong>' +
        '<span class="placeholder-tag">ID: ' + dept.id + '</span>' +
        '</div>';
    }

    // 제목 및 배지 (순위/점수 절대 숨김)
    var headerEl = cardEl.querySelector('.cup-card-header');
    if (headerEl) {
      headerEl.innerHTML = '<span class="scu-badge scu-badge-college">' + dept.college + '</span>' +
        (dept.isNew ? ' <span class="scu-badge scu-badge-new">NEW</span>' : '') +
        '<h3 class="cup-card-title">' + dept.name + '</h3>';
    }

    // 바디 (학습 내용, 자격, 진로)
    var bodyEl = cardEl.querySelector('.cup-card-body');
    if (bodyEl) {
      var curriculumText = (dept.compare && dept.compare.curriculum) ? dept.compare.curriculum : '체계적인 전공 커리큘럼';
      var certificatesText = (dept.compare && dept.compare.certificates) ? dept.compare.certificates : '관련 전문 자격 취득';
      var careersText = (dept.result && dept.result.careers) ? dept.result.careers : (dept.college + ' 관련 전문 직무 및 진로 분야');

      bodyEl.innerHTML =
        '<div class="cup-info-block">' +
          '<div class="cup-info-title"><span>📌</span> <span>이런 것을 배워요</span></div>' +
          '<div class="cup-info-content">' + curriculumText + '</div>' +
        '</div>' +
        '<div class="cup-info-block">' +
          '<div class="cup-info-title"><span>🎓</span> <span>대표 취득 자격</span></div>' +
          '<div class="cup-info-content">' + certificatesText + '</div>' +
        '</div>' +
        '<div class="cup-info-block">' +
          '<div class="cup-info-title"><span>💼</span> <span>주요 진로 분야</span></div>' +
          '<div class="cup-info-content">' + careersText + '</div>' +
        '</div>';
    }

    // 버튼 이벤트 바인딩 (단일 핸들러 교체)
    var newBtn = btnEl.cloneNode(true);
    btnEl.parentNode.replaceChild(newBtn, btnEl);
    if (cardEl === dom.cupCardLeft) dom.btnSelectLeft = newBtn;
    if (cardEl === dom.cupCardRight) dom.btnSelectRight = newBtn;

    newBtn.addEventListener('click', function() {
      handleCupSelection(dept.id);
    });
  }

  function handleCupSelection(selectedDeptId) {
    if (!window.SCU_CUP) return;

    var nextStep = window.SCU_CUP.selectDepartment(selectedDeptId);
    state.cupState = window.SCU_CUP.getState();
    persistState();

    if (nextStep === 'nextMatch') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderCupMatch();
    } else if (nextStep === 'toResult') {
      renderResultScreen();
      showScreen('screen-result');
    }
  }

// --------------------------------------------------------------------------
// 10. 결과 화면 렌더링 (SC30 연동)
// --------------------------------------------------------------------------

// 전역 변수: result_copy 데이터 매핑 (학과명 기준)
window.resultCopyData = {};

// 결과 원고 파일 로드 및 파싱 (앱 초기화 시 호출)
function loadResultCopyData() {
  fetch('result_copy.txt')
    .then(r => r.text())
    .then(text => parseResultCopy(text))
    .catch(err => console.error('[SCU_APP] result_copy.txt 로드 실패:', err));
}

function parseResultCopy(text) {
  const sections = ['학과 소개', '주요 학습 내용', '추천 대상', '특장점', '관련 자격', '졸업 후 진로'];
  let currentDept = null;
  let currentSection = null;
  const lines = text.split(/\r?\n/);
  lines.forEach(raw => {
    const line = raw.trim();
    if (!line) return;
    // 학과 헤더 예: [01  사회복지전공  사회복지대학]
    const headerMatch = line.match(/^\[(\d{2})\s+(.*?)\s+.*?\]$/);
    if (headerMatch) {
      const name = headerMatch[2].trim();
      currentDept = { name };
      window.resultCopyData[name] = currentDept;
      currentSection = null;
      return;
    }
    // 섹션 헤더
    const secIdx = sections.findIndex(s => s === line);
    if (secIdx >= 0 && currentDept) {
      currentSection = sections[secIdx];
      currentDept[currentSection] = '';
      return;
    }
    // 내용 누적
    if (currentDept && currentSection) {
      const prev = currentDept[currentSection];
      currentDept[currentSection] = prev ? prev + '\n' + line : line;
    }
  });
  console.info('[SCU_APP] result_copy.txt 파싱 완료, 학과 수:', Object.keys(window.resultCopyData).length);
}

// DOMContentLoaded 시 result_copy 로드
document.addEventListener('DOMContentLoaded', loadResultCopyData);

function renderResultScreen() {
  if (!window.SCU_CUP || !state.rankingResult) return;
  // Deduplicate departments and take top 3
  var rawTop4 = state.rankingResult.top4 || [];
  var uniqueMap = {};
  var uniqueTop4 = [];
  rawTop4.forEach(function (dept) {
    if (dept && dept.id && !uniqueMap[dept.id]) {
      uniqueMap[dept.id] = true;
      uniqueTop4.push(dept);
    }
  });
  if (uniqueTop4.length < 3) return;

  var top3 = uniqueTop4.slice(0, 3);

  if (!dom.resultMainGrid) return;
  dom.resultMainGrid.innerHTML = '';
  dom.resultMainGrid.className = 'result-main-grid';

  // Purpose text (allows custom guide text)
  if (dom.resultPurposeText) {
    var ob05Ans = state.answers['OB05'];
    var purposeMsg = '관심 전공의 커리큘럼과 장학 혜택을 살펴보세요.';
    if (Array.isArray(ob05Ans) && ob05Ans.length > 0 && window.SCU_QUESTIONS) {
      var ob05Q = window.SCU_QUESTIONS.onboarding.find(function (q) { return q.id === 'OB05'; });
      if (ob05Q) {
        var matchedOpt = ob05Q.options.find(function (o) { return o.id === ob05Ans[0]; });
        if (matchedOpt && matchedOpt.guideText) {
          purposeMsg = matchedOpt.guideText;
        }
      }
    }
    dom.resultPurposeText.textContent = purposeMsg;
  }

  // Create a <details> card for each department
  top3.forEach(function (dept, idx) {
    var detailsEl = document.createElement('details');
    if (idx === 0) detailsEl.setAttribute('open', '');
    detailsEl.className = 'result-card-wrapper';

    // Summary (collapsed view)
    var summaryEl = document.createElement('summary');
    summaryEl.className = 'result-summary-card';
    summaryEl.innerHTML = '<span class="scu-badge scu-badge-rank">추천 ' + (idx + 1) + '위</span> <span class="result-card-title">' + dept.name + '</span>';
    detailsEl.appendChild(summaryEl);

    // Full card content
    var card = buildResultDeptCard(dept, ['추천 ' + (idx + 1) + '위']);

    // Button container (two buttons)
    var btnContainer = document.createElement('div');
    btnContainer.className = 'dept-buttons';

    var homeBtn = document.createElement('a');
    homeBtn.className = 'dept-btn';
    homeBtn.textContent = '학과 홈페이지 바로가기';
    if (dept.homepageUrl) {
      homeBtn.href = dept.homepageUrl;
      homeBtn.target = '_blank';
      homeBtn.rel = 'noopener noreferrer';
    } else {
      homeBtn.href = 'javascript:void(0)';
      homeBtn.setAttribute('aria-disabled', 'true');
    }

    var qualBtn = document.createElement('a');
    qualBtn.className = 'dept-btn';
    qualBtn.textContent = '자격증 자세히 보기';
    // Placeholder link for now
    qualBtn.href = 'javascript:void(0)';

    btnContainer.appendChild(homeBtn);
    btnContainer.appendChild(qualBtn);
    card.appendChild(btnContainer);

    detailsEl.appendChild(card);
    dom.resultMainGrid.appendChild(detailsEl);
  });

  updateProgressBar('screen-result');
}


  function buildResultDeptCard(dept, badges) {
    var card = document.createElement('article');
    card.className = 'result-highlight-card';

    var badgeWrap = document.createElement('div');
    badgeWrap.className = 'result-card-badges';

    badges.forEach(function(bText) {
      var b = document.createElement('span');
      if (bText === '추천 1위') b.className = 'scu-badge scu-badge-rank';
      else if (bText === '내가 고른 학과') b.className = 'scu-badge scu-badge-pick';
      else b.className = 'scu-badge scu-badge-college';
      b.textContent = bText;
      badgeWrap.appendChild(b);
    });

    var colBadge = document.createElement('span');
    colBadge.className = 'scu-badge scu-badge-college';
    colBadge.textContent = dept.college;
    badgeWrap.appendChild(colBadge);

    card.appendChild(badgeWrap);

    var title = document.createElement('h3');
    title.className = 'result-card-title';
    title.textContent = dept.name;
    card.appendChild(title);

    // 16:9 이미지 영역
    var imgBox = document.createElement('div');
    imgBox.className = 'aspect-16-9-box';
    imgBox.style.marginBottom = '20px';
    imgBox.innerHTML = '<div class="dept-img-placeholder">' +
      '<span class="placeholder-college">' + dept.college + '</span>' +
      '<strong class="placeholder-name">' + dept.name + '</strong>' +
      '<span class="placeholder-tag">ID: ' + dept.id + '</span>' +
      '</div>';
    card.appendChild(imgBox);

    var intro = document.createElement('p');
    intro.className = 'result-card-intro';
    intro.textContent = (dept.result && dept.result.intro) ? dept.result.intro : ((dept.compare && dept.compare.intro) ? dept.compare.intro : '');
    card.appendChild(intro);

    // 상세 섹션: 학과 소개, 주요 학습 내용, 추천 대상, 특장점, 대표 취득 자격증, 졸업 후 진로
    var detailSection = document.createElement('div');
    detailSection.className = 'result-details-section';

    // Retrieve content from result_copy data using department name
    var copy = window.resultCopyData && window.resultCopyData[dept.name] ? window.resultCopyData[dept.name] : {};

    // Helper to create a detail item
    function addDetail(label, htmlContent) {
      var item = document.createElement('div');
      item.className = 'result-detail-item';
      var lbl = document.createElement('div');
      lbl.className = 'result-detail-label';
      lbl.textContent = label;
      var val = document.createElement('div');
      val.className = 'result-detail-val';
      val.innerHTML = htmlContent;
      item.appendChild(lbl);
      item.appendChild(val);
      detailSection.appendChild(item);
    }

    // 학과 소개 (paragraph)
    if (copy['학과 소개']) {
      addDetail('학과 소개', copy['학과 소개'].replace(/\n/g, '<br/>'));
    }

    // 주요 학습 내용 (list)
    if (copy['주요 학습 내용']) {
      var listHtml = '<ul>';
      copy['주요 학습 내용'].split(/\n+/).forEach(function(line) {
        if (line.trim()) listHtml += '<li>' + line.trim() + '</li>';
      });
      listHtml += '</ul>'; 
      addDetail('주요 학습 내용', listHtml);
    }

    // 추천 대상 (paragraph)
    if (copy['추천 대상']) {
      addDetail('추천 대상', copy['추천 대상'].replace(/\n/g, '<br/>'));
    }

    // 특장점 (list)
    if (copy['특장점']) {
      var listHtml = '<ul>';
      copy['특장점'].split(/\n+/).forEach(function(line) {
        if (line.trim()) listHtml += '<li>' + line.trim() + '</li>';
      });
      listHtml += '</ul>';
      addDetail('특장점', listHtml);
    }

    // 관련 자격 -> 대표 취득 자격증 (including 실습 안내)
    var certLabel = '대표 취득 자격증';
    var certBase = copy['관련 자격'] ? copy['관련 자격'].replace(/\n/g, '<br/>') : (dept.result && dept.result.certificates ? dept.result.certificates : (dept.compare && dept.compare.certificates ? dept.compare.certificates : ''));
    var practAdvice = copy['실습 및 자격 취득 안내'] ? copy['실습 및 자격 취득 안내'].replace(/\n/g, '<br/>') : '';
    var certContent = certBase;
    if (practAdvice) {
      certContent += (certContent ? '<br/><br/>' : '') + practAdvice;
    }
    if (certContent) {
      addDetail(certLabel, certContent);
    }

    // 졸업 후 진로 (split into 직업 and 기관 if possible)
    if (copy['졸업 후 진로']) {
      var careerRaw = copy['졸업 후 진로'];
      var careerHtml = '';
      var lines = careerRaw.split(/\n+/);
      var jobLines = [];
      var orgLines = [];
      lines.forEach(function(l) {
        if (l.includes('직업') || l.includes('직업군') || l.includes('직업명')) {
          jobLines.push(l.trim());
        } else if (l.includes('기관') || l.includes('기관명')) {
          orgLines.push(l.trim());
        } else {
          careerHtml += l.trim() + '<br/>';
        }
      });
      if (jobLines.length) {
        careerHtml += '<strong>관련 직업</strong><br/>' + jobLines.join('<br/>') + '<br/>';
      }
      if (orgLines.length) {
        careerHtml += '<strong>관련 기관</strong><br/>' + orgLines.join('<br/>') + '<br/>';
      }
      if (!careerHtml) {
        careerHtml = careerRaw.replace(/\n/g, '<br/>');
      }
      addDetail('졸업 후 진로', careerHtml);
    }

    card.appendChild(detailSection);
    return card;
  }

  // --------------------------------------------------------------------------
  // 11. 학과 둘러보기 모달 (OB04-1)
  // --------------------------------------------------------------------------
  var modalCloseCallback = null;

  function openBrowseModal(onClose) {
    modalCloseCallback = onClose || null;
    dom.browseModal.classList.add('open');
    if (dom.searchDeptInput) {
      dom.searchDeptInput.value = '';
      renderBrowseModalList('');
      dom.searchDeptInput.focus();
    }
  }

  function closeBrowseModal() {
    dom.browseModal.classList.remove('open');
    if (typeof modalCloseCallback === 'function') {
      var cb = modalCloseCallback;
      modalCloseCallback = null;
      cb();
    }
  }

  function renderBrowseModalList(keyword) {
    if (!dom.browseGrid) return;
    dom.browseGrid.innerHTML = '';

    var allDepts = window.SCU_DEPARTMENTS ? (Array.isArray(window.SCU_DEPARTMENTS) ? window.SCU_DEPARTMENTS : (typeof window.SCU_DEPARTMENTS.getAll === 'function' ? window.SCU_DEPARTMENTS.getAll() : [])) : [];
    var term = (keyword || '').trim().toLowerCase();

    var filtered = allDepts.filter(function(d) {
      if (!term) return true;
      var matchName = d.name.toLowerCase().indexOf(term) !== -1;
      var matchCollege = d.college.toLowerCase().indexOf(term) !== -1;
      var matchIntro = d.compare && d.compare.intro && d.compare.intro.toLowerCase().indexOf(term) !== -1;
      var matchId = d.id.toLowerCase().indexOf(term) !== -1;
      return matchName || matchCollege || matchIntro || matchId;
    });
    // Sort by college name, then by nameSortIndex (or name if not provided)
    filtered.sort(function(a, b) {
      if (a.college === b.college) {
        return (a.nameSortIndex || 0) - (b.nameSortIndex || 0);
      }
      return a.college.localeCompare(b.college);
    });

    if (filtered.length === 0) {
      dom.browseGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 32px; color: var(--scu-text-sub);">' +
        '검색 결과와 일치하는 학과가 없습니다.<br>다른 단어로 검색해 보세요.' +
        '</div>';
      return;
    }

    filtered.forEach(function(dept) {
      var card;
      if (dept.homepageUrl) {
        card = document.createElement('a');
        card.href = dept.homepageUrl;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      } else {
        card = document.createElement('div');
      }
      card.className = 'browse-item-card';

      var thumbWrap = document.createElement('div');
      thumbWrap.className = 'browse-thumb';

      var imgBox = document.createElement('div');
      imgBox.className = 'aspect-16-9-box';
      imgBox.innerHTML = '<div class="dept-img-placeholder" style="padding:4px;">' +
        '<span style="font-size:10px; font-weight:800; color:var(--scu-btn-green);">' + dept.id + '</span>' +
        '</div>';
      thumbWrap.appendChild(imgBox);

      var infoWrap = document.createElement('div');
      infoWrap.className = 'browse-info';

      var badgeLine = document.createElement('div');
      badgeLine.style.display = 'flex';
      badgeLine.style.gap = '4px';
      badgeLine.style.flexWrap = 'wrap';
      badgeLine.style.marginBottom = '2px';

      var collegeBadge = document.createElement('span');
      collegeBadge.className = 'scu-badge scu-badge-college';
      collegeBadge.style.fontSize = '11px';
      collegeBadge.style.padding = '2px 6px';
      collegeBadge.textContent = dept.college;
      badgeLine.appendChild(collegeBadge);

      if (dept.isNew) {
        var newBadge = document.createElement('span');
        newBadge.className = 'scu-badge scu-badge-new';
        newBadge.style.fontSize = '11px';
        newBadge.style.padding = '2px 6px';
        newBadge.textContent = 'NEW';
        badgeLine.appendChild(newBadge);
      }
      infoWrap.appendChild(badgeLine);

      var nameEl = document.createElement('strong');
      nameEl.className = 'browse-dept-name';
      nameEl.textContent = dept.name;
      infoWrap.appendChild(nameEl);

      var descEl = document.createElement('p');
      descEl.className = 'browse-dept-desc';
      descEl.textContent = (dept.compare && dept.compare.intro) ? dept.compare.intro : (dept.college + ' 소속 전공');
      infoWrap.appendChild(descEl);

      card.appendChild(thumbWrap);
      card.appendChild(infoWrap);

      card.addEventListener('click', function() {
        state.interestedDeptId = dept.id;
        console.info('[SCU_APP] 둘러보기에서 관심 학과 확인 (점수 미반영):', dept.id, dept.name);
        closeBrowseModal();
      });

      dom.browseGrid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 12. 이벤트 바인딩
  // --------------------------------------------------------------------------
  function bindEvents() {
    if (dom.btnStartExplore) {
      dom.btnStartExplore.addEventListener('click', function() {
        state.currentQuestionIndex = 0;
        rebuildQuestionSequence();
        showScreen('screen-question');
        renderCurrentQuestion();
      });
    }

    if (dom.btnNextQuestion) dom.btnNextQuestion.addEventListener('click', goNextQuestion);
    if (dom.btnPrevQuestion) dom.btnPrevQuestion.addEventListener('click', goPrevQuestion);
    if (dom.btnSkipQuestion) dom.btnSkipQuestion.addEventListener('click', skipCurrentQuestion);

    // TOP4 화면에서 월드컵 비교 시작
    if (dom.btnStartCupMatch) {
      dom.btnStartCupMatch.addEventListener('click', function() {
        startCupTournament();
      });
    }

    // 모달 이벤트
    if (dom.btnHeaderBrowse) dom.btnHeaderBrowse.addEventListener('click', function() { openBrowseModal(); });
    if (dom.btnPreviewModal) dom.btnPreviewModal.addEventListener('click', function() { openBrowseModal(); });
    if (dom.btnModalClose) dom.btnModalClose.addEventListener('click', closeBrowseModal);
    if (dom.btnModalConfirm) dom.btnModalConfirm.addEventListener('click', closeBrowseModal);
    if (dom.browseModal) {
      dom.browseModal.addEventListener('click', function(e) {
        if (e.target === dom.browseModal) closeBrowseModal();
      });
    }

    if (dom.searchDeptInput) {
      dom.searchDeptInput.addEventListener('input', function(e) {
        renderBrowseModalList(e.target.value);
      });
    }

    // 월드컵 다시 비교하기 (기존 추천 순위 유지한 채 4강 1경기부터 재시작)
    if (dom.btnRestartCup) {
      dom.btnRestartCup.addEventListener('click', function() {
        if (state.rankingResult && state.rankingResult.top4 && window.SCU_CUP) {
          window.SCU_CUP.initCup(state.rankingResult.top4);
          renderCupMatch();
          showScreen('screen-cup');
        }
      });
    }

    // 처음부터 다시하기 (리셋)
    if (dom.btnRestartAll) dom.btnRestartAll.addEventListener('click', resetAll);
    if (dom.headerLogo) {
      dom.headerLogo.addEventListener('click', function() {
        showScreen('screen-start');
      });
    }

    // 개발용 화면 전환 탭 핸들러 연동
    if (dom.previewTabs) {
      dom.previewTabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var targetId = btn.getAttribute('data-target');
          if (targetId === 'screen-question') {
            rebuildQuestionSequence();
            renderCurrentQuestion();
          } else if (targetId === 'screen-top4') {
            if (!state.rankingResult) computeRankingAndSetupCup();
            if (state.rankingResult && state.rankingResult.top4) {
              renderTop4Screen(state.rankingResult.top4);
            }
          } else if (targetId === 'screen-cup') {
            if (!state.rankingResult) computeRankingAndSetupCup();
            renderCupMatch();
          } else if (targetId === 'screen-result') {
            if (!state.rankingResult) computeRankingAndSetupCup();
            renderResultScreen();
          }
          showScreen(targetId);
        });
      });
    }
  }

  function resetAll() {
    if (window.confirm('처음부터 다시 시작하시겠습니까? 현재까지의 질문 답변과 추천 결과가 초기화됩니다.')) {
      state = {
        currentScreenId: 'screen-start',
        currentQuestionIndex: 0,
        answers: {},
        selectedFields: [],
        interestedDeptId: null,
        hasCompletedQuestions: false,
        rankingResult: null,
        cupState: null
      };
      if (window.SCU_STORAGE) {
        window.SCU_STORAGE.clearState();
      }
      rebuildQuestionSequence();
      showScreen('screen-start');
    }
  }

  function persistState() {
    if (window.SCU_STORAGE) {
      if (window.SCU_CUP) {
        state.cupState = window.SCU_CUP.getState();
      }
      window.SCU_STORAGE.saveState(state);
    }
  }

  // --------------------------------------------------------------------------
  // 13. 공개 API
  // --------------------------------------------------------------------------
  window.SCU_APP = {
    init: initApp,
    getState: function() { return state; },
    getQuestionSequence: function() { return questionSequence; },
    computeRankingAndSetupCup: computeRankingAndSetupCup,
    showScreen: showScreen,
    renderCurrentQuestion: renderCurrentQuestion,
    renderTop4Screen: renderTop4Screen,
    renderCupMatch: renderCupMatch,
    renderResultScreen: renderResultScreen,
    resetAll: resetAll
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
