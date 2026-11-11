// 맥도날드 키오스크 메뉴 및 미션 데이터 정의 (빅맥 세트 포장 미션)

const KIOSK_CATEGORIES = [
    { id: 'recommend', name: '추천메뉴', icon: '★' },
    { id: 'burger', name: '버거 & 세트', icon: '🍔' },
    { id: 'snack', name: '스낵 & 사이드', icon: '🍟' },
    { id: 'dessert', name: '디저트', icon: '🍦' }, // 기사 핵심 카테고리
    { id: 'beverage', name: '음료 & 커피', icon: '🥤' },
    { id: 'happymeal', name: '해피밀', icon: '🎁' }
];

const KIOSK_MENU_ITEMS = [
    // 디저트 (기사 핵심 카테고리)
    {
        id: 'oreo-mcflurry',
        categoryId: 'dessert',
        name: '오레오 맥플러리',
        englishName: 'Oreo McFlurry',
        price: 3300,
        calories: 348,
        badge: '인기',
        description: '부드러운 바닐라 아이스크림에 바삭한 오레오 쿠키 크럼블이 가득!',
        imageBg: '#e2e8f0',
        iconType: 'mcflurry'
    },
    {
        id: 'strawberry-oreo-mcflurry',
        categoryId: 'dessert',
        name: '딸기 오레오 맥플러리',
        englishName: 'Strawberry Oreo McFlurry',
        price: 3500,
        calories: 362,
        badge: '추천',
        description: '상큼한 딸기 시럽과 바삭한 오레오의 완벽한 조화',
        imageBg: '#ffe4e6',
        iconType: 'mcflurry_berry'
    },
    {
        id: 'choco-oreo-mcflurry',
        categoryId: 'dessert',
        name: '초코 오레오 맥플러리',
        englishName: 'Choco Oreo McFlurry',
        price: 3500,
        calories: 390,
        badge: null,
        description: '진한 초콜릿 소스가 더해진 달콤함의 극치',
        imageBg: '#f5ebe0',
        iconType: 'mcflurry_choco'
    },
    {
        id: 'vanilla-sundae',
        categoryId: 'dessert',
        name: '바닐라 선데이 아이스크림',
        englishName: 'Vanilla Sundae',
        price: 2100,
        calories: 225,
        badge: null,
        description: '신선한 우유로 만든 부드럽고 진한 바닐라 선데이',
        imageBg: '#fef3c7',
        iconType: 'sundae'
    },
    {
        id: 'choco-sundae',
        categoryId: 'dessert',
        name: '초코 선데이 아이스크림',
        englishName: 'Choco Sundae',
        price: 2300,
        calories: 289,
        badge: null,
        description: '달콤한 초콜릿 시럽이 듬뿍 얹어진 선데이',
        imageBg: '#ede8f5',
        iconType: 'sundae_choco'
    },

    // 버거 & 세트 (자유 모드용)
    {
        id: 'big-mac',
        categoryId: 'burger',
        name: '빅맥',
        englishName: 'Big Mac',
        price: 5500,
        calories: 583,
        badge: '시그니처',
        description: '순 쇠고기 패티 2장에 특별한 빅맥 소스와 치즈',
        imageBg: '#fef08a',
        iconType: 'burger_bigmac'
    },
    {
        id: 'shanghai-burger',
        categoryId: 'burger',
        name: '맥스파이시 상하이 버거',
        englishName: 'McSpicy Shanghai Burger',
        price: 5500,
        calories: 494,
        badge: '인기',
        description: '매콤한 시즈닝의 100% 닭가슴 통살 패티',
        imageBg: '#fed7aa',
        iconType: 'burger_chicken'
    },
    {
        id: '1955-burger',
        categoryId: 'burger',
        name: '1955 버거',
        englishName: '1955 Burger',
        price: 6400,
        calories: 572,
        badge: null,
        description: '두툼한 소고기 패티와 그릴드 어니언',
        imageBg: '#e2e8f0',
        iconType: 'burger_beef'
    },
    {
        id: 'bulgogi-burger',
        categoryId: 'burger',
        name: '불고기 버거',
        englishName: 'Bulgogi Burger',
        price: 2800,
        calories: 409,
        badge: '착한가격',
        description: '한국인의 입맛에 꼭 맞춘 불고기 소스',
        imageBg: '#fef3c7',
        iconType: 'burger_beef'
    },

    // 스낵 & 사이드
    {
        id: 'french-fries',
        categoryId: 'snack',
        name: '후렌치 후라이',
        englishName: 'French Fries',
        price: 2000,
        calories: 324,
        badge: '베스트',
        description: '노릇노릇 바삭하고 고소한 대표 감자튀김',
        imageBg: '#fef08a',
        iconType: 'fries'
    },
    {
        id: 'mcnuggets-6',
        categoryId: 'snack',
        name: '맥너겟 6조각',
        englishName: 'McNuggets 6pcs',
        price: 3800,
        calories: 270,
        badge: null,
        description: '바삭한 튀김옷과 부드러운 닭고기살',
        imageBg: '#fed7aa',
        iconType: 'nuggets'
    },
    {
        id: 'cheese-sticks',
        categoryId: 'snack',
        name: '골든 모짜렐라 치즈스틱',
        englishName: 'Golden Mozzarella Cheese Sticks',
        price: 2600,
        calories: 164,
        badge: null,
        description: '자연 모짜렐라 치즈의 쫄깃한 풍미',
        imageBg: '#fef3c7',
        iconType: 'cheesestick'
    },

    // 음료 & 커피
    {
        id: 'coca-cola',
        categoryId: 'beverage',
        name: '코카-콜라',
        englishName: 'Coca-Cola (M)',
        price: 1900,
        calories: 143,
        badge: null,
        description: '청량감 넘치는 클래식 코카-콜라',
        imageBg: '#fee2e2',
        iconType: 'cola'
    },
    {
        id: 'coca-cola-zero',
        categoryId: 'beverage',
        name: '코카-콜라 제로',
        englishName: 'Coca-Cola Zero (M)',
        price: 1900,
        calories: 0,
        badge: '0 Kcal',
        description: '부담 없는 제로 칼로리 탄산음료',
        imageBg: '#e2e8f0',
        iconType: 'cola_zero'
    },
    {
        id: 'vanilla-shake',
        categoryId: 'beverage',
        name: '바닐라 쉐이크',
        englishName: 'Vanilla Shake',
        price: 2800,
        calories: 340,
        badge: null,
        description: '달콤하고 부드러운 바닐라 쉐이크',
        imageBg: '#fef3c7',
        iconType: 'shake'
    },

    // 추천메뉴 카테고리 (빅맥은 추천에서 제거 -> 사용자가 직접 '버거 & 세트' 탭에 들어가서 찾도록 유도)
    {
        id: 'rec-shanghai',
        categoryId: 'recommend',
        name: '맥스파이시 상하이 버거',
        englishName: 'McSpicy Shanghai Burger',
        price: 5500,
        calories: 494,
        badge: '인기추천',
        description: '매콤한 시즈닝의 100% 닭가슴살',
        imageBg: '#fed7aa',
        iconType: 'burger_chicken',
        targetId: 'shanghai-burger'
    },
    {
        id: 'rec-mcflurry',
        categoryId: 'recommend',
        name: '오레오 맥플러리',
        englishName: 'Oreo McFlurry',
        price: 3300,
        calories: 348,
        badge: '디저트',
        description: '바닐라 아이스크림과 바삭한 오레오',
        imageBg: '#e2e8f0',
        iconType: 'mcflurry',
        targetId: 'oreo-mcflurry'
    },
    {
        id: 'rec-fries',
        categoryId: 'recommend',
        name: '후렌치 후라이',
        englishName: 'French Fries',
        price: 2000,
        calories: 324,
        badge: '사이드',
        description: '바삭하고 고소한 대표 감자튀김',
        imageBg: '#fef08a',
        iconType: 'fries',
        targetId: 'french-fries'
    }
];

// 초간결 텍스트 + 버튼 옆 인라인 원포인트 태그가 포함된 미션 정의
// 미션 목표: 빅맥 세트 (M사이즈) 1개 [포장(테이크 아웃)] 신용카드 주문
const MISSION_SCENARIO = {
    title: "빅맥 세트 1개 포장 주문하기",
    targetItemId: 'big-mac',        // 장바구니 유효성 검사 기준 ID
    targetCategory: 'burger',
    eatType: 'take-out',
    steps: [
        {
            stepId: 1,
            title: "주문 시작",
            description: "화면 우측 하단 [주문하기] 터치",
            badgeText: "👉 주문하기 터치!",
            targetSelector: "#btn-start-order",
            badgePosition: "top-center"
        },
        {
            stepId: 2,
            title: "식사 장소",
            description: "오른쪽 [테이크 아웃 (포장)] 터치",
            badgeText: "👉 포장 주문 터치!",
            targetSelector: "#btn-take-out",
            badgePosition: "top-center"
        },
        {
            stepId: 3,
            title: "카테고리 이동",
            description: "왼쪽 [버거 & 세트] 탭 터치",
            badgeText: "👉 버거 & 세트 터치!",
            targetSelector: ".cat-item[data-cat='burger']",
            badgePosition: "right-side"
        },
        {
            stepId: 4,
            title: "버거 선택",
            description: "화면에서 [빅맥] 메뉴 카드 터치",
            badgeText: "👉 빅맥 터치!",
            targetSelector: ".menu-card[data-id='big-mac']",
            badgePosition: "top-center"
        },
        {
            stepId: 5,
            title: "세트 주문",
            description: "큰 카드 중 [세트로 주문] 터치",
            badgeText: "👉 세트로 주문 터치!",
            targetSelector: "#btn-set-option",
            badgePosition: "top-center"
        },
        {
            stepId: 6,
            title: "사이즈 선택",
            description: "[M사이즈 (기본)] 터치",
            badgeText: "👉 M사이즈 터치!",
            targetSelector: "#btn-size-m",
            badgePosition: "top-center"
        },
        {
            stepId: 7,
            title: "음료 선택",
            description: "음료 확인 후 [이 음료로 담기] 터치",
            badgeText: "👉 음료 담기 터치!",
            targetSelector: "#btn-drink-confirm",
            badgePosition: "top-center"
        },
        {
            stepId: 8,
            title: "장바구니 확인",
            description: "맨 아래 [주문내역 확인 후 결제하기] 터치",
            badgeText: "👉 결제하기 터치!",
            targetSelector: "#btn-cart-checkout",
            badgePosition: "top-right"
        },
        {
            stepId: 9,
            title: "주문 확인",
            description: "내역 확인 후 [주문 완료 (결제)] 터치",
            badgeText: "👉 주문완료 터치!",
            targetSelector: "#btn-order-confirm",
            badgePosition: "top-center"
        },
        {
            stepId: 10,
            title: "결제수단 선택",
            description: "[신용 / 체크카드] 터치",
            badgeText: "👉 신용카드 터치!",
            targetSelector: "#btn-pay-card",
            badgePosition: "top-right"
        },
        {
            stepId: 11,
            title: "카드 투입",
            description: "기기 아래 [IC CARD 삽입구] 터치",
            badgeText: "👉 카드 투입구 터치!",
            targetSelector: "#kiosk-card-slot",
            badgePosition: "top-center"
        },
        {
            stepId: 12,
            title: "카드 뽑기",
            description: "꽂혀있는 카드를 직접 터치해 쏙 뽑기",
            badgeText: "👉 꽂힌 카드 터치!",
            targetSelector: "#inserted-card-visual",
            badgePosition: "top-center"
        },
        {
            stepId: 13,
            title: "주문 완료!",
            description: "영수증 확인 후 [처음으로 돌아가기] 터치",
            badgeText: "👉 처음으로 터치!",
            targetSelector: "#btn-restart-mission",
            badgePosition: "top-center"
        }
    ]
};
