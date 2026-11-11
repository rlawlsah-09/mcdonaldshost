// ========================================================
// 맥도날드 키오스크 연습 서비스 애플리케이션 로직
// 미션: 빅맥 세트 (M사이즈) 1개 매장 식사 신용카드 주문
// ========================================================

class KioskApp {
    constructor() {
        this.currentMode = 'mission'; // 'mission' | 'free'
        this.guideEnabled = true;
        this.currentStep = 1;
        this.totalSteps = MISSION_SCENARIO.steps.length; // 13
        this.currentViewName = 'start';
        this.diningOption = 'eat-in';
        this.currentCategory = 'recommend';
        this.cart = [];
        this.selectedItemForModal = null;
        this.modalQty = 1;
        this.orderNumber = 502;
        this.cardState = 'out'; // 'out' | 'inserted' | 'must_remove'
        this.toastTimer = null;

        // 빅맥 세트 선택 상태
        this.pendingSetItem = null;    // 빅맥 아이템 임시 저장
        this.selectedDrink = 'cola';   // 기본 음료: 코카콜라
        this.isBigMacSet = false;      // 세트로 담겼는지 여부

        this.dom = {};
        this.initDOM();
        this.initEvents();
        this.renderCategories();
        this.renderMenuItems(this.currentCategory);
        this.updateCartUI();

        // 🌟 첫 진입 시: 시작화면 준비 후 모드 선택 창 띄우기!
        this.switchView('start');
        this.showWelcomeModal();
    }

    initDOM() {
        // 웰컴 모드 선택 오버레이
        this.dom.welcomeOverlay = document.getElementById('welcome-overlay');
        this.dom.welcomeBtnMission = document.getElementById('welcome-btn-mission');
        this.dom.welcomeBtnFree = document.getElementById('welcome-btn-free');
        this.dom.btnOpenModeSelect = document.getElementById('btn-open-mode-select');
        this.dom.currentModeTag = document.getElementById('current-mode-tag');

        // 미션 시작 목표 카드 팝업
        this.dom.missionIntroOverlay = document.getElementById('mission-intro-overlay');
        this.dom.btnStartMissionIntro = document.getElementById('btn-start-mission-intro');

        // 상단 컨트롤 바
        this.dom.toggleGuide = document.getElementById('toggle-guide');
        this.dom.btnToggleSound = document.getElementById('btn-toggle-sound');
        this.dom.soundIcon = document.getElementById('sound-icon');
        this.dom.btnResetAll = document.getElementById('btn-reset-all');
        this.dom.missionStatusBar = document.getElementById('mission-status-bar');
        this.dom.missionStepBadge = document.getElementById('mission-step-badge');
        this.dom.missionGuideTitle = document.getElementById('mission-guide-title');
        this.dom.missionGuideText = document.getElementById('mission-guide-text');
        this.dom.missionWrongWarning = document.getElementById('mission-wrong-warning');

        // 토스트 알림창
        this.dom.kioskToast = document.getElementById('kiosk-toast');
        this.dom.toastIcon = document.getElementById('toast-icon');
        this.dom.toastText = document.getElementById('toast-text');

        // 키오스크 디스플레이 뷰
        this.dom.kioskScreen = document.getElementById('kiosk-screen');
        this.dom.views = {
            start: document.getElementById('view-start'),
            dining: document.getElementById('view-dining-option'),
            menu: document.getElementById('view-menu'),
            review: document.getElementById('view-order-review'),
            payment: document.getElementById('view-payment-method'),
            processing: document.getElementById('view-card-processing'),
            success: document.getElementById('view-order-success')
        };

        // 화면 1 요소
        this.dom.startHeroAd = document.getElementById('start-hero-ad');
        this.dom.btnStartOrder = document.getElementById('btn-start-order');

        // 화면 2 요소
        this.dom.btnEatIn = document.getElementById('btn-eat-in');
        this.dom.btnTakeOut = document.getElementById('btn-take-out');

        // 화면 3 요소
        this.dom.currentDiningBadge = document.getElementById('current-dining-badge');
        this.dom.sidebarCategories = document.getElementById('sidebar-categories');
        this.dom.menuItemsGrid = document.getElementById('menu-items-grid');
        this.dom.cartItemCount = document.getElementById('cart-item-count');
        this.dom.cartTotalPrice = document.getElementById('cart-total-price');
        this.dom.btnCartCheckout = document.getElementById('btn-cart-checkout');

        // 기존 메뉴 상세 모달 요소
        this.dom.modalItemDetail = document.getElementById('modal-item-detail');
        this.dom.detailModalTitle = document.getElementById('detail-modal-title');
        this.dom.detailModalCalories = document.getElementById('detail-modal-calories');
        this.dom.detailModalIcon = document.getElementById('detail-modal-icon');
        this.dom.modalQtyDisplay = document.getElementById('modal-qty-display');
        this.dom.modalAddPrice = document.getElementById('modal-add-price');
        this.dom.btnQtyMinus = document.getElementById('btn-qty-minus');
        this.dom.btnQtyPlus = document.getElementById('btn-qty-plus');
        this.dom.btnModalCancel = document.getElementById('btn-modal-cancel');
        this.dom.btnCloseDetailModal = document.getElementById('btn-close-detail-modal');
        this.dom.btnModalAddCart = document.getElementById('btn-modal-add-cart');

        // ① 단품/세트 선택 모달
        this.dom.modalSetOrSingle = document.getElementById('modal-set-or-single');
        this.dom.btnSingleOption = document.getElementById('btn-single-option');
        this.dom.btnSetOption = document.getElementById('btn-set-option');
        this.dom.btnCloseSetModal = document.getElementById('btn-close-set-modal');

        // ② 사이즈 선택 모달
        this.dom.modalSizeSelect = document.getElementById('modal-size-select');
        this.dom.btnSizeM = document.getElementById('btn-size-m');
        this.dom.btnSizeL = document.getElementById('btn-size-l');
        this.dom.btnCloseSizeModal = document.getElementById('btn-close-size-modal');

        // ③ 음료 선택 모달
        this.dom.modalDrinkSelect = document.getElementById('modal-drink-select');
        this.dom.btnDrinkConfirm = document.getElementById('btn-drink-confirm');
        this.dom.btnCloseDrinkModal = document.getElementById('btn-close-drink-modal');
        this.dom.drinkItems = document.querySelectorAll('.drink-option-item');

        // 화면 4 요소
        this.dom.reviewItemsList = document.getElementById('review-items-list');
        this.dom.reviewTotalAmount = document.getElementById('review-total-amount');
        this.dom.btnReviewAddMore = document.getElementById('btn-review-add-more');
        this.dom.btnOrderConfirm = document.getElementById('btn-order-confirm');

        // 화면 5 요소
        this.dom.btnPayCard = document.getElementById('btn-pay-card');
        this.dom.btnPayMobile = document.getElementById('btn-pay-mobile');
        this.dom.btnPaySimple = document.getElementById('btn-pay-simple');
        this.dom.btnBackToReview = document.getElementById('btn-back-to-review');

        // 화면 6 요소
        this.dom.virtualCardTouch = document.getElementById('virtual-card-touch');
        this.dom.cardProcessingStatus = document.getElementById('card-processing-status');

        // 화면 7 요소
        this.dom.boardMyNumPrep = document.getElementById('board-my-num-prep');
        this.dom.receiptOrderNo = document.getElementById('receipt-order-no');
        this.dom.receiptSummaryItem = document.getElementById('receipt-summary-item');
        this.dom.receiptSummaryPrice = document.getElementById('receipt-summary-price');
        this.dom.btnRestartMission = document.getElementById('btn-restart-mission');

        // 하드웨어 및 팝업 요소
        this.dom.kioskCardSlot = document.getElementById('kiosk-card-slot');
        this.dom.cardReaderLed = document.getElementById('card-reader-led');
        this.dom.insertedCardVisual = document.getElementById('inserted-card-visual');
        this.dom.receiptPrinterSlot = document.getElementById('receipt-printer-slot');
        this.dom.ejectedPaperVisual = document.getElementById('ejected-paper-visual');
        this.dom.ejectedOrderNum = document.getElementById('ejected-order-num');

        // 카드 수거 경고 모달
        this.dom.modalCardTakeWarning = document.getElementById('modal-card-take-warning');
    }

    initEvents() {
        // 웰컴 모드 선택 이벤트
        this.dom.welcomeBtnMission.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.setMode('mission');
            this.hideWelcomeModal();
            this.switchView('start'); // 🌟 모드 선택 즉시 위 그림과 같은 시작화면(주문하기)부터 띄우기!
            this.syncMissionStep();
            this.showToast('🎯 미션: 빅맥 세트 [포장] 주문하기! [주문하기]를 터치하세요.', 'info');
        });

        this.dom.welcomeBtnFree.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.setMode('free');
            this.hideWelcomeModal();
            this.switchView('start'); // 🌟 자유 모드도 시작화면(주문하기)부터 시작!
            this.showToast('🍟 자유 주문 모드 시작! 화면의 [주문하기]를 터치하세요.', 'info');
        });

        this.dom.btnOpenModeSelect.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.showWelcomeModal();
        });

        // 미션 목표 카드 [미션 도전 시작!] 버튼
        this.dom.btnStartMissionIntro.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.hideMissionIntro();
            this.switchView('start'); // 초기 주문하기 버튼이 있는 대기 광고 화면으로 진입!
            this.syncMissionStep();
        });

        // 토스트 알림창 클릭 시 즉시 닫기
        if (this.dom.kioskToast) {
            this.dom.kioskToast.addEventListener('click', () => {
                if (this.toastTimer) clearTimeout(this.toastTimer);
                this.dom.kioskToast.classList.remove('show');
            });
        }

        // 유도 가이드 토글
        this.dom.toggleGuide.addEventListener('change', (e) => {
            window.soundManager.playTouch();
            this.guideEnabled = e.target.checked;
            this.updateMissionUI();
        });

        // 소리 토글
        this.dom.btnToggleSound.addEventListener('click', () => {
            window.soundManager.enabled = !window.soundManager.enabled;
            this.dom.soundIcon.textContent = window.soundManager.enabled ? '🔊' : '🔇';
            if (window.soundManager.enabled) window.soundManager.playTouch();
        });

        // '다시 시작하기' → 모드 선택 화면 다시 띄우기
        this.dom.btnResetAll.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.resetAll();
        });

        // 화면 1: 중앙 광고 배너 또는 [주문하기] 버튼 터치 시 식사 장소 선택 화면으로 전환
        this.dom.startHeroAd.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.switchView('dining');
            this.syncMissionStep();
        });

        // 화면 1: 하단 [주문하기] 버튼 터치 시 식사 장소 선택 화면으로 전환
        this.dom.btnStartOrder.addEventListener('click', (e) => {
            e.stopPropagation();
            window.soundManager.playTouch();
            this.switchView('dining');
            this.syncMissionStep();
        });

        // 화면 2: 매장 / 포장 선택 (미션 모드에서는 '포장(테이크 아웃)'을 연습!)
        this.dom.btnEatIn.addEventListener('click', () => {
            if (this.currentMode === 'mission') {
                window.soundManager.playWarning();
                this.showToast("⚠️ 이번 미션 목표는 '테이크 아웃 (포장)'입니다! 오른쪽 [테이크 아웃 (포장)]을 선택해 주세요.", 'warning');
                this.showWrongWarning("⚠️ 미션 목표는 '테이크 아웃 (포장)'입니다! 오른쪽 [테이크 아웃 (포장)]을 터치하세요.");
                return;
            }
            window.soundManager.playTouch();
            this.selectDiningOption('eat-in');
            this.syncMissionStep();
        });

        this.dom.btnTakeOut.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.hideWrongWarning();
            this.selectDiningOption('take-out');
            this.syncMissionStep();
        });

        // 하단 장바구니 결제하기 버튼
        this.dom.btnCartCheckout.addEventListener('click', () => {
            window.soundManager.playTouch();
            if (this.cart.length === 0) {
                window.soundManager.playWarning();
                this.showToast('⚠️ 장바구니가 비어 있습니다. 메뉴를 담아주세요!', 'warning');
                return;
            }
            // 미션 모드: 장바구니에 빅맥 세트가 있는지 확인
            if (this.currentMode === 'mission') {
                const hasBigMacSet = this.cart.some(c => c.isBigMacSet === true);
                if (!hasBigMacSet) {
                    window.soundManager.playWarning();
                    this.showToast('⚠️ 미션 목표인 빅맥 세트가 없습니다! 빅맥 → 세트로 담아주세요.', 'warning');
                    this.showWrongWarning('⚠️ 장바구니에 빅맥 세트가 없습니다! 버거 탭에서 빅맥 세트를 담아주세요.');
                    return;
                }
            }
            this.renderReviewView();
            this.switchView('review');
            this.syncMissionStep();
        });

        // 기존 메뉴 상세 모달: 수량 조절
        this.dom.btnQtyMinus.addEventListener('click', () => {
            window.soundManager.playTouch();
            if (this.modalQty > 1) { this.modalQty--; this.updateModalQty(); }
        });
        this.dom.btnQtyPlus.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.modalQty++;
            this.updateModalQty();
        });

        // 기존 메뉴 상세 모달: 닫기 / 취소
        this.dom.btnModalCancel.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.closeDetailModal();
        });
        this.dom.btnCloseDetailModal.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.closeDetailModal();
        });

        // 기존 메뉴 상세 모달: [장바구니 담기]
        // 미션 모드에서는 빅맥 세트 외의 일반 메뉴 담기를 원천 차단!
        this.dom.btnModalAddCart.addEventListener('click', () => {
            if (this.currentMode === 'mission') {
                window.soundManager.playWarning();
                this.showToast('🚨 이번 미션에서는 빅맥 세트만 담을 수 있습니다!', 'warning');
                this.showWrongWarning('⚠️ 이번 미션 목표는 [빅맥 세트]입니다! 다른 메뉴는 담을 수 없습니다.');
                this.closeDetailModal();
                this.syncMissionStep();
                return;
            }
            window.soundManager.playAddCart();
            this.addItemToCart(this.selectedItemForModal, this.modalQty, false);
            this.closeDetailModal();
        });

        // ① 단품/세트 선택 모달: 닫기
        this.dom.btnCloseSetModal.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.closeSetModal();
            this.syncMissionStep();
        });

        // ① 단품 선택 → 미션 모드에서는 경고 후 세트 유도
        this.dom.btnSingleOption.addEventListener('click', () => {
            window.soundManager.playWarning();
            if (this.currentMode === 'mission') {
                this.showToast('⚠️ 미션 목표는 세트입니다! [세트로 주문]을 눌러주세요.', 'warning');
                this.showWrongWarning('⚠️ 미션 목표는 세트입니다! 오른쪽 [세트로 주문] 카드를 터치하세요.');
            } else {
                // 자유 모드: 단품으로 바로 장바구니 담기
                if (this.pendingSetItem) {
                    this.addItemToCart(this.pendingSetItem, 1, false);
                    this.closeSetModal();
                    this.showToast('🍔 빅맥(단품)이 담겼습니다!', 'info');
                }
            }
        });

        // ① 세트 선택 → 사이즈 선택 화면으로
        this.dom.btnSetOption.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.closeSetModal();
            this.openSizeModal();
            this.syncMissionStep();
        });

        // ② 사이즈 M 선택 → 음료 선택으로
        this.dom.btnSizeM.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.closeSizeModal();
            this.openDrinkModal();
            this.syncMissionStep();
        });

        // ② 사이즈 L: 비활성화 안내
        this.dom.btnSizeL.addEventListener('click', () => {
            window.soundManager.playWarning();
            this.showToast('L사이즈는 준비 중입니다. M사이즈를 선택해주세요.', 'info');
        });

        // ② 사이즈 모달 닫기 (이전 단품/세트 선택 단계로 복귀)
        if (this.dom.btnCloseSizeModal) {
            this.dom.btnCloseSizeModal.addEventListener('click', () => {
                window.soundManager.playTouch();
                this.closeSizeModal();
                this.openSetModal(this.pendingSetItem);
                this.syncMissionStep();
            });
        }

        // ③ 음료 모달 닫기 (이전 사이즈 선택 단계로 복귀)
        if (this.dom.btnCloseDrinkModal) {
            this.dom.btnCloseDrinkModal.addEventListener('click', () => {
                window.soundManager.playTouch();
                this.closeDrinkModal();
                this.openSizeModal();
                this.syncMissionStep();
            });
        }

        // ③ 음료 옵션 선택
        this.dom.drinkItems.forEach(item => {
            item.addEventListener('click', () => {
                window.soundManager.playTouch();
                this.dom.drinkItems.forEach(d => {
                    d.classList.remove('selected');
                    d.querySelector('.drink-check-mark').style.opacity = '0';
                });
                item.classList.add('selected');
                item.querySelector('.drink-check-mark').style.opacity = '1';
                this.selectedDrink = item.dataset.drink;
            });
        });

        // ③ [이 음료로 담기] → 빅맥 세트를 장바구니에 담고 모든 모달 닫기
        this.dom.btnDrinkConfirm.addEventListener('click', () => {
            window.soundManager.playAddCart();
            if (this.pendingSetItem) {
                const drinkName = this.getDrinkName(this.selectedDrink);
                const setEntry = {
                    item: {
                        ...this.pendingSetItem,
                        name: `빅맥 세트 (M, ${drinkName})`,
                        price: 7700,
                        iconType: 'burger_bigmac'
                    },
                    quantity: 1,
                    isBigMacSet: true
                };
                // 미션 모드에서는 기존 혹시 담긴 비정상 아이템 제거 후 빅맥 세트만 담기
                if (this.currentMode === 'mission') {
                    this.cart = [setEntry];
                } else {
                    this.cart.push(setEntry);
                }
                this.isBigMacSet = true;
                this.updateCartUI();
                this.pendingSetItem = null;
                this.closeDrinkModal();
                this.showToast(`🍔 빅맥 세트 (M, ${drinkName}) 담겼습니다!`, 'info');
                this.hideWrongWarning();
            }
            this.syncMissionStep();
        });

        // 화면 4: 메뉴 추가하기 (뒤로 가기)
        this.dom.btnReviewAddMore.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.switchView('menu');
            this.syncMissionStep();
        });

        // 화면 4: [주문 완료 (결제하기)]
        this.dom.btnOrderConfirm.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.switchView('payment');
            this.syncMissionStep();
        });

        // 화면 5: 결제 수단 선택
        this.dom.btnPayCard.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.startCardPayment();
            this.syncMissionStep();
        });

        this.dom.btnPayMobile.addEventListener('click', () => {
            window.soundManager.playTouch();
            if (this.currentMode === 'mission') {
                this.showToast("⚠️ 미션 목표: '신용/체크카드'를 선택하세요.", 'info');
            } else {
                this.showToast('모바일 바코드 결제는 준비 중입니다.', 'info');
            }
        });

        this.dom.btnPaySimple.addEventListener('click', () => {
            window.soundManager.playTouch();
            if (this.currentMode === 'mission') {
                this.showToast("⚠️ 미션 목표: '신용/체크카드'를 선택하세요.", 'info');
            } else {
                this.showToast('간편결제는 준비 중입니다.', 'info');
            }
        });

        this.dom.btnBackToReview.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.switchView('review');
            this.syncMissionStep();
        });

        // 하드웨어 IC 카드 삽입구 클릭
        const handleCardInsertAttempt = () => {
            if (this.currentViewName !== 'processing' || this.cart.length === 0) {
                window.soundManager.playWarning();
                this.showToast('⚠️ 아직 결제 단계가 아닙니다! 메뉴를 먼저 주문해 주세요.', 'warning');
                return;
            }
            if (this.cardState === 'out') {
                this.insertCard();
            }
        };

        this.dom.virtualCardTouch.addEventListener('click', handleCardInsertAttempt);
        this.dom.kioskCardSlot.addEventListener('click', handleCardInsertAttempt);

        // 꽂힌 카드를 직접 클릭해서 수거
        this.dom.insertedCardVisual.addEventListener('click', () => {
            if (this.cardState === 'must_remove' || this.cardState === 'inserted') {
                this.removeCard();
            }
        });

        // 주문 완료 후 처음으로 돌아가기 → 대기 화면(노란색 [주문하기] 버튼 창)으로 복귀
        this.dom.btnRestartMission.addEventListener('click', () => {
            window.soundManager.playTouch();
            this.resetAll();
        });
    }

    // --------------------------------------------------------
    // 상태 기반(State-Based) 미션 스텝 자동 동기화
    // 어떤 경로로 이동하든 현재 상황에 맞춰 1~13단계를 정확히 산출!
    // --------------------------------------------------------
    syncMissionStep() {
        if (this.currentMode !== 'mission') return;

        let targetStep = 1;

        switch (this.currentViewName) {
            case 'start':
                targetStep = 1; // 1단계: 초기 주문하기 화면 (하단 [주문하기] 버튼 터치)
                break;

            case 'dining':
                targetStep = 2; // 2단계: 식사 장소 선택 (왼쪽 [매장에서 식사] 터치)
                break;

            case 'menu':
                // 모달 및 장바구니 상태에 따른 세부 단계 판별
                const isDrinkOpen = this.dom.modalDrinkSelect && this.dom.modalDrinkSelect.classList.contains('active');
                const isSizeOpen = this.dom.modalSizeSelect && this.dom.modalSizeSelect.classList.contains('active');
                const isSetOpen = this.dom.modalSetOrSingle && this.dom.modalSetOrSingle.classList.contains('active');
                const hasBigMacSet = this.cart.some(c => c.isBigMacSet === true);

                if (isDrinkOpen) {
                    targetStep = 7; // 7단계: 음료 선택
                } else if (isSizeOpen) {
                    targetStep = 6; // 6단계: 사이즈 선택
                } else if (isSetOpen) {
                    targetStep = 5; // 5단계: 세트 주문
                } else if (hasBigMacSet) {
                    targetStep = 8; // 8단계: 장바구니 확인 후 결제하기
                } else if (this.currentCategory === 'burger') {
                    targetStep = 4; // 4단계: 버거 선택 (빅맥)
                } else {
                    targetStep = 3; // 3단계: 카테고리 이동 (버거 & 세트 탭)
                }
                break;

            case 'review':
                targetStep = 9; // 9단계: 주문 확인 (주문 완료 터치)
                break;

            case 'payment':
                targetStep = 10; // 10단계: 결제수단 선택 (신용카드)
                break;

            case 'processing':
                if (this.cardState === 'must_remove' || this.cardState === 'inserted') {
                    targetStep = 12; // 12단계: 카드 뽑기
                } else {
                    targetStep = 11; // 11단계: 카드 투입
                }
                break;

            case 'success':
                targetStep = 13; // 13단계: 주문 완료
                break;

            default:
                targetStep = this.currentStep;
        }

        this.currentStep = targetStep;

        // 장바구니 미션 완료 배지 (8단계 결제하기 안내)
        const cartBadge = document.getElementById('cart-mission-ready-badge');
        if (cartBadge) {
            cartBadge.textContent = '🎯 [8단계] 결제하기를 터치하세요! →';
            cartBadge.style.display = (this.currentMode === 'mission' && targetStep === 8) ? 'block' : 'none';
        }

        this.updateMissionUI();
    }

    advanceMission(nextStep) {
        this.currentStep = nextStep;
        this.updateMissionUI();
    }

    // --------------------------------------------------------
    // 단품/세트/사이즈/음료 모달 관리
    // --------------------------------------------------------
    openSetModal(item) {
        this.pendingSetItem = item;
        const subtext = this.dom.modalSetOrSingle.querySelector('.set-modal-subtext');
        if (subtext) {
            subtext.innerHTML = this.currentMode === 'mission'
                ? '👉 오른쪽 <b>[세트로 주문]</b> 카드를 터치하세요!'
                : '어떻게 주문하시겠어요?';
        }
        this.dom.modalSetOrSingle.classList.add('active');
    }

    closeSetModal() {
        this.dom.modalSetOrSingle.classList.remove('active');
    }

    openSizeModal() {
        const subtext = this.dom.modalSizeSelect.querySelector('.set-modal-subtext');
        if (subtext) {
            subtext.innerHTML = this.currentMode === 'mission'
                ? '👉 <b>[M사이즈 (기본)]</b> 카드를 터치하세요!'
                : '사이즈를 골라주세요';
        }
        this.dom.modalSizeSelect.classList.add('active');
    }

    closeSizeModal() {
        this.dom.modalSizeSelect.classList.remove('active');
    }

    openDrinkModal() {
        this.selectedDrink = 'cola';
        this.dom.drinkItems.forEach(d => {
            const isCola = d.dataset.drink === 'cola';
            d.classList.toggle('selected', isCola);
            d.querySelector('.drink-check-mark').style.opacity = isCola ? '1' : '0';
        });
        const subtext = this.dom.modalDrinkSelect.querySelector('.set-modal-subtext');
        if (subtext) {
            subtext.innerHTML = this.currentMode === 'mission'
                ? '👉 음료 확인 후 아래 <b>[이 음료로 담기 🛒]</b>를 터치하세요!'
                : '원하는 음료를 골라주세요';
        }
        this.dom.modalDrinkSelect.classList.add('active');
    }

    closeDrinkModal() {
        this.dom.modalDrinkSelect.classList.remove('active');
    }

    getDrinkName(drinkId) {
        const map = { 'cola': '콜라', 'cola-zero': '콜라제로', 'sprite': '스프라이트' };
        return map[drinkId] || '콜라';
    }

    // --------------------------------------------------------
    // 웰컴 / 미션 인트로 모달
    // --------------------------------------------------------
    showWelcomeModal() {
        this.dom.welcomeOverlay.classList.add('active');
        if (this.dom.missionStatusBar) {
            this.dom.missionStatusBar.style.display = 'none';
        }
    }

    hideWelcomeModal() {
        this.dom.welcomeOverlay.classList.remove('active');
        if (this.currentMode === 'mission') {
            this.syncMissionStep();
        }
    }

    showMissionIntro() {
        this.dom.missionIntroOverlay.classList.add('active');
        if (this.dom.missionStatusBar) {
            this.dom.missionStatusBar.style.display = 'none';
        }
    }

    hideMissionIntro() {
        this.dom.missionIntroOverlay.classList.remove('active');
        if (this.currentMode === 'mission') {
            this.syncMissionStep();
        }
    }

    setMode(mode) {
        this.currentMode = mode;
        document.body.classList.toggle('mission-mode-active', mode === 'mission');
        if (mode === 'mission') {
            this.dom.currentModeTag.textContent = '🎯 미션 모드';
            this.dom.missionStatusBar.style.display = 'flex';
        } else {
            this.dom.currentModeTag.textContent = '🍟 자유 모드';
            this.dom.missionStatusBar.style.display = 'none';
        }
        this.syncMissionStep();
    }

    showToast(message, type = 'info', duration = 1200) {
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.dom.toastText.textContent = message;
        this.dom.toastIcon.textContent = type === 'warning' ? '🚨' : '💡';
        this.dom.kioskToast.classList.add('show');
        this.toastTimer = setTimeout(() => {
            this.dom.kioskToast.classList.remove('show');
        }, duration);
    }

    highlightStartButtonBriefly() {
        this.dom.btnStartOrder.classList.add('guide-highlight-pulse');
        setTimeout(() => {
            if (this.currentMode !== 'mission' || !this.guideEnabled) {
                this.dom.btnStartOrder.classList.remove('guide-highlight-pulse');
            }
        }, 1800);
    }

    // --------------------------------------------------------
    // 뷰 전환
    // --------------------------------------------------------
    switchView(viewName) {
        this.currentViewName = viewName;
        Object.keys(this.dom.views).forEach(key => {
            this.dom.views[key].classList.remove('active');
        });
        if (this.dom.views[viewName]) {
            this.dom.views[viewName].classList.add('active');
        }
        setTimeout(() => this.syncMissionStep(), 30);
    }

    selectDiningOption(option) {
        this.diningOption = option;
        this.dom.currentDiningBadge.textContent = option === 'eat-in' ? '매장 식사' : '포장';
        this.switchView('menu');
    }

    // --------------------------------------------------------
    // 메뉴 렌더링
    // --------------------------------------------------------
    renderCategories() {
        this.dom.sidebarCategories.innerHTML = '';
        KIOSK_CATEGORIES.forEach(cat => {
            const item = document.createElement('div');
            item.className = `cat-item ${cat.id === this.currentCategory ? 'active' : ''}`;
            item.dataset.cat = cat.id;
            item.innerHTML = `
                <div class="cat-icon">${cat.icon}</div>
                <div class="cat-name">${cat.name}</div>
            `;
            item.addEventListener('click', () => {
                window.soundManager.playTouch();
                this.selectCategory(cat.id);
            });
            this.dom.sidebarCategories.appendChild(item);
        });
    }

    selectCategory(catId) {
        this.currentCategory = catId;
        document.querySelectorAll('.cat-item').forEach(el => {
            el.classList.toggle('active', el.dataset.cat === catId);
        });
        this.renderMenuItems(catId);

        if (this.currentMode === 'mission') {
            if (catId === 'burger') {
                this.hideWrongWarning();
            } else {
                // 버거 탭이 아닌 다른 탭을 눌렀을 때 명확한 경고 출력
                window.soundManager.playWarning();
                this.showWrongWarning('⚠️ 이번 미션 목표는 [빅맥 세트]입니다! 왼쪽 [버거 & 세트] 탭을 눌러주세요.');
                this.showToast('⚠️ 왼쪽 [버거 & 세트] 탭을 터치하세요!', 'warning');
            }
            this.syncMissionStep();
        }
    }

    renderMenuItems(catId) {
        this.dom.menuItemsGrid.innerHTML = '';
        const items = KIOSK_MENU_ITEMS.filter(item => item.categoryId === catId);

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.dataset.id = item.id;

            let iconEmoji = '🍔';
            if (item.iconType.includes('mcflurry')) iconEmoji = '🍨';
            else if (item.iconType.includes('sundae')) iconEmoji = '🍦';
            else if (item.iconType.includes('fries')) iconEmoji = '🍟';
            else if (item.iconType.includes('nuggets')) iconEmoji = '🍗';
            else if (item.iconType.includes('cheesestick')) iconEmoji = '🧀';
            else if (item.iconType.includes('cola')) iconEmoji = '🥤';
            else if (item.iconType.includes('shake')) iconEmoji = '🥛';

            card.innerHTML = `
                ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
                <div class="menu-card-img-wrap" style="background:${item.imageBg}">
                    ${iconEmoji}
                </div>
                <div class="menu-card-title">${item.name}</div>
                <div class="menu-card-calorie">${item.calories} kcal</div>
                <div class="menu-card-price">${item.price.toLocaleString()}원</div>
            `;

            card.addEventListener('click', () => {
                window.soundManager.playTouch();

                const realId = item.targetId || item.id;

                // 🍔 빅맥 카드 클릭: 단품/세트 선택 모달 열기
                if (realId === 'big-mac') {
                    const realItem = item.targetId
                        ? KIOSK_MENU_ITEMS.find(i => i.id === item.targetId) || item
                        : item;

                    this.hideWrongWarning();
                    this.openSetModal(realItem);
                    this.syncMissionStep();
                    return;
                }

                // 🚨 미션 모드에서 빅맥이 아닌 다른 메뉴를 누른 경우 무조건 강력 차단!!
                if (this.currentMode === 'mission') {
                    window.soundManager.playWarning();
                    this.showWrongWarning('⚠️ 이번 미션 목표는 [빅맥 세트]입니다! 빅맥 외 다른 메뉴는 담을 수 없습니다.');
                    this.showToast('🚨 이번 미션 목표는 [빅맥 세트]입니다!', 'warning');
                    // 만약 현재 카테고리가 버거가 아니라면 버거 카테고리로 자동 안내
                    if (this.currentCategory !== 'burger') {
                        setTimeout(() => this.selectCategory('burger'), 500);
                    }
                    return; // 모달 절대 열리지 않음!
                }

                // 자유 모드: 일반 상세 모달 열기
                this.openDetailModal(item);
            });

            this.dom.menuItemsGrid.appendChild(card);
        });

        if (this.currentMode === 'mission') {
            setTimeout(() => this.syncMissionStep(), 30);
        }
    }

    openDetailModal(item) {
        this.selectedItemForModal = item;
        this.modalQty = 1;
        this.dom.detailModalTitle.textContent = item.name;
        this.dom.detailModalCalories.textContent = `${item.calories} kcal`;

        let iconEmoji = '🍔';
        if (item.iconType.includes('mcflurry')) iconEmoji = '🍨';
        else if (item.iconType.includes('sundae')) iconEmoji = '🍦';
        else if (item.iconType.includes('fries')) iconEmoji = '🍟';
        else if (item.iconType.includes('cola')) iconEmoji = '🥤';
        this.dom.detailModalIcon.textContent = iconEmoji;

        this.updateModalQty();
        this.dom.modalItemDetail.classList.add('active');
    }

    updateModalQty() {
        this.dom.modalQtyDisplay.textContent = this.modalQty;
        const total = (this.selectedItemForModal?.price || 0) * this.modalQty;
        this.dom.modalAddPrice.textContent = `${total.toLocaleString()}원`;
    }

    closeDetailModal() {
        this.dom.modalItemDetail.classList.remove('active');
        this.selectedItemForModal = null;
    }

    addItemToCart(item, qty, isBigMacSet = false) {
        if (!item) return;
        const realItem = item.targetId ? KIOSK_MENU_ITEMS.find(i => i.id === item.targetId) || item : item;

        // 미션 모드에서는 빅맥 세트만 담길 수 있음
        if (this.currentMode === 'mission' && !isBigMacSet) {
            window.soundManager.playWarning();
            this.showToast('🚨 이번 미션에서는 빅맥 세트만 담을 수 있습니다!', 'warning');
            return;
        }

        if (!isBigMacSet) {
            const existing = this.cart.find(c => c.item.id === realItem.id && !c.isBigMacSet);
            if (existing) {
                existing.quantity += qty;
            } else {
                this.cart.push({ item: realItem, quantity: qty, isBigMacSet: false });
            }
        }
        this.updateCartUI();
    }

    updateCartUI() {
        const totalQty = this.cart.reduce((sum, c) => sum + c.quantity, 0);
        const totalPrice = this.cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
        this.dom.cartItemCount.textContent = totalQty;
        this.dom.cartTotalPrice.textContent = `${totalPrice.toLocaleString()}원`;
    }

    renderReviewView() {
        this.dom.reviewItemsList.innerHTML = '';
        let total = 0;

        this.cart.forEach(entry => {
            const row = document.createElement('div');
            row.className = 'review-item-row';
            const itemTotal = entry.item.price * entry.quantity;
            total += itemTotal;

            let iconEmoji = '🍔';
            if (entry.item.iconType && entry.item.iconType.includes('mcflurry')) iconEmoji = '🍨';
            else if (entry.item.iconType && entry.item.iconType.includes('sundae')) iconEmoji = '🍦';
            else if (entry.item.iconType && entry.item.iconType.includes('fries')) iconEmoji = '🍟';
            else if (entry.item.iconType && entry.item.iconType.includes('cola')) iconEmoji = '🥤';

            row.innerHTML = `
                <div class="review-item-info">
                    <div class="review-item-emoji">${iconEmoji}</div>
                    <div>
                        <div class="review-item-name">${entry.item.name}</div>
                        <div class="review-item-calc">${entry.item.price.toLocaleString()}원 × ${entry.quantity}</div>
                    </div>
                </div>
                <div style="font-size:15px; font-weight:800; color:var(--mcd-dark);">
                    ${itemTotal.toLocaleString()}원
                </div>
            `;
            this.dom.reviewItemsList.appendChild(row);
        });

        this.dom.reviewTotalAmount.textContent = `${total.toLocaleString()}원`;
    }

    // --------------------------------------------------------
    // 결제 & 하드웨어 카드 삽입 / 직접 수거
    // --------------------------------------------------------
    startCardPayment() {
        this.cardState = 'out';
        this.switchView('processing');
        this.dom.cardReaderLed.classList.add('active');
        this.dom.cardProcessingStatus.textContent = '하단의 카드 삽입구를 터치하세요!';
    }

    insertCard() {
        if (this.cardState !== 'out') return;
        this.cardState = 'inserted';
        window.soundManager.playCardInsert();

        this.dom.virtualCardTouch.style.opacity = '0.3';
        this.dom.insertedCardVisual.classList.add('visible');
        this.dom.cardProcessingStatus.textContent = 'IC 카드 결제 승인 요청 중...';

        setTimeout(() => {
            window.soundManager.playWarning();
            this.cardState = 'must_remove';
            this.dom.cardReaderLed.classList.remove('active');
            this.dom.modalCardTakeWarning.classList.add('active');
            this.dom.insertedCardVisual.classList.add('must-take');
            this.syncMissionStep();
        }, 1400);
    }

    removeCard() {
        if (this.cardState !== 'must_remove' && this.cardState !== 'inserted') return;
        this.cardState = 'removed';
        window.soundManager.playCardRemove();

        this.dom.modalCardTakeWarning.classList.remove('active');
        this.dom.insertedCardVisual.classList.remove('visible');
        this.dom.insertedCardVisual.classList.remove('must-take');
        this.dom.virtualCardTouch.style.opacity = '1';

        setTimeout(() => {
            window.soundManager.playReceiptPrint();
            this.dom.ejectedPaperVisual.classList.add('dispensing');
            setTimeout(() => {
                window.soundManager.playCompleteChime();
                this.finishOrder();
            }, 750);
        }, 250);
    }

    finishOrder() {
        this.orderNumber++;
        this.dom.boardMyNumPrep.textContent = `${this.orderNumber} (내 번호)`;
        this.dom.receiptOrderNo.textContent = this.orderNumber;
        this.dom.ejectedOrderNum.textContent = `No.${this.orderNumber}`;

        const diningLabel = this.diningOption === 'take-out' ? '🛍️ [포장]' : '🍽️ [매장]';
        const firstItem = this.cart[0];
        if (firstItem) {
            const moreTxt = this.cart.length > 1 ? ` 외 ${this.cart.length - 1}건` : '';
            this.dom.receiptSummaryItem.innerHTML = `
                <span>${diningLabel} ${firstItem.item.name} × ${firstItem.quantity}${moreTxt}</span>
                <span>${this.dom.cartTotalPrice.textContent}</span>
            `;
        }
        this.dom.receiptSummaryPrice.textContent = this.dom.cartTotalPrice.textContent;

        this.switchView('success');
        this.syncMissionStep();
    }

    // --------------------------------------------------------
    // 미션 UI 갱신 (상단 텍스트 + 인라인 유도 배지 + 네온 유도등)
    // --------------------------------------------------------
    showWrongWarning(msg) {
        this.dom.missionWrongWarning.textContent = msg;
        this.dom.missionWrongWarning.style.display = 'block';
    }

    hideWrongWarning() {
        this.dom.missionWrongWarning.style.display = 'none';
    }

    updateMissionUI() {
        // 기존 펄스 효과 및 인라인 배지 제거
        document.querySelectorAll('.guide-highlight-pulse').forEach(el => {
            el.classList.remove('guide-highlight-pulse');
        });
        document.querySelectorAll('.guide-direct-badge').forEach(badge => badge.remove());

        if (this.currentMode !== 'mission') {
            this.dom.missionStatusBar.style.display = 'none';
            const menuTitleEl = document.getElementById('menu-header-title');
            if (menuTitleEl) menuTitleEl.textContent = '메뉴 선택';
            return;
        }

        this.dom.missionStatusBar.style.display = 'flex';
        const stepDef = MISSION_SCENARIO.steps.find(s => s.stepId === this.currentStep);
        if (!stepDef) return;

        // 상단 가이드 바 실시간 갱신
        this.dom.missionStepBadge.textContent = `${stepDef.stepId}/${this.totalSteps}`;
        this.dom.missionGuideTitle.textContent = stepDef.title;
        this.dom.missionGuideText.textContent = stepDef.description;

        // 단계 변경 시 시각적 하이라이트 번쩍임 애니메이션
        this.dom.missionStatusBar.classList.remove('step-flash');
        void this.dom.missionStatusBar.offsetWidth;
        this.dom.missionStatusBar.classList.add('step-flash');

        // 키오스크 내부 헤더에도 현재 단계 실시간 반영 (시선 분산 방지)
        const menuTitleEl = document.getElementById('menu-header-title');
        if (menuTitleEl) {
            menuTitleEl.textContent = `[${stepDef.stepId}단계] ${stepDef.title}`;
        }

        if (!this.guideEnabled) return;

        // 타겟 요소 찾기
        let targetEl = null;
        try {
            targetEl = document.querySelector(stepDef.targetSelector);
        } catch (e) {}

        if (targetEl) {
            // 밝은 유도등 적용
            targetEl.classList.add('guide-highlight-pulse');

            // 버튼 바로 옆에 [👉 터치!] 인라인 배지 부착
            const badge = document.createElement('div');
            badge.className = `guide-direct-badge ${stepDef.badgePosition || 'top-center'}`;
            badge.textContent = stepDef.badgeText || '👉 터치!';

            const parentWrap = targetEl.closest('.btn-relative-wrap') || targetEl;
            parentWrap.style.position = 'relative';
            parentWrap.appendChild(badge);
        }
    }

    resetAll() {
        this.cart = [];
        this.currentStep = 1;
        this.currentCategory = 'recommend';
        this.cardState = 'out';
        this.pendingSetItem = null;
        this.isBigMacSet = false;
        this.selectedDrink = 'cola';
        this.hideWrongWarning();
        this.dom.ejectedPaperVisual.classList.remove('dispensing');
        this.dom.insertedCardVisual.classList.remove('visible');
        this.dom.insertedCardVisual.classList.remove('must-take');
        this.dom.cardReaderLed.classList.remove('active');
        this.dom.modalCardTakeWarning.classList.remove('active');
        // 모든 세트 관련 모달 닫기
        this.closeSetModal();
        this.closeSizeModal();
        this.closeDrinkModal();
        this.closeDetailModal();
        this.updateCartUI();
        this.renderCategories();
        this.renderMenuItems(this.currentCategory);
        this.switchView('start');
        this.syncMissionStep();
        this.showWelcomeModal(); // 다시 시작 시 모드 선택 창 띄우기
    }
}

// 앱 실행
window.addEventListener('DOMContentLoaded', () => {
    window.kioskApp = new KioskApp();
});
