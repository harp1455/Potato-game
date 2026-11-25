// PROTOTYPE - NOT FOR PRODUCTION
// Question: 파트너 크루와 함께 피크타임을 넘기는 영업 루프가 3일 동안 재미있는가?
// Date: 2026-11-25
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.5, min: 0, max: 1, step: 0.05 },

  // ---- 하루의 길이와 피크타임 (초) ----
  dayLen: { value: 150, min: 60, max: 300, step: 5 },        // 1일차 근무 길이
  dayLenGrow: { value: 10, min: 0, max: 60, step: 5 },       // 하루 지날 때마다 늘어나는 길이
  peak1Start: { value: 55, min: 20, max: 120, step: 5 },     // 첫 피크타임 시작
  peak2Start: { value: 105, min: 60, max: 240, step: 5 },    // 두 번째 피크타임 시작
  peakLen: { value: 24, min: 10, max: 60, step: 2 },         // 1일차 피크 길이
  peakLenGrow: { value: 6, min: 0, max: 20, step: 1 },       // 하루 지날 때마다 늘어나는 피크 길이

  // ---- 손님 ----
  spawnCalm: { value: 9, min: 3, max: 20, step: 0.5 },       // 한산할 때 손님 간격 (초)
  spawnPeak: { value: 3.6, min: 1.5, max: 10, step: 0.1 },   // 피크타임 손님 간격 (초)
  patienceCalm: { value: 36, min: 10, max: 80, step: 1 },    // 한산할 때 인내심 (초)
  patiencePeak: { value: 28, min: 10, max: 80, step: 1 },    // 피크타임 인내심 (초)
  patienceDayDrop: { value: 2, min: 0, max: 8, step: 0.5 },  // 하루 지날 때마다 줄어드는 인내심 (초)
  fastFrac: { value: 0.4, min: 0.1, max: 0.9, step: 0.05 },  // 인내심이 이만큼 남았으면 '빠른 제공'
  slowQuality: { value: 0.75, min: 0.3, max: 1, step: 0.05 },// 느린 제공의 평가 비율
  gagChance: { value: 0.3, min: 0, max: 1, step: 0.05 },     // 콘 주문이 초코콘 손님일 확률
  potatoChance: { value: 0.08, min: 0, max: 0.5, step: 0.01 },// '감자 닮았다' 손님 확률
  tutorialOrders: { value: 2, min: 0, max: 4, step: 1 },     // 1일차에 손 안내를 해 주는 주문 수
  // 주문 종류의 비중 (클수록 자주). 콘은 2일차부터, 더블치즈번은 3일차부터 나온다.
  wBurger: { value: 4, min: 0, max: 10, step: 1 },           // 골든번버거 단품
  wSet: { value: 4, min: 0, max: 10, step: 1 },              // 세트
  wFries: { value: 2, min: 0, max: 10, step: 1 },            // 감자튀김 단품
  wCone: { value: 3, min: 0, max: 10, step: 1 },             // 아이스크림 콘
  wBurgerCone: { value: 1, min: 0, max: 10, step: 1 },       // 버거 + 콘
  wDouble: { value: 2, min: 0, max: 10, step: 1 },           // 더블치즈번 단품
  wDoubleSet: { value: 2, min: 0, max: 10, step: 1 },        // 더블치즈번 세트
  clockRate: { value: 2, min: 0.5, max: 6, step: 0.5 },      // 현실 1초에 흐르는 매장 시계 (분)

  // ---- 구역 ----
  grillTime: { value: 3.5, min: 1, max: 10, step: 0.5 },     // 패티 굽는 시간 (초)
  grillBatch: { value: 2, min: 1, max: 4, step: 1 },         // 한 번에 굽는 패티 수
  pattyMax: { value: 6, min: 2, max: 12, step: 1 },          // 보관 가능한 패티
  pattyStart: { value: 2, min: 0, max: 6, step: 1 },         // 근무 시작 때 패티
  fryTime: { value: 6, min: 2, max: 15, step: 0.5 },         // 감자 튀기는 시간 (초)
  fryBurn: { value: 7, min: 2, max: 20, step: 0.5 },         // 다 튀겨진 뒤 타기까지 (초)
  fryBatch: { value: 3, min: 1, max: 6, step: 1 },           // 한 바구니 분량
  friesMax: { value: 6, min: 2, max: 12, step: 1 },          // 보관 가능한 감자튀김
  drinkTime: { value: 2, min: 0.5, max: 6, step: 0.5 },      // 음료 따르는 시간 (초)
  drinkMax: { value: 3, min: 1, max: 6, step: 1 },           // 보관 가능한 음료
  coneTime: { value: 1.6, min: 0.8, max: 4, step: 0.1 },     // 콘 게이지가 다 차는 시간 (초)
  coneLo: { value: 0.55, min: 0.2, max: 0.8, step: 0.05 },   // 완벽한 콘 구간 시작 (비율)
  coneHi: { value: 0.9, min: 0.6, max: 1, step: 0.05 },      // 완벽한 콘 구간 끝 (비율)
  coneMax: { value: 2, min: 1, max: 4, step: 1 },            // 보관 가능한 콘
  partnerTask: { value: 3.2, min: 1, max: 8, step: 0.2 },    // 파트너가 한 가지 일을 끝내는 시간 (초)

  // ---- 돈 (원) ----
  priceBurger: { value: 5500, min: 1000, max: 15000, step: 100 },
  priceDouble: { value: 7500, min: 1000, max: 15000, step: 100 },
  priceFries: { value: 2500, min: 500, max: 8000, step: 100 },
  priceDrink: { value: 2000, min: 500, max: 8000, step: 100 },
  priceCone: { value: 1000, min: 500, max: 5000, step: 100 },
  setDiscount: { value: 1500, min: 0, max: 5000, step: 100 }, // 세트 할인
  tipFast: { value: 500, min: 0, max: 3000, step: 100 },      // 빠른 제공 팁
  tipCone: { value: 200, min: 0, max: 2000, step: 100 },      // 완벽한 콘 팁
  wasteCost: { value: 800, min: 0, max: 5000, step: 100 },    // 폐기 1건 비용

  // ---- 근무평가 ⭐ (100점 만점) ----
  gradeS: { value: 92, min: 50, max: 100, step: 1 },
  gradeA: { value: 80, min: 40, max: 100, step: 1 },
  gradeB: { value: 65, min: 30, max: 100, step: 1 },
  gradeC: { value: 50, min: 10, max: 100, step: 1 },
  wastePenalty: { value: 1.5, min: 0, max: 10, step: 0.5 },   // 폐기 1건당 감점

  // ---- 체력 💪 ----
  staminaStart: { value: 5, min: 1, max: 5, step: 1 },
  staminaDayCost: { value: 2, min: 0, max: 5, step: 1 },      // 하루 근무로 닳는 체력
  staminaSleep: { value: 1, min: 0, max: 5, step: 1 },        // 자고 나면 회복
  staminaLow: { value: 2, min: 0, max: 5, step: 1 },          // 이 이하면 손이 느려짐
  tiredSlow: { value: 1.15, min: 1, max: 2, step: 0.05 },     // 지쳤을 때 조리 시간 배율

  // ---- 호감도 ----
  affWork: { value: 2, min: 0, max: 10, step: 1 },            // 같이 근무하면
  affS: { value: 3, min: 0, max: 10, step: 1 },               // 평가 S 보너스
  affA: { value: 2, min: 0, max: 10, step: 1 },
  affB: { value: 1, min: 0, max: 10, step: 1 },
  rel1: { value: 6, min: 1, max: 50, step: 1 },               // 👍 신뢰
  rel2: { value: 12, min: 2, max: 60, step: 1 },              // ☺️ 친근함
  rel3: { value: 19, min: 3, max: 80, step: 1 },              // 😳 호감

  // ---- 읽기 ----
  typeSpeed: { value: 45, min: 10, max: 200, step: 5 },       // 글자가 나타나는 속도 (자/초)
};

// 스탠딩과 CG 이미지 슬롯. 파일을 assets/crew/ 에 넣고 여기에 경로를 적으면 그려 둔 임시 그림 대신 표시된다.
// 권장: 가로 3:2 (예: 1216x832), 배경은 흰색 또는 투명. 표정 키: neutral, smile, shy, surprised.
// 표정 파일이 없으면 neutral 을 쓴다. 예) seongdo: { neutral: 'assets/crew/seongdo.webp', smile: 'assets/crew/seongdo_smile.webp' }
window.ART = {
  crew: {
    seongdo: {},
    minjun: {},
  },
  // 이벤트 CG: 이벤트 id(story.js) -> 파일. 있으면 그 이벤트 동안 스탠딩 자리에 표시된다.
  cg: {},
};
