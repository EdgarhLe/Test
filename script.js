/**
 * ====================================================================
 * ROMANTIC ANNIVERSARY EXPERIENCE - SCRIPT ENGINE
 * Full Interactive Engine: Sound Synthesizer, Lockscreen Gate, 
 * Runaway Button Physics, Procedural Flower Garden, Live Milestone, Telegram Webhook
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.LOVE_CONFIG || {};

  /* ------------------------------------------------------------------
   * 1. WEB AUDIO SYNTHESIZER (Tạo âm thanh chân thực không cần file mp3)
   * ------------------------------------------------------------------ */
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playKeyClickSound() {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  function playErrorSound() {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  function playSuccessChime() {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = audioCtx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }

  function triggerHaptic(duration = 25) {
    if (navigator.vibrate) {
      try { navigator.vibrate(duration); } catch (e) {}
    }
  }

  /* ------------------------------------------------------------------
   * 2. BACKGROUND MUSIC CONTROLLER
   * ------------------------------------------------------------------ */
  const bgmAudio = document.getElementById('bgm-audio');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  let isMusicPlaying = false;

  if (bgmAudio && config.bgm && config.bgm.url) {
    bgmAudio.src = config.bgm.url;
  }

  function startMusic() {
    if (!bgmAudio) return;
    bgmAudio.play().then(() => {
      isMusicPlaying = true;
      musicToggleBtn.classList.add('playing');
      musicToggleBtn.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
    }).catch(err => {
      console.log('Autoplay blocked:', err);
    });
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      triggerHaptic(20);
      if (!bgmAudio) return;
      if (isMusicPlaying) {
        bgmAudio.pause();
        isMusicPlaying = false;
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
      } else {
        startMusic();
      }
    });
  }

  /* ------------------------------------------------------------------
   * 3. CONFETTI & HEART FIREWORKS (Canvas Particles)
   * ------------------------------------------------------------------ */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function shootHearts(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 45) {
    const colors = ['#ff4d6d', '#ff758f', '#ff85a2', '#ffbe0b', '#ff0055', '#ff99c8'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 14 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 60,
        isHeart: Math.random() > 0.3
      });
    }
    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function drawHeartShape(c, x, y, size, color, opacity, rotation) {
    c.save();
    c.translate(x, y);
    c.rotate((rotation * Math.PI) / 180);
    c.globalAlpha = opacity;
    c.fillStyle = color;
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
    c.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    c.closePath();
    c.fill();
    c.restore();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.rotation += p.rotationSpeed;
      p.life++;
      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      if (p.isHeart) {
        drawHeartShape(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (p.life >= p.maxLife || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
    }
  }

  /* ------------------------------------------------------------------
   * 4. SCREEN SWITCHER
   * ------------------------------------------------------------------ */
  const screenLock = document.getElementById('screen-lock');
  const screenQuestion = document.getElementById('screen-question');
  const screenHub = document.getElementById('screen-hub');

  function showScreen(targetScreen) {
    [screenLock, screenQuestion, screenHub].forEach(s => {
      s.classList.remove('active');
    });
    targetScreen.classList.add('active');
  }

  /* ------------------------------------------------------------------
   * 5. MODULE 1: PHONE LOCKSCREEN & PASSCODE LOGIC
   * ------------------------------------------------------------------ */
  const timeDisplay = document.getElementById('clock-time');
  const dateDisplay = document.getElementById('clock-date');
  const pinDots = document.querySelectorAll('.pin-dot');
  const passcodeHint = document.getElementById('passcode-hint');
  const passcodeContainer = document.querySelector('.passcode-container');
  const numpadButtons = document.querySelectorAll('.num-btn');

  let enteredPin = '';
  let wrongAttempts = 0;
  const targetPin = (config.passcode || '2507').trim();

  // Clock Update
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}`;

    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const month = now.getMonth() + 1;
    dateDisplay.textContent = `${dayName}, ngày ${dateNum} tháng ${month}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  if (passcodeHint && config.hintInitial) {
    passcodeHint.textContent = config.hintInitial;
  }

  function updateDots() {
    pinDots.forEach((dot, index) => {
      if (index < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
      dot.classList.remove('error');
    });
  }

  function handleDigitInput(digit) {
    if (enteredPin.length >= targetPin.length) return;
    enteredPin += digit;
    playKeyClickSound();
    triggerHaptic(25);
    updateDots();

    if (enteredPin.length === targetPin.length) {
      setTimeout(verifyPin, 180);
    }
  }

  function handleBackspace() {
    if (enteredPin.length > 0) {
      enteredPin = enteredPin.slice(0, -1);
      playKeyClickSound();
      triggerHaptic(20);
      updateDots();
    }
  }

  function verifyPin() {
    if (enteredPin === targetPin) {
      // SUCCESS!
      playSuccessChime();
      triggerHaptic(70);
      shootHearts(window.innerWidth / 2, window.innerHeight * 0.45, 60);

      if (config.bgm && config.bgm.autoPlayOnUnlock) {
        startMusic();
      }

      passcodeHint.textContent = 'Mở khóa thành công! Chuẩn bị quà nhé... ❤️';
      passcodeHint.style.color = '#38b000';

      setTimeout(() => {
        showScreen(screenQuestion);
      }, 1000);

    } else {
      // ERROR WRONG PIN
      wrongAttempts++;
      playErrorSound();
      triggerHaptic(100);

      pinDots.forEach(dot => dot.classList.add('error'));
      passcodeContainer.classList.add('shake');

      const messages = config.wrongCodeMessages || ['Sai mật khẩu rồi nè!'];
      const msgIndex = Math.min(wrongAttempts - 1, messages.length - 1);
      passcodeHint.textContent = messages[msgIndex];
      passcodeHint.style.color = '#d90429';

      setTimeout(() => {
        passcodeContainer.classList.remove('shake');
        enteredPin = '';
        updateDots();
      }, 650);
    }
  }

  numpadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const val = btn.getAttribute('data-val');

      if (action === 'delete') {
        handleBackspace();
      } else if (action === 'hint') {
        triggerHaptic(20);
        passcodeHint.textContent = config.hintInitial || 'Gợi ý: Ngày bắt đầu quen!';
      } else if (val) {
        handleDigitInput(val);
      }
    });
  });

  /* ------------------------------------------------------------------
   * 6. MODULE 2: RUNAWAY QUESTION GATE ("Em có iu tôi không?")
   * ------------------------------------------------------------------ */
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const cheekyToast = document.getElementById('cheeky-toast');
  const questionCard = document.querySelector('.question-card');
  const questionButtonsArea = document.querySelector('.choice-buttons-area');

  let noEvadeCount = 0;
  let yesScale = 1;

  function showCheekyToast(msg) {
    if (!cheekyToast) return;
    cheekyToast.textContent = msg;
    cheekyToast.classList.add('show');
    clearTimeout(cheekyToast._timer);
    cheekyToast._timer = setTimeout(() => {
      cheekyToast.classList.remove('show');
    }, 1800);
  }

  let lastRandX = 0;
  let lastRandY = 0;

  function moveNoButton() {
    noEvadeCount++;
    playKeyClickSound();
    triggerHaptic(35);

    // Make "Yes" button progressively grow bigger!
    yesScale += 0.08;
    if (yesScale > 1.45) yesScale = 1.45;
    btnYes.style.transform = `scale(${yesScale})`;

    // Calculate bounding box so button doesn't leave the screen or card
    const btnRect = btnNo.getBoundingClientRect();
    const maxX = Math.min(120, (window.innerWidth - btnRect.width) / 2 - 20);
    const maxY = 80;

    let randX = (Math.random() * (maxX * 2)) - maxX;
    let randY = (Math.random() * (maxY * 2)) - maxY;

    // Ensure it noticeably jumps away from the previous position
    if (Math.abs(randX - lastRandX) < 50) {
      randX = randX > 0 ? randX - 70 : randX + 70;
    }
    if (Math.abs(randY - lastRandY) < 40) {
      randY = randY > 0 ? randY - 50 : randY + 50;
    }

    lastRandX = randX;
    lastRandY = randY;

    // Apply smooth position change
    btnNo.style.transform = `translate(${randX}px, ${randY}px) scale(0.92)`;

    // Random witty message
    const msgs = (config.question && config.question.noEscapeMessages) || [
      'Đố bắt được nút này đó! 😝'
    ];
    const pickedMsg = msgs[Math.floor(Math.random() * msgs.length)];
    showCheekyToast(pickedMsg);
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveNoButton();
    }, { passive: false });
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      moveNoButton();
    });
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      playSuccessChime();
      triggerHaptic(60);
      shootHearts(window.innerWidth / 2, window.innerHeight / 2, 70);

      btnYes.style.transform = `scale(${yesScale * 1.15})`;
      showCheekyToast('Biết ngay mà! Tớ cũng yêu cậu nhiều lắmmm ❤️');

      setTimeout(() => {
        showScreen(screenHub);
        initFlowerGarden();
      }, 1000);
    });
  }

  /* ------------------------------------------------------------------
   * 7. MODULE 3: DASHBOARD HUB (3-STEP STORY)
   * ------------------------------------------------------------------ */
  const stages = [
    document.getElementById('stage-gift'),
    document.getElementById('stage-milestone'),
    document.getElementById('stage-feedback')
  ];
  const stepDots = document.querySelectorAll('.step-dot');
  let currentStageIndex = 0;

  function setStage(index) {
    currentStageIndex = index;
    stages.forEach((st, idx) => {
      if (idx === index) {
        st.classList.add('active');
      } else {
        st.classList.remove('active');
      }
    });

    stepDots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (index === 1) {
      startLiveMilestoneTimer();
    }
  }

  // --- STAGE 1: FLOWER GARDEN & 3D GIFT BOX ---
  const flowerCanvas = document.getElementById('flower-canvas');
  let flowerCtx = null;
  let flowers = [];
  let flowerAnimRunning = false;

  function initFlowerGarden() {
    if (!flowerCanvas) return;
    flowerCtx = flowerCanvas.getContext('2d');
    flowerCanvas.width = flowerCanvas.parentElement.clientWidth || 380;
    flowerCanvas.height = flowerCanvas.parentElement.clientHeight || 500;

    // Create 7 stems with buds
    flowers = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const baseX = (flowerCanvas.width / (count + 1)) * (i + 1) + (Math.random() * 20 - 10);
      const targetHeight = Math.random() * 120 + (flowerCanvas.height * 0.45);
      flowers.push({
        baseX: baseX,
        baseY: flowerCanvas.height,
        targetHeight: targetHeight,
        currentHeight: 0,
        curve: (Math.random() - 0.5) * 40,
        bloomProgress: 0,
        petalColor: ['#ff4d6d', '#ff758f', '#ff85a2', '#ffbe0b', '#ffa69e'][i % 5],
        stemColor: '#52b788',
        speed: Math.random() * 1.5 + 2
      });
    }

    if (!flowerAnimRunning) {
      flowerAnimRunning = true;
      animateFlowers();
    }
  }

  function animateFlowers() {
    if (!flowerCtx) return;
    flowerCtx.clearRect(0, 0, flowerCanvas.width, flowerCanvas.height);

    let allDone = true;
    flowers.forEach(f => {
      if (f.currentHeight < f.targetHeight) {
        f.currentHeight += f.speed;
        allDone = false;
      } else if (f.bloomProgress < 1) {
        f.bloomProgress += 0.02;
        allDone = false;
      }

      const topX = f.baseX + f.curve * (f.currentHeight / f.targetHeight);
      const topY = f.baseY - f.currentHeight;

      // Draw Stem
      flowerCtx.beginPath();
      flowerCtx.moveTo(f.baseX, f.baseY);
      flowerCtx.quadraticCurveTo(f.baseX + f.curve * 0.5, f.baseY - f.currentHeight * 0.5, topX, topY);
      flowerCtx.strokeStyle = f.stemColor;
      flowerCtx.lineWidth = 3.5;
      flowerCtx.lineCap = 'round';
      flowerCtx.stroke();

      // Draw Leaves
      if (f.currentHeight > f.targetHeight * 0.4) {
        flowerCtx.save();
        flowerCtx.fillStyle = '#74c69d';
        flowerCtx.beginPath();
        const leafY = f.baseY - f.currentHeight * 0.4;
        const leafX = f.baseX + f.curve * 0.4;
        flowerCtx.ellipse(leafX + 12, leafY, 14, 6, Math.PI / 4, 0, Math.PI * 2);
        flowerCtx.fill();
        flowerCtx.restore();
      }

      // Draw Flower Petals Blooming
      if (f.bloomProgress > 0) {
        const petalCount = 5;
        const petalSize = 14 * f.bloomProgress;
        flowerCtx.save();
        flowerCtx.translate(topX, topY);
        for (let p = 0; p < petalCount; p++) {
          const angle = (p * (Math.PI * 2)) / petalCount;
          flowerCtx.save();
          flowerCtx.rotate(angle);
          flowerCtx.fillStyle = f.petalColor;
          flowerCtx.beginPath();
          flowerCtx.ellipse(0, -petalSize * 0.9, petalSize * 0.7, petalSize, 0, 0, Math.PI * 2);
          flowerCtx.fill();
          flowerCtx.restore();
        }
        // Flower Center
        flowerCtx.beginPath();
        flowerCtx.arc(0, 0, petalSize * 0.5, 0, Math.PI * 2);
        flowerCtx.fillStyle = '#ffe066';
        flowerCtx.fill();
        flowerCtx.restore();
      }
    });

    if (!allDone) {
      requestAnimationFrame(animateFlowers);
    }
  }

  // 3D Gift Box Interaction
  const giftBox = document.getElementById('gift-box');
  const openedMessage = document.getElementById('opened-message');
  const btnNextToMilestone = document.getElementById('btn-next-milestone');
  let isGiftOpened = false;

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      if (isGiftOpened) return;
      isGiftOpened = true;
      playSuccessChime();
      triggerHaptic(50);

      giftBox.classList.add('opened');
      shootHearts(window.innerWidth / 2, window.innerHeight * 0.4, 50);

      setTimeout(() => {
        openedMessage.classList.add('show');
        btnNextToMilestone.style.display = 'flex';
      }, 700);
    });
  }

  if (btnNextToMilestone) {
    btnNextToMilestone.addEventListener('click', () => {
      triggerHaptic(25);
      setStage(1);
    });
  }

  // --- STAGE 2: 25/7 - 25/9 MILESTONE TIMELINE ---
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMinutes = document.getElementById('count-minutes');
  const countSeconds = document.getElementById('count-seconds');
  const loveLetterEl = document.getElementById('love-letter-text');
  const btnNextToFeedback = document.getElementById('btn-next-feedback');
  let milestoneTimer = null;

  if (loveLetterEl && config.milestone && config.milestone.loveLetter) {
    loveLetterEl.textContent = config.milestone.loveLetter;
  }

  function startLiveMilestoneTimer() {
    if (milestoneTimer) clearInterval(milestoneTimer);

    function update() {
      const start = new Date(config.milestone.startDate || '2026-07-25T00:00:00');
      const now = new Date();
      const diffMs = Math.max(0, now - start);

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      if (countDays) countDays.textContent = String(days).padStart(2, '0');
      if (countHours) countHours.textContent = String(hours).padStart(2, '0');
      if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, '0');
      if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, '0');
    }

    update();
    milestoneTimer = setInterval(update, 1000);
  }

  if (btnNextToFeedback) {
    btnNextToFeedback.addEventListener('click', () => {
      triggerHaptic(25);
      setStage(2);
    });
  }

  // --- STAGE 3: FEEDBACK BOX & TELEGRAM BOT WEBHOOK ---
  const feedbackInput = document.getElementById('feedback-input');
  const emojiButtons = document.querySelectorAll('.emoji-btn');
  const btnSendFeedback = document.getElementById('btn-send-feedback');
  const successModal = document.getElementById('success-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Emoji Quick Input
  emojiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerHaptic(20);
      const emoji = btn.getAttribute('data-emoji');
      if (feedbackInput) {
        feedbackInput.value += emoji;
        feedbackInput.focus();
      }
    });
  });

  if (btnSendFeedback) {
    btnSendFeedback.addEventListener('click', async () => {
      const message = (feedbackInput.value || '').trim();
      if (!message) {
        triggerHaptic(50);
        feedbackInput.focus();
        feedbackInput.style.borderColor = '#ff2a5f';
        setTimeout(() => {
          feedbackInput.style.borderColor = '';
        }, 1200);
        return;
      }

      playKeyClickSound();
      triggerHaptic(40);
      btnSendFeedback.disabled = true;
      btnSendFeedback.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi bồ câu đưa thư... 🕊️';

      // Gather telemetry for romantic receipt
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      const deviceStr = /Mobi|Android/i.test(navigator.userAgent) ? 'Điện thoại di động 📱' : 'Máy tính 💻';

      // Save locally in all cases so no heartfelt message is ever lost
      try {
        const stored = JSON.parse(localStorage.getItem('anniversary_feedbacks') || '[]');
        stored.push({ time: timeStr, text: message });
        localStorage.setItem('anniversary_feedbacks', JSON.stringify(stored));
      } catch (e) {}

      // Send to Telegram Bot if configured
      const botToken = (config.telegram && config.telegram.botToken || '').trim();
      const chatId = (config.telegram && config.telegram.chatId || '').trim();

      if (botToken && chatId) {
        const telegramText = `💌 *LỜI NHẮN MỚI TỪ NGƯỜI ẤY!*\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `⏰ *Thời gian:* ${timeStr}\n` +
          `📱 *Thiết bị:* ${deviceStr}\n` +
          `💬 *Nội dung:*\n"${message}"\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `✨ *Kỷ niệm 2 tháng tìm hiểu (25/7 - 25/9)* ❤️`;

        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramText,
              parse_mode: 'Markdown'
            })
          });
        } catch (err) {
          console.log('Telegram send error (saved locally):', err);
        }
      }

      // Show Thank You Celebration
      playSuccessChime();
      shootHearts(window.innerWidth / 2, window.innerHeight / 2, 80);
      btnSendFeedback.innerHTML = '<i class="fa-solid fa-check"></i> Đã gửi thành công! ❤️';

      setTimeout(() => {
        if (successModal) successModal.classList.add('show');
      }, 500);
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      triggerHaptic(20);
      if (successModal) successModal.classList.remove('show');
      shootHearts(window.innerWidth / 2, window.innerHeight * 0.3, 50);
    });
  }

});
