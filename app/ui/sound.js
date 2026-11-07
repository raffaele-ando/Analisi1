// Suoni brevi di feedback (WebAudio, nessun file). Partono solo dopo un'interazione.
let ctx = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  return ctx;
}
function tone(freq, start, dur, type = 'sine', gain = 0.08) {
  const a = ac();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, a.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, a.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + start);
  o.stop(a.currentTime + start + dur + 0.02);
}
export const sound = {
  enabled: true,
  ok() {
    if (!this.enabled) return;
    try {
      tone(660, 0, 0.12, 'triangle');
      tone(990, 0.09, 0.18, 'triangle');
    } catch (e) {}
  },
  ko() {
    if (!this.enabled) return;
    try {
      tone(220, 0, 0.18, 'sawtooth', 0.04);
      tone(180, 0.12, 0.22, 'sawtooth', 0.035);
    } catch (e) {}
  },
  done() {
    if (!this.enabled) return;
    try {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.07));
    } catch (e) {}
  },
};
