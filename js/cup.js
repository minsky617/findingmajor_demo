/**
 * 서울사이버대학교 학과찾기 - 학과 월드컵 토너먼트 모듈 (js/cup.js)
 * 제1부 5단계: TOP4 토너먼트(4강 1차: 1vs4, 4강 2차: 2vs3, 결승), 점수 비노출, 선택 상태 관리
 */
(function() {
  'use strict';

  var cupState = {
    top4List: [],             // [deptRank1, deptRank2, deptRank3, deptRank4]
    currentRound: 'semi1',    // 'semi1' (4강 1경기) | 'semi2' (4강 2경기) | 'final' (결승)
    semi1WinnerId: null,      // 4강 1경기 승자 학과 ID
    semi2WinnerId: null,      // 4강 2경기 승자 학과 ID
    chosenDepartmentId: null  // 결승 승자 학과 ID (최종 선택 학과)
  };

  var SCU_CUP = {
    /**
     * 월드컵 초기화 및 TOP4 설정
     * @param {Array} top4 - 추천 순위 1~4위 학과 목록
     */
    initCup: function(top4) {
      if (!Array.isArray(top4) || top4.length < 4) {
        console.error('[SCU_CUP] TOP4 학과가 4개 미만입니다:', top4);
        return false;
      }
      cupState.top4List = top4.slice(0, 4);
      cupState.currentRound = 'semi1';
      cupState.semi1WinnerId = null;
      cupState.semi2WinnerId = null;
      cupState.chosenDepartmentId = null;
      return true;
    },

    /**
     * 현재 상태 반환
     */
    getState: function() {
      return cupState;
    },

    /**
     * 복구된 상태 주입
     */
    restoreState: function(savedCupState) {
      if (savedCupState && Array.isArray(savedCupState.top4List) && savedCupState.top4List.length === 4) {
        cupState = savedCupState;
      }
    },

    /**
     * 현재 라운드의 대진 학과 2개(좌, 우) 가져오기
     * 기획서 규칙:
     * - 4강 1경기: 좌(추천 1위) vs 우(추천 4위)
     * - 4강 2경기: 좌(추천 2위) vs 우(추천 3위)
     * - 결승: 좌(4강 1차 승자) vs 우(4강 2차 승자)
     * @returns {Object} { roundName, leftDept, rightDept }
     */
    getCurrentMatch: function() {
      if (cupState.top4List.length < 4) return null;

      var r1 = cupState.top4List[0]; // 추천 1위
      var r2 = cupState.top4List[1]; // 추천 2위
      var r3 = cupState.top4List[2]; // 추천 3위
      var r4 = cupState.top4List[3]; // 추천 4위

      if (cupState.currentRound === 'semi1') {
        return {
          roundKey: 'semi1',
          roundBadge: '4강 1경기',
          roundTitle: '어느 학과가 나의 관심에 더 가까운가요?',
          roundDesc: '두 학과의 주요 학습 내용과 자격을 살펴보고, 더 마음이 가는 학과를 선택해 주세요.',
          leftDept: r1,
          rightDept: r4
        };
      } else if (cupState.currentRound === 'semi2') {
        return {
          roundKey: 'semi2',
          roundBadge: '4강 2경기',
          roundTitle: '어느 학과가 나의 관심에 더 가까운가요?',
          roundDesc: '두 학과의 주요 학습 내용과 자격을 살펴보고, 더 마음이 가는 학과를 선택해 주세요.',
          leftDept: r2,
          rightDept: r3
        };
      } else if (cupState.currentRound === 'final') {
        var leftWinner = cupState.top4List.find(function(d) { return d.id === cupState.semi1WinnerId; }) || r1;
        var rightWinner = cupState.top4List.find(function(d) { return d.id === cupState.semi2WinnerId; }) || r2;
        return {
          roundKey: 'final',
          roundBadge: '결승 매치',
          roundTitle: '나를 위한 최고의 학과는 어느 곳인가요?',
          roundDesc: '4강을 거쳐 올라온 두 전공 중 가장 도전해보고 싶은 학과를 최종 선택해 주세요.',
          leftDept: leftWinner,
          rightDept: rightWinner
        };
      }

      return null;
    },

    /**
     * 학과 선택 처리
     * @param {string} selectedDeptId - 선택된 학과 ID
     * @returns {string} 다음 전환할 화면 ID 또는 라운드 ('nextMatch' | 'toResult')
     */
    selectDepartment: function(selectedDeptId) {
      if (cupState.currentRound === 'semi1') {
        cupState.semi1WinnerId = selectedDeptId;
        // 4강 선택이 바뀌면 결승 선택은 무효화 (기획서 지침)
        cupState.chosenDepartmentId = null;
        cupState.currentRound = 'semi2';
        return 'nextMatch';
      } else if (cupState.currentRound === 'semi2') {
        cupState.semi2WinnerId = selectedDeptId;
        // 4강 선택이 바뀌면 결승 선택은 무효화 (기획서 지침)
        cupState.chosenDepartmentId = null;
        cupState.currentRound = 'final';
        return 'nextMatch';
      } else if (cupState.currentRound === 'final') {
        cupState.chosenDepartmentId = selectedDeptId;
        console.info('[SCU_CUP] 결승 완료! 사용자의 최종 선택 학과:', selectedDeptId);
        return 'toResult';
      }
      return 'nextMatch';
    },

    /**
     * 이전 매치로 되돌아가기
     */
    goPreviousMatch: function() {
      if (cupState.currentRound === 'final') {
        cupState.currentRound = 'semi2';
        cupState.chosenDepartmentId = null;
        return 'semi2';
      } else if (cupState.currentRound === 'semi2') {
        cupState.currentRound = 'semi1';
        cupState.semi2WinnerId = null;
        cupState.chosenDepartmentId = null;
        return 'semi1';
      } else if (cupState.currentRound === 'semi1') {
        // TOP4 안내 화면으로 복귀
        return 'toTop4';
      }
      return 'toTop4';
    },

    /**
     * 월드컵 결과 조회
     * @returns {Object} { chosenDepartmentId, rank1DeptId, semi1WinnerId, semi2WinnerId }
     */
    getResult: function() {
      return {
        chosenDepartmentId: cupState.chosenDepartmentId,
        rank1DeptId: cupState.top4List[0] ? cupState.top4List[0].id : null,
        top4List: cupState.top4List
      };
    }
  };

  window.SCU_CUP = SCU_CUP;
})();
