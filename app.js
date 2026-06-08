/* ============================================
   app.js — DOM rendering & event wiring
   Depends on logic.js (loaded first)
   ============================================ */

/* ─── State ────────────────────────────────── */

let state = {
  confessions: CONFESSIONS.map(c => ({ ...c, guilty: false, denied: false })),
  weighed: false,
};

/* ─── DOM Rendering ────────────────────────── */

const beam = document.getElementById('beam');
const panLeft = document.getElementById('panLeft');
const panRight = document.getElementById('panRight');
const weightFill = document.getElementById('weightFill');
const weightDisplay = document.getElementById('weightDisplay');
const confessionsList = document.getElementById('confessionsList');
const judgeBtn = document.getElementById('judgeBtn');
const judgment = document.getElementById('judgment');
const judgmentCard = document.getElementById('judgmentCard');
const verdictText = document.getElementById('verdictText');
const judgmentIcon = document.getElementById('judgmentIcon');
const judgmentDetail = document.getElementById('judgmentDetail');
const resetBtn = document.getElementById('resetBtn');

function renderConfessions() {
  confessionsList.innerHTML = '';
  state.confessions.forEach(c => {
    const card = document.createElement('div');
    card.className = `confession-card${c.guilty ? ' confessed' : ''}${c.denied ? ' denied' : ''}`;
    card.dataset.id = c.id;

    card.innerHTML = `
      <span class="confession-number">${String(c.id).padStart(2, '0')}</span>
      <span class="confession-text">${c.text}</span>
      <div class="confession-actions">
        <button class="confession-btn guilty${c.guilty ? ' active' : ''}" data-plea="guilty">GUILTY</button>
        <button class="confession-btn innocent${c.denied ? ' active' : ''}" data-plea="innocent">DENY</button>
      </div>
    `;

    const btns = card.querySelectorAll('.confession-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const plea = btn.dataset.plea;
        state.confessions = setPlea(state.confessions, c.id, plea);
        renderConfessions();
        updateScale();
      });
    });

    confessionsList.appendChild(card);
  });
}

function updateScale() {
  const weight = calculateWeight(state.confessions);
  const maxWeight = state.confessions.length;

  const ratio = maxWeight > 0 ? weight / maxWeight : 0;
  const angle = -12 + (ratio * 24);
  beam.style.transform = `rotate(${angle}deg)`;

  const panOffset = Math.abs(angle) * 0.8;
  if (angle < 0) {
    panLeft.style.transform = `translateY(${-panOffset * 0.3}px)`;
    panRight.style.transform = `translateY(${panOffset * 0.3}px)`;
  } else if (angle > 0) {
    panLeft.style.transform = `translateY(${panOffset * 0.3}px)`;
    panRight.style.transform = `translateY(${-panOffset * 0.3}px)`;
  } else {
    panLeft.style.transform = 'translateY(0)';
    panRight.style.transform = 'translateY(0)';
  }

  weightDisplay.textContent = `${weight} / ${maxWeight}`;

  const fillPercent = ratio * 100;
  weightFill.style.left = `calc(${fillPercent}%)`;
}

function showJudgment() {
  const weight = calculateWeight(state.confessions);
  const maxWeight = state.confessions.length;
  const result = getJudgment(weight, maxWeight);

  judgmentCard.className = 'judgment-card ' + result.verdict;
  verdictText.textContent = result.title;
  judgmentIcon.textContent = result.icon;
  judgmentDetail.textContent = result.detail;

  judgment.classList.remove('hidden');
  judgment.scrollIntoView({ behavior: 'smooth', block: 'center' });

  state.weighed = true;
  judgeBtn.disabled = true;
  judgeBtn.textContent = '𓃣 THE SCALE HAS SPOKEN 𓃣';
}

function resetAll() {
  state.confessions = resetConfessions(state.confessions);
  state.weighed = false;

  renderConfessions();
  updateScale();

  judgment.classList.add('hidden');
  judgeBtn.disabled = false;
  judgeBtn.innerHTML = '<span class="btn-icon">𓃣</span> WEIGH MY HEART <span class="btn-icon">𓃣</span>';
}

/* ─── Event Listeners ──────────────────────── */

judgeBtn.addEventListener('click', () => {
  const hasAnswers = state.confessions.some(c => c.guilty || c.denied);
  if (!hasAnswers) return;
  showJudgment();
});

resetBtn.addEventListener('click', resetAll);

/* ─── Init ─────────────────────────────────── */

renderConfessions();
updateScale();
