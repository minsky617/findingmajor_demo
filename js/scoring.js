/**
 * 서울사이버대학교 학과찾기 - 점수 계산 및 동점 처리 모듈 (js/scoring.js)
 * 제1부 5단계: score2 정수 연산, 5단계 동점 처리, TOP4 추출, 추천 이유 생성
 */
(function() {
  'use strict';

  var SCU_SCORING = {
    /**
     * 전체 응답 데이터를 바탕으로 50개 순위 대상 학과의 점수를 계산하고 정렬
     * @param {Object} answers - 사용자 응답 객체 { [questionId]: string[] | null }
     * @returns {Object} { rankedList, top4, hasEnoughCandidates, positiveCount }
     */
    calculateRanking: function(answers) {
      if (!answers) answers = {};
      var allDepts = window.SCU_DEPARTMENTS ? (Array.isArray(window.SCU_DEPARTMENTS) ? window.SCU_DEPARTMENTS : []) : [];
      var qData = window.SCU_QUESTIONS;
      var config = window.SCU_CONFIG || {};

      // 1. 순위 계산 대상 학과 50개 추출 (D49 자유전공 제외)
      var candidates = allDepts.filter(function(d) {
        return d.eligibleForRanking === true;
      });

      // 2. Q1 선택 분야 추출 및 정렬
      var q1Ans = answers['Q1'] || [];
      var selectedFields = [];
      var commonMap = {};
      if (qData && qData.common) {
        qData.common.forEach(function(q) { commonMap[q.id] = q; });
      }

      if (commonMap['Q1']) {
        commonMap['Q1'].options.forEach(function(opt) {
          if (q1Ans.indexOf(opt.id) !== -1 && opt.field) {
            selectedFields.push(opt.field);
          }
        });
      }
      selectedFields.sort();
      var K = selectedFields.length;
      if (K === 0) K = 1; // 안전 대비 최소 1개

      // 3. 각 문항별 옵션 맵 및 맞춤 문항 맵 생성
      var customMap = {};
      if (qData && qData.custom) {
        qData.custom.forEach(function(q) { customMap[q.id] = q; });
      }

      // 4. 각 학과별 기본 점수 및 score2 계산
      var scoredList = candidates.map(function(dept) {
        // 공통 문항 기본 점수 (0 또는 1)
        var qScores = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

        // Q1: 선택 분야 중 하나라도 학과 fieldTags와 일치하면 1점 (중복 부여 없음)
        if (dept.fieldTags && Array.isArray(dept.fieldTags)) {
          var hasMatch = dept.fieldTags.some(function(ft) {
            return selectedFields.indexOf(ft) !== -1;
          });
          qScores.Q1 = hasMatch ? 1 : 0;
        }

        // Q2, Q3, Q4: 선택된 옵션의 departmentIds에 포함되면 1점
        ['Q2', 'Q3', 'Q4'].forEach(function(qId) {
          var selOptIds = answers[qId];
          if (Array.isArray(selOptIds) && selOptIds.length > 0 && commonMap[qId]) {
            var selectedOpt = commonMap[qId].options.find(function(o) { return o.id === selOptIds[0]; });
            if (selectedOpt && selectedOpt.departmentIds && selectedOpt.departmentIds.indexOf(dept.id) !== -1) {
              qScores[qId] = 1;
            }
          }
        });

        // 맞춤 문항 기본 점수 합산 및 tier2 계산
        // tier2[k] = (2 / K) * sum(선택 분야 k번 문항 기본점수)
        var tier2 = { 1: 0, 2: 0, 3: 0 };
        var tierContributions = { 1: [], 2: [], 3: [] }; // 추천 사유용 기록

        for (var k = 1; k <= 3; k++) {
          var rawSum = 0;
          selectedFields.forEach(function(field) {
            var customQId = field + k;
            var selOptIds = answers[customQId];
            if (Array.isArray(selOptIds) && selOptIds.length > 0 && customMap[customQId]) {
              var selectedOpt = customMap[customQId].options.find(function(o) { return o.id === selOptIds[0]; });
              if (selectedOpt && selectedOpt.departmentIds && selectedOpt.departmentIds.indexOf(dept.id) !== -1) {
                rawSum += 1;
                tierContributions[k].push({
                  questionId: customQId,
                  prompt: customMap[customQId].prompt || customMap[customQId].title,
                  optionText: selectedOpt.text
                });
              }
            }
          });

          // tier2[k]는 선택된 분야별 맞춤 질문 점수의 평균값 (소수 포함, 반올림 금지)
          if (K === 0) {
            tier2[k] = 0;
          } else {
            tier2[k] = rawSum / K; // 평균 점수
          }
        }

        // 2배 정수 score2 산출 공식 (기획서 지침)
        // common2 = 2 * (q1 + 2*q2 + 2*q3 + 3*q4)
        var common2 = 2 * (
          (1 * qScores.Q1) +
          (2 * qScores.Q2) +
          (2 * qScores.Q3) + // 가중치 정의: Q1=1, Q2=2, Q3=2, Q4=3
          (3 * qScores.Q4)
        );

        // score2 = common2 + 2*tier2[1] + 3*tier2[2] + 4*tier2[3] (최대 34점)
        var score2 = common2 + (2 * tier2[1]) + (3 * tier2[2]) + (4 * tier2[3]);
        var displayScore = score2 / 2; // 표시용 총점 (최대 17점)

        return {
          id: dept.id,
          name: dept.name,
          college: dept.college,
          isNew: dept.isNew === true,
          nameSortIndex: dept.nameSortIndex || 999,
          schoolSortIndex: dept.schoolSortIndex || 999,
          compare: dept.compare,
          result: dept.result,
          fieldTags: dept.fieldTags,
          qScores: qScores,
          tier2: tier2,
          score2: score2,
          displayScore: displayScore,
          tierContributions: tierContributions
        };
      });

      // 5. 기획서 기준 5단계 동점 처리 정렬
      var useSchoolSort = Boolean(config.useSchoolSortTable);

      scoredList.sort(function(a, b) {
        // 1단계: score2 내림차순
        if (b.score2 !== a.score2) {
          return b.score2 - a.score2;
        }

        // 2단계: 중요 문항 순차 비교 (T3 -> Q4 -> T2 -> T1 -> Q3 -> Q2 -> Q1)
        if (b.tier2[3] !== a.tier2[3]) return b.tier2[3] - a.tier2[3];
        if (b.qScores.Q4 !== a.qScores.Q4) return b.qScores.Q4 - a.qScores.Q4;
        if (b.tier2[2] !== a.tier2[2]) return b.tier2[2] - a.tier2[2];
        if (b.tier2[1] !== a.tier2[1]) return b.tier2[1] - a.tier2[1];
        if (b.qScores.Q3 !== a.qScores.Q3) return b.qScores.Q3 - a.qScores.Q3;
        if (b.qScores.Q2 !== a.qScores.Q2) return b.qScores.Q2 - a.qScores.Q2;
        if (b.qScores.Q1 !== a.qScores.Q1) return b.qScores.Q1 - a.qScores.Q1;

        // 3단계: 신설 학과 우선 (D50, D51, D52 우선)
        if (a.isNew !== b.isNew) {
          return a.isNew ? -1 : 1;
        }

        // 4단계: 가나다순 정렬 (학교 정렬표 모드 지원)
        if (useSchoolSort && a.schoolSortIndex !== b.schoolSortIndex) {
          return a.schoolSortIndex - b.schoolSortIndex;
        }
        if (a.nameSortIndex !== b.nameSortIndex) {
          return a.nameSortIndex - b.nameSortIndex;
        }

        // 5단계: 내부 학과 ID 오름차순 (D01 < D02 ...)
        return a.id.localeCompare(b.id);
      });

      // 6. 양의 점수 검사 및 TOP4 추출
      var positiveCandidates = scoredList.filter(function(d) {
        return d.score2 > 0;
      });

      var hasEnoughCandidates = positiveCandidates.length >= 4;
      var top4 = scoredList.slice(0, 4);

      return {
        rankedList: scoredList,
        top4: top4,
        hasEnoughCandidates: hasEnoughCandidates,
        positiveCount: positiveCandidates.length
      };
    },

    /**
     * 특정 학과에 대한 개인화 추천 이유 텍스트 생성
     * (기획서 6장 원칙: 양의 점수를 준 실제 응답 중 가중 기여도 순으로 최대 2문장 생성, 인구통계 제외)
     * @param {Object} scoredDept - calculateRanking에서 계산된 학과 객체
     * @param {Object} answers - 사용자 응답 객체
     * @returns {string} 1~2문장의 자연스러운 개인화 추천 사유
     */
    generateReason: function(scoredDept, answers) {
      if (!scoredDept) return '';
      var reasons = [];
      var qData = window.SCU_QUESTIONS;
      var commonMap = {};
      if (qData && qData.common) {
        qData.common.forEach(function(q) { commonMap[q.id] = q; });
      }

      // 우선순위 1: T3 맞춤 기여 (가장 높은 가중치 4)
      if (scoredDept.tierContributions && scoredDept.tierContributions[3].length > 0) {
        var t3Item = scoredDept.tierContributions[3][0];
        reasons.push('‘' + t3Item.optionText + '’에 대한 심층적인 학습 희망과 깊이 연결되어 있습니다.');
      }

      // 우선순위 2: Q4 배우고 싶은 내용 (가중치 3)
      if (reasons.length < 2 && scoredDept.qScores && scoredDept.qScores.Q4 === 1 && answers['Q4']) {
        var q4Opt = commonMap['Q4'] ? commonMap['Q4'].options.find(function(o) { return o.id === answers['Q4'][0]; }) : null;
        if (q4Opt) {
          reasons.push('‘' + q4Opt.text + '’을(를) 체계적으로 배우고자 하는 학습 목표에 잘 부합합니다.');
        }
      }

      // 우선순위 3: T2 맞춤 기여 (가중치 3)
      if (reasons.length < 2 && scoredDept.tierContributions && scoredDept.tierContributions[2].length > 0) {
        var t2Item = scoredDept.tierContributions[2][0];
        reasons.push('‘' + t2Item.optionText + '’ 활동에 가장 알맞은 전공 커리큘럼을 갖추고 있습니다.');
      }

      // 우선순위 4: Q2 해보고 싶은 활동 (가중치 2) 또는 Q3 (가중치 2)
      if (reasons.length < 2 && scoredDept.qScores && scoredDept.qScores.Q2 === 1 && answers['Q2']) {
        var q2Opt = commonMap['Q2'] ? commonMap['Q2'].options.find(function(o) { return o.id === answers['Q2'][0]; }) : null;
        if (q2Opt) {
          reasons.push('‘' + q2Opt.text + '’ 활동을 직접 경험해볼 수 있는 풍부한 실습 기회를 제공합니다.');
        }
      }

      // 보조 기본 문장 (기여 문장이 부족할 때)
      if (reasons.length === 0) {
        reasons.push('회원님께서 선택하신 관심 분야와 실천 목표에 가장 적합도가 높은 전공입니다.');
      }

      return reasons.slice(0, 2).join(' ');
    }
  };

  window.SCU_SCORING = SCU_SCORING;
})();
