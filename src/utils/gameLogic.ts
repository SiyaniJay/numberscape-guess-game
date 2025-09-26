import { GuessResult } from "@/types/game";

export function calculateHeatLevel(guess: number, target: number, span: number): GuessResult['heatLevel'] {
  const diff = Math.abs(guess - target);
  
  if (diff === 0) return 'blazing';
  if (diff <= Math.max(2, span * 0.02)) return 'blazing';
  if (diff <= span * 0.05) return 'hot';
  if (diff <= span * 0.10) return 'warm';
  if (diff <= span * 0.25) return 'cool';
  return 'ice_cold';
}

export function getHeatMessage(heatLevel: GuessResult['heatLevel']): string {
  const messages = {
    blazing: 'BULLSEYE! 💥',
    hot: 'Blazing hot! 🔥',
    warm: 'Getting warm! 🌡️',
    cool: 'Cool breeze... 🌬️',
    ice_cold: 'Ice cold! ❄️'
  };
  return messages[heatLevel];
}

export function getRandomFeedback(result: 'too_low' | 'too_high'): string {
  const tooLowMessages = [
    "Too low—aim higher ⬆️",
    "Not quite. Go bigger 📈",
    "Close… but below the mark 📉",
    "Think bigger! 🚀",
    "Reach for the stars! ⭐"
  ];
  
  const tooHighMessages = [
    "Too high—dial it back ⬇️",
    "Overshot! Try smaller 🎯",
    "Close… but above the mark 📈",
    "Scale it down! 📉",
    "Come back to earth! 🌍"
  ];
  
  const messages = result === 'too_low' ? tooLowMessages : tooHighMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

export function generateHint(target: number, range: [number, number]): string {
  const [lo, hi] = range;
  const hints = [
    // Parity hint
    `The number is ${target % 2 === 0 ? 'even' : 'odd'}.`,
    
    // Multiple hint
    (() => {
      for (const m of [7, 5, 3]) {
        if (target % m === 0) {
          return `It's a multiple of ${m}.`;
        }
      }
      return "It's not a neat multiple of 3, 5, or 7.";
    })(),
    
    // Range hint
    (() => {
      const window = Math.max(5, Math.floor((hi - lo) / 6));
      const lowBound = Math.max(lo, target - window);
      const highBound = Math.min(hi, target + window);
      return `It lies between ${lowBound} and ${highBound}.`;
    })(),
    
    // Digits hint
    (() => {
      const digitSum = target.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      return `The sum of its digits is ${digitSum}.`;
    })(),
  ];
  
  return hints[Math.floor(Math.random() * hints.length)];
}

export function getEncouragingMessage(): string {
  const messages = [
    "Your move—trust your gut! 🎯",
    "What's your number, legend? 🌟",
    "Let's see that game sense! 🧠",
    "Time to make your mark! ⚡",
    "Show them what you've got! 💪",
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}