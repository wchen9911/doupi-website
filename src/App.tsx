import { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Swords, Star, Zap, Brain, Trophy, RotateCcw, ChevronRight, Lock, Coins, Timer, Heart } from 'lucide-react';
import './App.css';

// --- Types ---
type GradeRange = string;
type GameType = 'Multiplication' | 'Fraction' | 'Decimal' | 'PEMDAS' | 'Algebra';

interface GameInfo {
  id: GameType;
  title: string;
  grades: GradeRange;
  icon: any;
  color: string;
}

interface MathQuestion {
  id: string;
  type: 'Multiplication' | 'Division';
  question: string;
  answer: string;
  correctCount: number;
  incorrectCount: number;
}

const GAMES: GameInfo[] = [
  { id: 'Multiplication', title: 'Mul & Div', grades: 'Grades 2-4', icon: Zap, color: 'bg-yellow-400' },
  { id: 'Fraction', title: 'Fraction Quest', grades: 'Grades 4-6', icon: Star, color: 'bg-blue-400' },
  { id: 'Decimal', title: 'Decimal Dash', grades: 'Grades 4-6', icon: Brain, color: 'bg-green-400' },
  { id: 'PEMDAS', title: 'PEMDAS Puzzle', grades: 'Grades 5-6', icon: Swords, color: 'bg-red-500' },
  { id: 'Algebra', title: 'Algebra Arena', grades: 'Grades 6+', icon: Shield, color: 'bg-purple-500' },
];

const STORAGE_KEY = 'owen_math_unlock_level';
const MULTIPLICATION_STATE_KEY = 'owen_math_multiplication_state_v2';
const VERSION = "v2.0.0";
const TIME_LIMIT = 10;

// --- Math Utilities ---
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateAllMultiplicationQuestions = (): MathQuestion[] => {
  const questions: MathQuestion[] = [];
  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 12; j++) {
      questions.push({
        id: `mul-${i}-${j}`,
        type: 'Multiplication',
        question: `${i} × ${j}`,
        answer: (i * j).toString(),
        correctCount: 0,
        incorrectCount: 0,
      });
      questions.push({
        id: `div-${i * j}-${i}`,
        type: 'Division',
        question: `${i * j} ÷ ${i}`,
        answer: j.toString(),
        correctCount: 0,
        incorrectCount: 0,
      });
    }
  }
  return questions;
};

const isQuestionSatisfied = (q: MathQuestion) => q.correctCount >= q.incorrectCount + 1;

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const simplifyFraction = (n: number, d: number): [number, number] => {
  const common = Math.abs(gcd(n, d));
  return [n / common, d / common];
};

const generateProblem = (type: GameType) => {
  let prob: any;
  switch (type) {
    case 'Multiplication': return null;
    case 'Fraction': {
      const den = getRandomInt(2, 8);
      let n1 = getRandomInt(1, den);
      let n2 = getRandomInt(1, den);
      const op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];
      const resN = op === '+' ? n1 + n2 : n1 - n2;
      const [sn, sd] = simplifyFraction(resN, den);
      prob = { question: `${n1}/${den} ${op} ${n2}/${den}`, answer: `${sn}/${sd}`, rawAnswer: `${resN}/${den}` };
      break;
    }
    case 'Decimal': {
      const a = (getRandomInt(10, 100) / 10).toFixed(1);
      const b = (getRandomInt(10, 100) / 10).toFixed(1);
      const op = Math.random() > 0.5 ? '+' : '-';
      const ans = op === '+' ? parseFloat(a) + parseFloat(b) : parseFloat(a) - parseFloat(b);
      prob = { question: `${a} ${op} ${b}`, answer: ans.toFixed(1) };
      break;
    }
    case 'PEMDAS': {
      const a = getRandomInt(2, 10);
      const b = getRandomInt(2, 10);
      const c = getRandomInt(2, 5);
      const useParen = Math.random() > 0.5;
      if (useParen) {
        prob = { question: `(${a} + ${b}) × ${c}`, answer: ((a + b) * c).toString() };
      } else {
        prob = { question: `${a} + ${b} × ${c}`, answer: (a + b * c).toString() };
      }
      break;
    }
    case 'Algebra': {
      const x = getRandomInt(1, 10);
      const a = getRandomInt(2, 5);
      const b = getRandomInt(1, 15);
      const c = a * x + b;
      prob = { question: `${a}x + ${b} = ${c}`, answer: x.toString() };
      break;
    }
    default:
      prob = { question: "1 + 1", answer: "2" };
  }
  return prob;
};

// --- Components ---

interface BattleUIProps {
  gameId: GameType;
  problem: any;
  feedback: 'idle' | 'correct' | 'wrong';
  score: number;
  progress: number;
  totalProgress?: number;
  timeLeft: number;
  isGameOver: boolean;
  onExit: () => void;
  onAnswer: (answer: string) => void;
  totalTimeLimit?: number;
}

function BattleUI({ gameId, problem, feedback, score, progress, totalProgress = 20, timeLeft, isGameOver, onExit, onAnswer, totalTimeLimit = TIME_LIMIT }: BattleUIProps) {
  const [inputValue, setInputValue] = useState('');
  const [isJumping, setIsJumping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedback === 'idle' && !isGameOver) {
      setInputValue('');
      inputRef.current?.focus();
    }
  }, [feedback, isGameOver, problem.question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== 'idle' || isGameOver || !inputValue.trim()) return;
    setIsJumping(true);
    onAnswer(inputValue.trim());
    setTimeout(() => setIsJumping(null as any), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col sky-bg pixel-font overflow-hidden">
      {/* HUD */}
      <div className="p-8 flex justify-between items-start text-white text-xl z-20">
        <div>
          <p className="mb-2">OWEN</p>
          <p>{score.toString().padStart(6, '0')}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-2">COINS</p>
          <p className="flex items-center gap-2">
            <Coins className="text-yellow-400" /> ×{progress.toString().padStart(3, '0')}
          </p>
        </div>
        <div className="text-center">
          <p className="mb-2">WORLD</p>
          <p>1-{Math.floor(progress / 50) + 1}</p>
        </div>
        <div className="text-right">
          <p className="mb-2">TIME</p>
          <p className={timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}>{timeLeft}</p>
        </div>
      </div>

      {/* Decorative Clouds */}
      <div className="absolute top-20 left-0 w-full h-40 pointer-events-none opacity-50 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute cloud-animate" style={{ top: `${i * 40}px`, animationDelay: `${i * 15}s` }}>
             <div className="w-24 h-12 bg-white rounded-full relative shadow-lg">
                <div className="absolute -top-4 left-4 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute -top-4 right-4 w-12 h-12 bg-white rounded-full"></div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center pb-32">
        {/* The Problem */}
        <div className={`mb-12 transform transition-all ${feedback === 'wrong' ? 'shake' : ''}`}>
           <div className="bg-white border-8 border-black p-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] text-center relative">
              <p className="text-gray-400 text-[10px] mb-4 uppercase tracking-tighter">Question Block</p>
              <h2 className="text-4xl md:text-6xl text-black leading-tight">{problem.question}</h2>
              {feedback === 'correct' && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 coin-animate">
                   <Coins size={60} className="text-yellow-400 fill-yellow-400" />
                </div>
              )}
           </div>
        </div>

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm px-4">
           <input
             ref={inputRef}
             type="text"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             disabled={feedback !== 'idle' || isGameOver}
             autoFocus
             placeholder="???"
             className="w-full bg-white border-8 border-black p-6 text-4xl text-center text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none mb-8 placeholder:opacity-20"
           />
           <button
             type="submit"
             disabled={feedback !== 'idle' || isGameOver || !inputValue.trim()}
             className="mario-brick text-white text-xl px-12 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none hover:-translate-y-1 transition-all uppercase"
           >
             SUBMIT
           </button>
        </form>

        {/* Owen Character */}
        <div className={`absolute bottom-32 transition-all duration-300 ${isJumping ? 'mario-jump' : ''}`}>
           <div className="w-16 h-20 bg-red-600 border-4 border-black relative rounded-sm flex items-center justify-center">
              <div className="absolute top-0 w-full h-8 bg-red-800"></div>
              <div className="absolute top-4 w-12 h-8 bg-pink-200 rounded-sm"></div>
              <div className="absolute bottom-4 w-full h-8 bg-blue-600"></div>
              <span className="text-white text-xs z-10">O</span>
           </div>
        </div>
      </div>

      {/* Ground */}
      <div className="h-32 w-full mario-ground flex items-start justify-center pt-2">
         <div className="flex gap-4 opacity-50">
            {[...Array(20)].map((_, i) => <div key={i} className="w-10 h-10 border-4 border-black/20"></div>)}
         </div>
      </div>

      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="fixed bottom-4 right-4 p-4 bg-green-500 border-4 border-black text-white hover:bg-green-400 transition-colors z-30"
      >
        <RotateCcw size={24} />
      </button>
    </div>
  );
}

function GameCard({ game, onSelect, isLocked }: { game: GameInfo; onSelect: (id: GameType) => void; isLocked: boolean }) {
  return (
    <div 
      onClick={() => !isLocked && onSelect(game.id)}
      className={`mario-card relative ${isLocked ? 'locked' : 'cursor-pointer group'}`}
    >
      <div className={`relative bg-white border-8 border-black p-6 flex flex-col items-center text-center h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all`}>
        <div className={`p-4 rounded-lg ${isLocked ? 'bg-gray-400' : 'mario-question-block'} border-4 border-black mb-4`}>
          {isLocked ? <Lock size={40} className="text-black" /> : <game.icon size={40} className="text-black" />}
        </div>
        <h3 className="text-lg font-black text-black mb-2 uppercase pixel-font tracking-tighter leading-tight">{game.title}</h3>
        <p className="text-[10px] text-gray-400 uppercase pixel-font">{game.grades}</p>
      </div>
    </div>
  );
}

function MultiplicationGame({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const gameId = 'Multiplication';
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [questions, setQuestions] = useState<MathQuestion[]>(() => {
    const saved = localStorage.getItem(MULTIPLICATION_STATE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return generateAllMultiplicationQuestions();
      }
    }
    return generateAllMultiplicationQuestions();
  });

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<any>(null);

  const pickNextQuestion = useCallback((qs: MathQuestion[]) => {
    const remaining = qs.filter(q => !isQuestionSatisfied(q));
    if (remaining.length === 0) return null;
    return remaining[getRandomInt(0, remaining.length - 1)];
  }, []);

  useEffect(() => {
    setProgress(questions.filter(isQuestionSatisfied).length);
  }, []);

  const startBattle = (seconds: number) => {
    setDifficulty(seconds);
    setTimeLeft(seconds);
    const next = pickNextQuestion(questions);
    if (next) {
      setCurrentQuestion(next);
    } else {
      setIsGameOver(true);
      onComplete();
    }
  };

  const moveToNext = (updatedQs: MathQuestion[]) => {
    const next = pickNextQuestion(updatedQs);
    if (next) {
      setCurrentQuestion(next);
      setTimeLeft(difficulty || 10);
      setFeedback('idle');
    } else {
      setIsGameOver(true);
      setTimeout(() => onComplete(), 1200);
    }
  };

  const handleTimeOut = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback('wrong');

    setQuestions(prev => {
      const updated = prev.map(q => q.id === currentQuestion.id ? { ...q, incorrectCount: q.incorrectCount + 1 } : q);
      localStorage.setItem(MULTIPLICATION_STATE_KEY, JSON.stringify(updated));
      setTimeout(() => moveToNext(updated), 800);
      return updated;
    });
  }, [currentQuestion, pickNextQuestion, onComplete, difficulty]);

  useEffect(() => {
    if (!isGameOver && feedback === 'idle' && currentQuestion && difficulty !== null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameOver, feedback, handleTimeOut, currentQuestion, difficulty]);

  const handleAnswer = (selectedOption: string) => {
    if (feedback !== 'idle' || isGameOver || !currentQuestion) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const isCorrect = selectedOption.trim() === currentQuestion.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 100);

    setQuestions(prev => {
      const updated = prev.map(q => {
        if (q.id === currentQuestion.id) {
          return isCorrect 
            ? { ...q, correctCount: q.correctCount + 1 } 
            : { ...q, incorrectCount: q.incorrectCount + 1 };
        }
        return q;
      });
      localStorage.setItem(MULTIPLICATION_STATE_KEY, JSON.stringify(updated));
      setProgress(updated.filter(isQuestionSatisfied).length);
      setTimeout(() => moveToNext(updated), 800);
      return updated;
    });
  };

  if (difficulty === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sky-bg pixel-font">
        <div className="w-full max-w-md bg-white border-8 border-black p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] text-center">
          <h2 className="text-2xl font-black text-black mb-4 uppercase leading-tight">WORLD SELECTION</h2>
          <p className="text-gray-500 text-[10px] mb-8 uppercase leading-none">Choose Owen's speed!</p>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'WORLD 1-1 (15s)', time: 15, color: 'bg-green-500' },
              { label: 'WORLD 1-2 (10s)', time: 10, color: 'bg-yellow-500' },
              { label: 'WORLD 1-3 (5s)', time: 5, color: 'bg-orange-600' },
              { label: 'WORLD 1-4 (3s)', time: 3, color: 'bg-red-700' }
            ].map((mode) => (
              <button
                key={mode.time}
                onClick={() => startBattle(mode.time)}
                className={`${mode.color} text-white text-xs py-6 rounded-sm border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase leading-none`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion && !isGameOver) return null;

  return (
    <BattleUI 
      gameId={gameId} 
      problem={currentQuestion || { question: 'LEVEL CLEAR!', options: [] }} 
      feedback={feedback} 
      score={score} 
      progress={progress} 
      totalProgress={questions.length}
      timeLeft={timeLeft} 
      isGameOver={isGameOver} 
      onExit={onExit} 
      onAnswer={handleAnswer} 
      totalTimeLimit={difficulty}
    />
  );
}

function FractionGame({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const gameId = 'Fraction';
  const [problem, setProblem] = useState(() => generateProblem(gameId));
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<any>(null);

  const handleTimeOut = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback('wrong');
    setTimeout(() => {
      setProblem(generateProblem(gameId));
      setTimeLeft(10);
      setFeedback('idle');
    }, 800);
  }, [gameId]);

  useEffect(() => {
    if (!isGameOver && feedback === 'idle') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameOver, feedback, handleTimeOut]);

  const handleAnswer = (selectedOption: string) => {
    if (feedback !== 'idle' || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = selectedOption.trim() === problem.answer || (problem.rawAnswer && selectedOption.trim() === problem.rawAnswer);
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (newProgress >= 20) {
        setIsGameOver(true);
        setTimeout(() => onComplete(), 1200);
      } else {
        setTimeout(() => {
          setProblem(generateProblem(gameId));
          setTimeLeft(10);
          setFeedback('idle');
        }, 800);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setTimeLeft(10);
      }, 800);
    }
  };

  return <BattleUI gameId={gameId} problem={problem} feedback={feedback} score={score} progress={progress} timeLeft={timeLeft} isGameOver={isGameOver} onExit={onExit} onAnswer={handleAnswer} />;
}

function DecimalGame({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const gameId = 'Decimal';
  const [problem, setProblem] = useState(() => generateProblem(gameId));
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<any>(null);

  const handleTimeOut = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback('wrong');
    setTimeout(() => {
      setProblem(generateProblem(gameId));
      setTimeLeft(10);
      setFeedback('idle');
    }, 800);
  }, [gameId]);

  useEffect(() => {
    if (!isGameOver && feedback === 'idle') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameOver, feedback, handleTimeOut]);

  const handleAnswer = (selectedOption: string) => {
    if (feedback !== 'idle' || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = selectedOption.trim() === problem.answer;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (newProgress >= 20) {
        setIsGameOver(true);
        setTimeout(() => onComplete(), 1200);
      } else {
        setTimeout(() => {
          setProblem(generateProblem(gameId));
          setTimeLeft(10);
          setFeedback('idle');
        }, 800);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setTimeLeft(10);
      }, 800);
    }
  };

  return <BattleUI gameId={gameId} problem={problem} feedback={feedback} score={score} progress={progress} timeLeft={timeLeft} isGameOver={isGameOver} onExit={onExit} onAnswer={handleAnswer} />;
}

function PEMDASGame({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const gameId = 'PEMDAS';
  const [problem, setProblem] = useState(() => generateProblem(gameId));
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<any>(null);

  const handleTimeOut = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback('wrong');
    setTimeout(() => {
      setProblem(generateProblem(gameId));
      setTimeLeft(10);
      setFeedback('idle');
    }, 800);
  }, [gameId]);

  useEffect(() => {
    if (!isGameOver && feedback === 'idle') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameOver, feedback, handleTimeOut]);

  const handleAnswer = (selectedOption: string) => {
    if (feedback !== 'idle' || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = selectedOption.trim() === problem.answer;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (newProgress >= 20) {
        setIsGameOver(true);
        setTimeout(() => onComplete(), 1200);
      } else {
        setTimeout(() => {
          setProblem(generateProblem(gameId));
          setTimeLeft(10);
          setFeedback('idle');
        }, 800);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setTimeLeft(10);
      }, 800);
    }
  };

  return <BattleUI gameId={gameId} problem={problem} feedback={feedback} score={score} progress={progress} timeLeft={timeLeft} isGameOver={isGameOver} onExit={onExit} onAnswer={handleAnswer} />;
}

function AlgebraGame({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const gameId = 'Algebra';
  const [problem, setProblem] = useState(() => generateProblem(gameId));
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<any>(null);

  const handleTimeOut = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback('wrong');
    setTimeout(() => {
      setProblem(generateProblem(gameId));
      setTimeLeft(10);
      setFeedback('idle');
    }, 800);
  }, [gameId]);

  useEffect(() => {
    if (!isGameOver && feedback === 'idle') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameOver, feedback, handleTimeOut]);

  const handleAnswer = (selectedOption: string) => {
    if (feedback !== 'idle' || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = selectedOption.trim() === problem.answer;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (newProgress >= 20) {
        setIsGameOver(true);
        setTimeout(() => onComplete(), 1200);
      } else {
        setTimeout(() => {
          setProblem(generateProblem(gameId));
          setTimeLeft(10);
          setFeedback('idle');
        }, 800);
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setTimeLeft(10);
      }, 800);
    }
  };

  return <BattleUI gameId={gameId} problem={problem} feedback={feedback} score={score} progress={progress} timeLeft={timeLeft} isGameOver={isGameOver} onExit={onExit} onAnswer={handleAnswer} />;
}

export default function App() {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(0);

  useEffect(() => {
    const storedLevel = localStorage.getItem(STORAGE_KEY);
    if (storedLevel) {
      setUnlockedLevel(parseInt(storedLevel, 10));
    }
  }, []);

  const handleComplete = useCallback(() => {
    const currentIndex = GAMES.findIndex(g => g.id === activeGame);
    if (currentIndex === unlockedLevel && unlockedLevel < GAMES.length - 1) {
      const newLevel = unlockedLevel + 1;
      setUnlockedLevel(newLevel);
      localStorage.setItem(STORAGE_KEY, newLevel.toString());
    }
    setActiveGame(null);
  }, [activeGame, unlockedLevel]);

  return (
    <div className="min-h-screen sky-bg pixel-font pb-20 selection:bg-red-600 selection:text-white relative">
      {/* Moving Background Clouds for Home Screen */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute cloud-animate" style={{ top: `${i * 10}%`, animationDelay: `${i * 10}s`, opacity: 0.3 }}>
             <div className="w-32 h-16 bg-white rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Branding Banner */}
      <div className="bg-black border-b-4 border-white py-2 overflow-hidden whitespace-nowrap relative z-10">
        <div className="animate-marquee inline-block">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white text-xs uppercase mx-8 tracking-tighter">
              ★ SUPER OWEN BROS ★ SELECT START ★ OWEN ONLY ★
            </span>
          ))}
        </div>
      </div>

      <header className="pt-20 pb-20 px-6 text-center relative z-10">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-black border-4 border-white translate-x-2 translate-y-2"></div>
          <div className="relative bg-[#e76d42] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-4xl md:text-6xl text-white leading-tight uppercase tracking-tighter">
              SUPER <br /> OWEN HUB
            </h1>
          </div>
        </div>
        <div className="mt-8">
           <span className="bg-white text-black px-6 py-2 border-4 border-black text-xs uppercase animate-pulse">Press Any Card!</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid-5-cols">
          {GAMES.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onSelect={setActiveGame} 
              isLocked={index > unlockedLevel}
            />
          ))}
        </div>
      </main>

      {activeGame === 'Multiplication' && (
        <MultiplicationGame 
          onExit={() => setActiveGame(null)} 
          onComplete={handleComplete}
        />
      )}
      {activeGame === 'Fraction' && (
        <FractionGame 
          onExit={() => setActiveGame(null)} 
          onComplete={handleComplete}
        />
      )}
      {activeGame === 'Decimal' && (
        <DecimalGame 
          onExit={() => setActiveGame(null)} 
          onComplete={handleComplete}
        />
      )}
      {activeGame === 'PEMDAS' && (
        <PEMDASGame 
          onExit={() => setActiveGame(null)} 
          onComplete={handleComplete}
        />
      )}
      {activeGame === 'Algebra' && (
        <AlgebraGame 
          onExit={() => setActiveGame(null)} 
          onComplete={handleComplete}
        />
      )}

      {/* Footer Decoration */}
      <footer className="mt-32 border-t-8 border-black mario-ground py-20 px-6 relative">
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-24 h-40 mario-pipe mx-auto mb-8"></div>
            <p className="text-white text-xl uppercase mb-4 tracking-tighter">THANK YOU OWEN!</p>
            <p className="text-white text-xs uppercase tracking-tighter">BUT THE ANSWERS ARE IN ANOTHER CASTLE!</p>
            <p className="text-white/50 text-[10px] mt-8 uppercase tracking-widest italic">{VERSION}</p>
         </div>
      </footer>
    </div>
  );
}
