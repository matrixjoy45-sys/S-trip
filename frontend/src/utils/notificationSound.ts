// Notification sound using Web Audio API — no external files needed!

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Plays a pleasant notification chime
export function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Two-tone chime (like a doorbell)
    const notes = [830, 1050]; // E5 and C6 approximately
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.2);
      
      gain.gain.setValueAtTime(0, now + i * 0.2);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.2 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.5);
      
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.5);
    });
  } catch (e) {
    console.warn("Could not play notification sound:", e);
  }
}

// Plays an urgent alert sound (for "starting now" notifications)
export function playAlertSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Three rapid beeps
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "square";
      osc.frequency.setValueAtTime(880, now + i * 0.15);
      
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);
      
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.12);
    }
  } catch (e) {
    console.warn("Could not play alert sound:", e);
  }
}
