// Web Audio API를 활용한 순수 자바스크립트 효과음 생성기 (외부 파일 의존성 없음)
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // 버튼 터치음 (짧고 부드러운 탭 소리)
    playTouch() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    }

    // 장바구니 담기 사운드 (경쾌한 상승음)
    playAddCart() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    }

    // 카드 삽입 및 인식음 (딸깍 + 삑)
    playCardInsert() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            // 1. 딸깍 (클릭음)
            const oscClick = this.ctx.createOscillator();
            const gainClick = this.ctx.createGain();
            oscClick.type = 'square';
            oscClick.frequency.setValueAtTime(300, now);
            gainClick.gain.setValueAtTime(0.2, now);
            gainClick.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
            oscClick.connect(gainClick);
            gainClick.connect(this.ctx.destination);
            oscClick.start(now);
            oscClick.stop(now + 0.04);

            // 2. 삑 (인식 비프음)
            const oscBeep = this.ctx.createOscillator();
            const gainBeep = this.ctx.createGain();
            oscBeep.type = 'sine';
            oscBeep.frequency.setValueAtTime(1400, now + 0.1);
            gainBeep.gain.setValueAtTime(0.2, now + 0.1);
            gainBeep.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            oscBeep.connect(gainBeep);
            gainBeep.connect(this.ctx.destination);
            oscBeep.start(now + 0.1);
            oscBeep.stop(now + 0.25);
        } catch (e) {}
    }

    // 카드 뽑기 소리 (스윽)
    playCardRemove() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    // 결제 완료 딩동 차임벨 (2음 차임)
    playCompleteChime() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            
            // 딩 (G5 784Hz)
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(783.99, now);
            gain1.gain.setValueAtTime(0.25, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.8);

            // 동 (E5 659Hz)
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, now + 0.25);
            gain2.gain.setValueAtTime(0.25, now + 0.25);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now + 0.25);
            osc2.stop(now + 1.2);
        } catch (e) {}
    }

    // 영수증 출력 지이잉 사운드 (기계 작동음)
    playReceiptPrint() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 0.8;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000, now);
            filter.Q.setValueAtTime(3.0, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
            noise.stop(now + 0.8);
        } catch (e) {}
    }

    // 경고 / 알림음 (카드 수거 주의 알림 등)
    playWarning() {
        if (!this.enabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            [0, 0.15].forEach(delay => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(880, now + delay);
                gain.gain.setValueAtTime(0.2, now + delay);
                gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + delay);
                osc.stop(now + delay + 0.1);
            });
        } catch (e) {}
    }
}

window.soundManager = new SoundManager();
