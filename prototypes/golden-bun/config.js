// PROTOTYPE - NOT FOR PRODUCTION
// Question: 파트너 크루와 함께 피크타임을 넘기는 영업 루프가 3일 동안 재미있는가?
// Date: 2026-11-25
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.5, min: 0, max: 1, step: 0.05 },

  // ---- 한 주와 하루 (초) ----
  weekDays: { value: 5, min: 3, max: 7, step: 1 },           // 한 주의 근무일
  dayLen: { value: 150, min: 60, max: 300, step: 5 },        // 1일차 근무 길이
  dayLenGrow: { value: 6, min: 0, max: 60, step: 1 },        // 그 주 안에서 하루마다 늘어나는 길이
  peak1Start: { value: 50, min: 20, max: 120, step: 5 },     // 첫 피크타임 시작
  peak2Start: { value: 100, min: 60, max: 240, step: 5 },    // 두 번째 피크타임 시작
  peakLen: { value: 24, min: 10, max: 60, step: 2 },         // 1일차 피크 길이
  peakLenGrow: { value: 3, min: 0, max: 20, step: 1 },       // 그 주 안에서 하루마다 늘어나는 피크 길이
  clockRate: { value: 2, min: 0.5, max: 6, step: 0.5 },      // 현실 1초에 흐르는 매장 시계 (분)

  // ---- 메뉴가 열리는 날 (첫 출근부터 센 일수) ----
  dayCone: { value: 2, min: 1, max: 30, step: 1 },           // 아이스크림 콘
  dayDouble: { value: 4, min: 1, max: 30, step: 1 },         // 더블치즈번, 치즈, 케첩
  dayDelivery: { value: 3, min: 1, max: 30, step: 1 },       // 배달 주문 (라이더와 근무하면 첫날부터)
  seasonWeek: { value: 2, min: 1, max: 20, step: 1 },         // 시즌 메뉴가 시작되는 주
  dayCustom: { value: 5, min: 1, max: 30, step: 1 },         // '피클 빼기' 주문
  recipeHintDays: { value: 5, min: 0, max: 30, step: 1 },    // 이 날까지는 조립대에 레시피가 계속 보인다
  recipePeek: { value: 2.5, min: 0.5, max: 8, step: 0.5 },   // 그 뒤 '레시피 보기'를 누르면 보이는 시간 (초)

  // ---- 손님 ----
  spawnCalm: { value: 8.5, min: 3, max: 20, step: 0.5 },     // 한산할 때 손님 간격 (초)
  spawnPeak: { value: 4.0, min: 1.5, max: 10, step: 0.1 },   // 피크타임 손님 간격 (초)
  weekSpawnMul: { value: 0.95, min: 0.7, max: 1, step: 0.01 },// 한 주 지날 때마다 손님 간격에 곱하는 값
  weekSpawnFloor: { value: 0.6, min: 0.3, max: 1, step: 0.05 },// 손님 간격이 줄어드는 한계 (비율)
  patienceCalm: { value: 42, min: 10, max: 80, step: 1 },    // 한산할 때 인내심 (초)
  patiencePeak: { value: 34, min: 10, max: 80, step: 1 },    // 피크타임 인내심 (초)
  patienceDayDrop: { value: 0.5, min: 0, max: 8, step: 0.1 },// 그 주 안에서 하루마다 줄어드는 인내심 (초)
  patienceWeekDrop: { value: 1, min: 0, max: 8, step: 0.5 },// 한 주 지날 때마다 줄어드는 인내심 (초)
  patienceMin: { value: 20, min: 6, max: 40, step: 1 },      // 인내심의 최저 (초)
  fastFrac: { value: 0.4, min: 0.1, max: 0.9, step: 0.05 },  // 인내심이 이만큼 남았으면 '빠른 제공'
  slowQuality: { value: 0.75, min: 0.3, max: 1, step: 0.05 },// 느린 제공의 평가 비율
  gagChance: { value: 0.3, min: 0, max: 1, step: 0.05 },     // 콘 주문이 초코콘 손님일 확률
  bitChance: { value: 0.22, min: 0, max: 1, step: 0.02 },    // 손님이 한마디 던질 확률
  thanksChance: { value: 0.45, min: 0, max: 1, step: 0.05 }, // 받아 간 손님이 한마디 남길 확률
  potatoChance: { value: 0.07, min: 0, max: 0.5, step: 0.01 },// '감자 닮았다' 손님 확률
  customChance: { value: 0.2, min: 0, max: 1, step: 0.05 },  // 골든번버거 주문이 '피클 빼기'일 확률
  tutorialOrders: { value: 2, min: 0, max: 4, step: 1 },     // 첫날에 손 안내를 해 주는 주문 수
  // 주문 종류의 비중 (클수록 자주)
  wBurger: { value: 4, min: 0, max: 10, step: 1 },           // 골든번버거 단품
  wSet: { value: 4, min: 0, max: 10, step: 1 },              // 세트
  wFries: { value: 2, min: 0, max: 10, step: 1 },            // 감자튀김 단품
  wCone: { value: 3, min: 0, max: 10, step: 1 },             // 아이스크림 콘
  wBurgerCone: { value: 1, min: 0, max: 10, step: 1 },       // 버거 + 콘
  wDouble: { value: 2, min: 0, max: 10, step: 1 },           // 더블치즈번 단품
  wDoubleSet: { value: 2, min: 0, max: 10, step: 1 },        // 더블치즈번 세트
  wSeason: { value: 3, min: 0, max: 10, step: 1 },           // 시즌 메뉴 단품
  wSeasonSet: { value: 2, min: 0, max: 10, step: 1 },        // 시즌 메뉴 세트
  // 배달 (라이더 두 명이 날마다 번갈아 맡는다)
  riderPayMul: { value: 1.3, min: 1, max: 3, step: 0.1 },    // 대헌이 맡은 날의 배달비 배율
  riderPatienceMul: { value: 1.3, min: 1, max: 3, step: 0.1 },// 태범이 맡은 날의 배달 인내심 배율
  riderAffPer: { value: 2, min: 1, max: 10, step: 1 },       // 배달 이만큼마다 그날 라이더 호감도 +1
  riderAffMax: { value: 3, min: 0, max: 10, step: 1 },       // 하루에 배달로 오르는 라이더 호감도 한계
  deliveryRate: { value: 0.12, min: 0, max: 0.8, step: 0.02 },// 주문이 배달일 확률
  deliveryPatience: { value: 1.4, min: 1, max: 3, step: 0.1 },// 배달 주문의 인내심 배율
  deliveryFee: { value: 1500, min: 0, max: 5000, step: 100 }, // 배달 1건의 추가 매출 (원)

  // ---- 구역 ----
  grillTime: { value: 3.5, min: 1, max: 10, step: 0.5 },     // 패티 굽는 시간 (초)
  grillBatch: { value: 2, min: 1, max: 4, step: 1 },         // 한 번에 굽는 패티 수
  pattyMax: { value: 6, min: 2, max: 12, step: 1 },          // 보관 가능한 패티
  pattyStart: { value: 2, min: 0, max: 6, step: 1 },         // 근무 시작 때 패티
  fryTime: { value: 6, min: 2, max: 15, step: 0.5 },         // 감자 튀기는 시간 (초)
  fryBurn: { value: 10, min: 2, max: 20, step: 0.5 },         // 다 튀겨진 뒤 타기까지 (초)
  fryPerfect: { value: 2.5, min: 0.5, max: 8, step: 0.5 },   // 다 튀겨진 뒤 이 안에 건지면 완벽 (초)
  fryBatch: { value: 3, min: 1, max: 6, step: 1 },           // 한 바구니 분량
  friesMax: { value: 6, min: 2, max: 12, step: 1 },          // 보관 가능한 감자튀김
  drinkTime: { value: 2, min: 0.5, max: 6, step: 0.5 },      // 음료 따르는 시간 (초)
  drinkMax: { value: 3, min: 1, max: 6, step: 1 },           // 보관 가능한 음료
  partnerTask: { value: 2.4, min: 1, max: 8, step: 0.2 },    // 파트너가 한 가지 일을 끝내는 시간 (초)
  // 파트너 도움 게이지: 차면 파트너를 터치해 가장 급한 주문의 메뉴를 받는다
  helpCharge: { value: 18, min: 5, max: 60, step: 1 },       // 게이지가 다 차는 시간 (초)
  helpRelBonus: { value: 0.15, min: 0, max: 0.5, step: 0.05 },// 관계 단계마다 빨라지는 비율
  helpPeakMul: { value: 1.3, min: 1, max: 3, step: 0.1 },    // 피크타임에 빨라지는 배율
  helpItems: { value: 2, min: 1, max: 4, step: 1 },          // 한 번에 만들어 주는 메뉴 수 (친근함부터 +1)
  helpPatience: { value: 10, min: 0, max: 30, step: 1 },     // 도와준 주문의 손님이 더 기다려 주는 시간 (초)
  helpAuto: { value: 0.3, min: 0, max: 0.8, step: 0.05 },    // 손님 인내심이 이 비율 아래면 파트너가 알아서 돕는다
  autoDelay: { value: 0.8, min: 0.2, max: 3, step: 0.1 },    // 파트너가 준비된 주문을 대신 내주기까지 (초)
  stackMax: { value: 7, min: 4, max: 10, step: 1 },          // 버거에 쌓을 수 있는 재료 수 (윗번 제외)

  // ---- 아이스크림 콘 (3단 쌓기) ----
  coneSpeed: { value: 0.6, min: 0.3, max: 2, step: 0.05 },  // 노즐이 1초에 왕복하는 횟수
  coneTierUp: { value: 0.2, min: 0, max: 1, step: 0.05 },    // 한 단 쌓을 때마다 빨라지는 비율
  coneWeekUp: { value: 0.08, min: 0, max: 0.5, step: 0.01 }, // 한 주 지날 때마다 빨라지는 비율
  coneSpeedCap: { value: 1.8, min: 0.5, max: 4, step: 0.1 }, // 노즐 속도 한계 (왕복/초)
  coneAmp: { value: 150, min: 60, max: 220, step: 10 },      // 노즐이 움직이는 폭 (px)
  conePerfect: { value: 22, min: 4, max: 60, step: 2 },      // 완벽 판정 폭 (px)
  coneOk: { value: 68, min: 20, max: 120, step: 2 },         // 성공 판정 폭 (px), 벗어나면 떨어진다
  coneMax: { value: 2, min: 1, max: 4, step: 1 },            // 보관 가능한 콘

  // ---- 돈 (원) ----
  priceBurger: { value: 5500, min: 1000, max: 15000, step: 100 },
  priceDouble: { value: 7500, min: 1000, max: 15000, step: 100 },
  priceFries: { value: 2500, min: 500, max: 8000, step: 100 },
  priceDrink: { value: 2000, min: 500, max: 8000, step: 100 },
  priceSeason: { value: 6900, min: 1000, max: 15000, step: 100 },
  priceCone: { value: 1000, min: 500, max: 5000, step: 100 },
  setDiscount: { value: 1500, min: 0, max: 5000, step: 100 }, // 세트 할인
  tipFast: { value: 500, min: 0, max: 3000, step: 100 },      // 빠른 제공 팁
  tipFries: { value: 300, min: 0, max: 2000, step: 100 },     // 완벽하게 건진 감자튀김 팁
  tipCone: { value: 300, min: 0, max: 2000, step: 100 },      // 완벽한 콘 팁
  wasteCost: { value: 800, min: 0, max: 5000, step: 100 },    // 폐기 1건 비용

  // ---- 근무평가 (100점 만점) ----
  gradeS: { value: 92, min: 50, max: 100, step: 1 },
  gradeA: { value: 80, min: 40, max: 100, step: 1 },
  gradeB: { value: 65, min: 30, max: 100, step: 1 },
  gradeC: { value: 50, min: 10, max: 100, step: 1 },
  perfectPts: { value: 1.5, min: 0, max: 5, step: 0.5 },      // 완벽한 감자튀김·콘 한 번의 가산점
  wastePenalty: { value: 1.5, min: 0, max: 10, step: 0.5 },   // 폐기 1건당 감점

  // ---- 체력 ----
  staminaStart: { value: 5, min: 1, max: 5, step: 1 },        // 월요일 체력 (주말에 다 회복)
  staminaDayCost: { value: 2, min: 0, max: 5, step: 1 },      // 하루 근무로 닳는 체력
  staminaSleep: { value: 1, min: 0, max: 5, step: 1 },        // 자고 나면 회복
  staminaLow: { value: 2, min: 0, max: 5, step: 1 },          // 이 이하면 손이 느려짐
  tiredSlow: { value: 1.15, min: 1, max: 2, step: 0.05 },     // 지쳤을 때 조리 시간 배율

  // ---- 호감도 ----
  affWork: { value: 2, min: 0, max: 10, step: 1 },            // 같이 근무하면
  affS: { value: 3, min: 0, max: 10, step: 1 },               // 평가 S 보너스
  affA: { value: 2, min: 0, max: 10, step: 1 },
  affB: { value: 1, min: 0, max: 10, step: 1 },
  affDaily: { value: 1, min: 0, max: 5, step: 1 },            // 일상 장면 한 번
  // 근무 중 잡담과 퇴근 후 약속
  chatAt: { value: 80, min: 10, max: 200, step: 5 },          // 파트너가 말을 거는 시각 (근무 시작 뒤 초, 한산할 때만)
  chatTime: { value: 12, min: 4, max: 30, step: 1 },          // 대답을 기다려 주는 시간 (초)
  affDate: { value: 3, min: 0, max: 10, step: 1 },            // 처음 가 본 약속 한 번
  affDateAgain: { value: 1, min: 0, max: 10, step: 1 },       // 이미 가 본 약속 한 번
  dateChance: { value: 0.4, min: 0, max: 1, step: 0.05 },     // 신뢰 이상인 크루가 퇴근 후 먼저 청할 확률
  dateStaMeal: { value: 1, min: -3, max: 3, step: 1 },        // 같이 밥을 먹으면 체력
  dateStaDrink: { value: -1, min: -3, max: 3, step: 1 },      // 술을 마시면 체력
  rel1: { value: 8, min: 1, max: 50, step: 1 },               // 신뢰
  rel2: { value: 20, min: 2, max: 80, step: 1 },              // 친근함
  rel3: { value: 36, min: 3, max: 150, step: 1 },             // 호감

  // ---- 읽기 ----
  typeSpeed: { value: 48, min: 10, max: 200, step: 2 },       // 글자가 나타나는 속도 (자/초)
};

// 스탠딩과 CG 이미지 슬롯. 파일을 assets/crew/ 에 넣고 여기에 경로를 적으면 그려 둔 임시 그림 대신 표시된다.
// 권장: 가로 3:2 (예: 1216x832), 배경은 흰색 또는 투명. 표정 키: neutral, smile, shy, surprised.
// 표정 키는 neutral, smile, shy, surprised, flustered, happy, work, annoyed, angry, tears, scorn 까지 쓸 수 있고, 없는 표정은 가까운 표정이나 neutral 로 대신한다.
// 배경을 지운 스탠딩은 face 에 얼굴 위치 [가운데 x, 가운데 y, 크기] (0~1) 를 적으면 작은 칸에서 얼굴을 당겨 보여 준다.
// (이전 설명) 표정 파일이 없으면 neutral 을 쓴다. 예) seongdo: { neutral: 'assets/crew/seongdo.webp', smile: 'assets/crew/seongdo_smile.webp' }
window.ART = {
  crew: {
    seongdo: {},
    minjun: {},
    gwangsik: {},
    gwancheol: {},
    daeheon: {},
    taebeom: {},
  },
  face: {},
  chibi: {},
  // 음식, 재료, 손님 그림을 직접 만든 일러스트로 바꾸려면 여기에 이름: 경로를 적는다. 비워 두면 게임이 그린 선 그림을 쓴다.
  // 이름: hamburger, french_fries, cup_with_straw, soft_ice_cream, bread, cut_of_meat, cheese_wedge, cucumber, honey_pot, tomato, wastebasket, takeout_box
  img: {},
  // 장면 배경
  bg: {
    alley: 'assets/bg/alley.webp',
    bar: 'assets/bg/bar.webp',
    cafe: 'assets/bg/cafe.webp',
    counter: 'assets/bg/counter.webp',
    crewroom: 'assets/bg/crewroom.webp',
    eaves: 'assets/bg/eaves.webp',
    freezer: 'assets/bg/freezer.webp',
    grill: 'assets/bg/grill.webp',
    hall: 'assets/bg/hall.webp',
    home: 'assets/bg/home.webp',
    street: 'assets/bg/street.webp',
  },
  // 이벤트 CG: 이벤트 id(story.js) -> 파일. 있으면 그 이벤트 동안 스탠딩 자리에 표시된다.
  cg: {},
};
