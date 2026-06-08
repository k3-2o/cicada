/* ============================================
   logic.js — Pure logic for Weighing of the Heart
   No DOM. No browser APIs. Testable in Node.
   ============================================ */

const CONFESSIONS = [
  { id: 1, text: "I have not deployed on the eve of the weekend" },
  { id: 2, text: "I have not committed my sins directly to main" },
  { id: 3, text: "I have not let the pipeline run red" },
  { id: 4, text: "I have not hardcoded the forbidden names in the source" },
  { id: 5, text: "I have not merged without the blessing of the council" },
  { id: 6, text: "I have not left the TODO scarabs in the code" },
  { id: 7, text: "I have not silenced the tests that speak truth" },
];

/**
 * Count how many confessions were marked guilty.
 * @param {Array} confessions
 * @returns {number}
 */
function calculateWeight(confessions) {
  return confessions.filter(c => c.guilty).length;
}

/**
 * Return judgment based on weight ratio.
 * @param {number} weight  - number of guilty confessions
 * @param {number} maxWeight - total confessions
 * @returns {{ verdict: string, title: string, icon: string, detail: string }}
 */
function getJudgment(weight, maxWeight) {
  const ratio = maxWeight > 0 ? weight / maxWeight : 0;

  if (ratio <= 0.29) {
    return {
      verdict: 'pass',
      title: 'THE HEART IS LIGHT',
      icon: '🪶',
      detail: `You have spoken truth. The Feather of Ma'at holds steady — your heart is pure. Anubis nods. You may pass through the 42 gates and into the Field of Reeds. The cycle renews.`,
    };
  }

  if (ratio <= 0.58) {
    return {
      verdict: 'heavy',
      title: 'THE HEART IS HEAVY',
      icon: '❤️‍🔥',
      detail: `The scale trembles. ${weight} sins weigh upon your heart. Ammit stirs in the shadows. You must return to the scales — face your confessions and lighten your soul before the next emergence.`,
    };
  }

  return {
    verdict: 'devoured',
    title: 'THE DEVOURER CLAIMS YOU',
    icon: '𓃣',
    detail: `Your heart, heavy with ${weight} sins, sinks below the feather. Ammit — devourer of the unworthy — lunges from the darkness. You are consumed. The 17th Gate closes. Only confession can set you free.`,
  };
}

/**
 * Set or clear a confession's plea.
 * @param {Array} confessions
 * @param {number} id
 * @param {string|null} plea - 'guilty', 'innocent', or null to unset
 * @returns {Array} new array
 */
function setPlea(confessions, id, plea) {
  return confessions.map(c => {
    if (c.id !== id) return c;

    if (plea === 'guilty') {
      return { ...c, guilty: true, denied: false };
    }
    if (plea === 'innocent') {
      return { ...c, guilty: false, denied: true };
    }
    return { ...c, guilty: false, denied: false };
  });
}

/**
 * Reset all confessions to unset.
 * @param {Array} confessions
 * @returns {Array}
 */
function resetConfessions(confessions) {
  return confessions.map(c => ({ ...c, guilty: false, denied: false }));
}

/* ─── Exports ────────────────────────────────── */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFESSIONS,
    calculateWeight,
    getJudgment,
    setPlea,
    resetConfessions,
  };
}
