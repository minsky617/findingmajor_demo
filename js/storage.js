/**
 * 서울사이버대학교 학과찾기 - 상태 저장 및 복구 모듈 (js/storage.js)
 * sessionStorage 지원 및 접근 제한 환경을 위한 인메모리 폴백 구현
 */
(function() {
  var STORAGE_KEY = 'SCU_MAJOR_FINDER_STATE_V1';
  var inMemoryStore = {};

  var isStorageAvailable = (function() {
    try {
      var testKey = '__scu_test__';
      window.sessionStorage.setItem(testKey, '1');
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('[SCU_STORAGE] sessionStorage 사용 불가: 인메모리 저장소로 폴백합니다.', e);
      return false;
    }
  })();

  var storageManager = {
    /**
     * 상태 저장
     * @param {Object} state - 저장할 전체 상태 객체
     */
    saveState: function(state) {
      if (!state) return;
      var configVersion = (window.SCU_CONFIG && window.SCU_CONFIG.configVersion) || '1.0.0';
      var payload = {
        configVersion: configVersion,
        timestamp: Date.now(),
        data: state
      };

      if (isStorageAvailable) {
        try {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
          console.warn('[SCU_STORAGE] sessionStorage 저장 실패, 인메모리에 저장합니다.', e);
          inMemoryStore[STORAGE_KEY] = payload;
        }
      } else {
        inMemoryStore[STORAGE_KEY] = payload;
      }
    },

    /**
     * 상태 복구
     * @returns {Object|null} 복구된 상태 객체 (버전 불일치 시 null)
     */
    loadState: function() {
      var raw = null;
      if (isStorageAvailable) {
        try {
          raw = window.sessionStorage.getItem(STORAGE_KEY);
        } catch (e) {
          console.warn('[SCU_STORAGE] sessionStorage 읽기 실패', e);
        }
      }

      var parsed = null;
      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          console.error('[SCU_STORAGE] JSON 파싱 오류', e);
        }
      } else if (inMemoryStore[STORAGE_KEY]) {
        parsed = inMemoryStore[STORAGE_KEY];
      }

      if (!parsed) return null;

      // configVersion 검사 (버전이 바뀌었으면 캐시된 응답 무효화)
      var currentVersion = (window.SCU_CONFIG && window.SCU_CONFIG.configVersion) || '1.0.0';
      if (parsed.configVersion !== currentVersion) {
        console.info('[SCU_STORAGE] 설정 버전 불일치로 저장된 상태를 초기화합니다:', parsed.configVersion, '->', currentVersion);
        this.clearState();
        return null;
      }

      return parsed.data;
    },

    /**
     * 상태 초기화 (처음부터 다시하기 등)
     */
    clearState: function() {
      if (isStorageAvailable) {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.warn('[SCU_STORAGE] sessionStorage 초기화 실패', e);
        }
      }
      delete inMemoryStore[STORAGE_KEY];
    },

    /**
     * 스토리지 지원 여부 확인
     */
    isSupported: function() {
      return isStorageAvailable;
    }
  };

  window.SCU_STORAGE = storageManager;
})();
