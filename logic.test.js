/* ============================================
   logic.test.js — Tests for Weighing of the Heart
   ============================================ */

const {
  CONFESSIONS,
  calculateWeight,
  getJudgment,
  setPlea,
  resetConfessions,
} = require('./logic.js');

/* ─── calculateWeight ──────────────────────── */

describe('calculateWeight', () => {
  test('returns 0 when no confessions are guilty', () => {
    const confessions = [
      { id: 1, guilty: false, denied: true },
      { id: 2, guilty: false, denied: false },
    ];
    expect(calculateWeight(confessions)).toBe(0);
  });

  test('counts guilty confessions', () => {
    const confessions = [
      { id: 1, guilty: true, denied: false },
      { id: 2, guilty: false, denied: true },
      { id: 3, guilty: true, denied: false },
    ];
    expect(calculateWeight(confessions)).toBe(2);
  });

  test('returns 0 for empty array', () => {
    expect(calculateWeight([])).toBe(0);
  });

  test('returns length when all are guilty', () => {
    const confessions = [
      { id: 1, guilty: true, denied: false },
      { id: 2, guilty: true, denied: false },
    ];
    expect(calculateWeight(confessions)).toBe(2);
  });
});

/* ─── getJudgment ──────────────────────────── */

describe('getJudgment', () => {
  test('returns pass when ratio <= 0.28', () => {
    expect(getJudgment(0, 7).verdict).toBe('pass');
    expect(getJudgment(1, 7).verdict).toBe('pass');
    expect(getJudgment(2, 7).verdict).toBe('pass');
  });

  test('returns heavy when 0.28 < ratio <= 0.57', () => {
    expect(getJudgment(3, 7).verdict).toBe('heavy');
    expect(getJudgment(4, 7).verdict).toBe('heavy');
  });

  test('returns devoured when ratio > 0.57', () => {
    expect(getJudgment(5, 7).verdict).toBe('devoured');
    expect(getJudgment(6, 7).verdict).toBe('devoured');
    expect(getJudgment(7, 7).verdict).toBe('devoured');
  });

  test('passes with zero weight', () => {
    const result = getJudgment(0, 7);
    expect(result.title).toBe('THE HEART IS LIGHT');
    expect(result.icon).toBe('🪶');
  });

  test('handles maxWeight of 0 without crashing', () => {
    const result = getJudgment(0, 0);
    expect(result.verdict).toBe('pass');
  });

  test('includes weight count in heavy verdict detail', () => {
    const result = getJudgment(4, 7);
    expect(result.detail).toContain('4');
  });

  test('includes weight count in devoured verdict detail', () => {
    const result = getJudgment(7, 7);
    expect(result.detail).toContain('7');
  });
});

/* ─── setPlea ──────────────────────────────── */

describe('setPlea', () => {
  const base = [
    { id: 1, guilty: false, denied: false, text: 'test a' },
    { id: 2, guilty: false, denied: false, text: 'test b' },
  ];

  test('sets a confession to guilty', () => {
    const updated = setPlea(base, 1, 'guilty');
    expect(updated[0].guilty).toBe(true);
    expect(updated[0].denied).toBe(false);
  });

  test('sets a confession to denied', () => {
    const updated = setPlea(base, 2, 'innocent');
    expect(updated[1].guilty).toBe(false);
    expect(updated[1].denied).toBe(true);
  });

  test('unsets a confession with null plea', () => {
    const withGuilty = setPlea(base, 1, 'guilty');
    const reset = setPlea(withGuilty, 1, null);
    expect(reset[0].guilty).toBe(false);
    expect(reset[0].denied).toBe(false);
  });

  test('does not mutate the original array', () => {
    const original = [...base];
    setPlea(base, 1, 'guilty');
    expect(original[0].guilty).toBe(false);
  });

  test('does not affect other confessions', () => {
    const updated = setPlea(base, 1, 'guilty');
    expect(updated[1].guilty).toBe(false);
    expect(updated[1].denied).toBe(false);
  });
});

/* ─── resetConfessions ─────────────────────── */

describe('resetConfessions', () => {
  test('clears all guilty and denied flags', () => {
    const dirty = [
      { id: 1, guilty: true, denied: false },
      { id: 2, guilty: false, denied: true },
      { id: 3, guilty: true, denied: false },
    ];
    const clean = resetConfessions(dirty);
    clean.forEach(c => {
      expect(c.guilty).toBe(false);
      expect(c.denied).toBe(false);
    });
  });

  test('handles already clean array', () => {
    const clean = resetConfessions([
      { id: 1, guilty: false, denied: false },
    ]);
    expect(clean[0].guilty).toBe(false);
  });

  test('does not mutate the original array', () => {
    const original = [
      { id: 1, guilty: true, denied: false },
    ];
    resetConfessions(original);
    expect(original[0].guilty).toBe(true);
  });
});

/* ─── CONFESSIONS constant ─────────────────── */

describe('CONFESSIONS', () => {
  test('has exactly 7 confessions', () => {
    expect(CONFESSIONS).toHaveLength(7);
  });

  test('each confession has id and text', () => {
    CONFESSIONS.forEach(c => {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('text');
      expect(typeof c.text).toBe('string');
    });
  });
});
