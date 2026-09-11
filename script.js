// =====================================================
// Berrinay & Ömer — özür sitesi
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  buildPetals();
  setupEnvelope();
  setupForgiveButtons();
  setupSongGame();
  setupPromises();
  setupFinale();
});

/* ---------------- ambient petals ---------------- */
function buildPetals() {
  const field = document.getElementById('petalField');
  const count = window.innerWidth < 600 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = 8 + Math.random() * 10 + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.opacity = 0.15 + Math.random() * 0.3;
    p.style.transform = `scale(${0.6 + Math.random()})`;
    field.appendChild(p);
  }
}

/* ---------------- envelope open ---------------- */
function setupEnvelope() {
  const envelope = document.getElementById('envelope');
  const hero = document.getElementById('hero');
  const content = document.getElementById('content');
  const tapHint = document.getElementById('tapHint');

  envelope.addEventListener('click', () => {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    tapHint.style.opacity = '0';

    setTimeout(() => {
      content.hidden = false;
      content.style.opacity = '0';
      requestAnimationFrame(() => {
        content.style.transition = 'opacity 700ms ease';
        content.style.opacity = '1';
      });
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        document.getElementById('letter').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }, 750);
  });
}

/* ---------------- forgive buttons ---------------- */
function setupForgiveButtons() {
  const yesBtn = document.getElementById('btnYes');
  const noBtn = document.getElementById('btnNo');
  const wrap = document.querySelector('.forgive-buttons');
  const result = document.getElementById('forgiveResult');

  const dodgeLines = [
    'emin misin?',
    'bir kere daha düşün',
    'olmaz öyle 🙅',
    'yakalayamazsın'
  ];
  let dodgeCount = 0;
  const maxDodge = 4;

  noBtn.addEventListener('mouseenter', () => {
    if (dodgeCount >= maxDodge) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = wrapRect.width - btnRect.width - 8;
    const randomX = Math.random() * Math.max(maxX, 40) - maxX / 2;
    const randomY = (Math.random() - 0.5) * 24;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    noBtn.textContent = dodgeLines[dodgeCount % dodgeLines.length];
    dodgeCount++;
    if (dodgeCount >= maxDodge) {
      noBtn.style.opacity = '0.35';
      noBtn.textContent = 'pes ediyorum';
    }
  });

  // touch devices: dodge on tap too, without blocking a real answer forever
  noBtn.addEventListener('touchstart', (e) => {
    if (dodgeCount < maxDodge) {
      e.preventDefault();
      noBtn.dispatchEvent(new Event('mouseenter'));
    }
  });

  yesBtn.addEventListener('click', () => {
    result.textContent = 'Teşekkür ederim. Söz veriyorum, bunu hak etmeye çalışacağım. 💛';
  });

  noBtn.addEventListener('click', () => {
    if (dodgeCount >= maxDodge) {
      result.textContent = 'Tamam, zaman tanıyorum. Ama okumaya devam eder misin? 🥺';
    }
  });
}

/* ---------------- song guessing game ---------------- */
// İstersen bu listeyi kendi aranızdaki şarkılarla değiştirebilirsin.
// Sadece emoji ipucu + doğru cevap var — söz alıntılamıyoruz.
const songRounds = [
  { emoji: '🌧️☂️💔', answer: 'yağmur', hint: 'hava durumuyla ilgili bir kelime' },
  { emoji: '🌙⭐✨', answer: 'gece', hint: 'gökyüzüyle ilgili' },
  { emoji: '🔥❤️‍🔥', answer: 'aşk', hint: 'tek kelime, dört harf' },
  { emoji: '🚶‍♂️🚪👋', answer: 'giden', hint: 'ayrılıkla ilgili bir şarkı teması' },
  { emoji: '📞💭🥹', answer: 'özledim', hint: 'bir duygu fiili' },
];

let currentRound = 0;
let score = 0;

function setupSongGame() {
  renderRound();

  document.getElementById('guessBtn').addEventListener('click', submitGuess);
  document.getElementById('guessInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitGuess();
  });
  document.getElementById('skipBtn').addEventListener('click', () => {
    nextRound('geçildi.');
  });
}

function renderRound() {
  const round = songRounds[currentRound];
  document.getElementById('emojiClue').textContent = round.emoji;
  document.getElementById('guessInput').value = '';
  document.getElementById('gameFeedback').textContent = '';
  document.getElementById('gameProgress').textContent =
    `${currentRound + 1} / ${songRounds.length}`;
  updateScore();
}

function submitGuess() {
  const input = document.getElementById('guessInput');
  const round = songRounds[currentRound];
  const guess = input.value.trim().toLocaleLowerCase('tr');
  const correct = round.answer.toLocaleLowerCase('tr');
  const feedback = document.getElementById('gameFeedback');

  if (!guess) {
    feedback.textContent = `ipucu: ${round.hint}`;
    return;
  }

  if (guess === correct || correct.includes(guess) || guess.includes(correct)) {
    score++;
    feedback.textContent = 'doğru! 🎉';
    spawnHeartsAt(document.getElementById('gameCard'));
    setTimeout(() => nextRound(''), 900);
  } else {
    feedback.textContent = `hayır — ipucu: ${round.hint}`;
  }
}

function nextRound(msg) {
  currentRound++;
  if (currentRound >= songRounds.length) {
    const card = document.getElementById('gameCard');
    card.innerHTML = `
      <p style="font-family:var(--serif); font-style:italic; font-size:1.4rem; margin:0 0 10px;">
        Liste bitti.
      </p>
      <p style="color:var(--muted); margin:0;">
        ${score} / ${songRounds.length} doğru bildin.
      </p>`;
    return;
  }
  if (msg) document.getElementById('gameFeedback').textContent = msg;
  renderRound();
}

function updateScore() {
  document.getElementById('gameScore').textContent = `skor: ${score}`;
}

/* ---------------- promises checklist ---------------- */
function setupPromises() {
  const items = document.querySelectorAll('#promiseList li');
  items.forEach((li) => {
    li.addEventListener('click', () => {
      const checked = li.getAttribute('data-checked') === 'true';
      li.setAttribute('data-checked', checked ? 'false' : 'true');
    });
  });
}

/* ---------------- finale heart burst ---------------- */
function setupFinale() {
  const heartBtn = document.getElementById('heartBtn');
  heartBtn.addEventListener('click', () => {
    spawnHeartsAt(heartBtn, 14);
  });
}

function spawnHeartsAt(el, count = 8) {
  const rect = el.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const symbols = ['❤️', '💛', '💫'];

  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = originX + (Math.random() - 0.5) * 40 + 'px';
    h.style.top = originY + 'px';
    h.style.setProperty('--dx', (Math.random() - 0.5) * 160 + 'px');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1300);
  }
}
