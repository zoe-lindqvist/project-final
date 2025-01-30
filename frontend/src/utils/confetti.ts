import confetti from "canvas-confetti";

export const triggerConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Send confetti from both sides
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.2 },
    colors: ["#9333ea", "#a855f7", "#c084fc", "#e9d5ff", "#ffffff"],
  });

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.8 },
    colors: ["#9333ea", "#a855f7", "#c084fc", "#e9d5ff", "#ffffff"],
  });

  // Send some confetti straight up
  fire(0.2, {
    spread: 60,
    decay: 0.91,
    scalar: 0.8,
    origin: { x: 0.5 },
    colors: ["#9333ea", "#a855f7", "#c084fc", "#e9d5ff", "#ffffff"],
  });

  // Finale: send confetti from the bottom
  setTimeout(() => {
    fire(0.3, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { y: 0.9, x: 0.5 },
      colors: ["#9333ea", "#a855f7", "#c084fc", "#e9d5ff", "#ffffff"],
    });
  }, 250);
};
