import React, { useState, useEffect } from 'react';
import { Award, Flame, Play, Trophy, Sparkles, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MiniGameProps {
  loyaltyPoints: number;
  stampsCount: number;
  onAddPoints: (points: number) => void;
  onAddStamp: () => void;
  onOpenMenu: () => void;
}

type BallState = 'raw' | 'cooking' | 'golden' | 'burnt' | 'flipped';

interface TakoBall {
  id: number;
  state: BallState;
  timer: number;
}

export const MiniGame: React.FC<MiniGameProps> = ({
  loyaltyPoints,
  stampsCount,
  onAddPoints,
  onAddStamp,
  onOpenMenu
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [balls, setBalls] = useState<TakoBall[]>([]);
  const [score, setScore] = useState(0);
  const [gameMessage, setGameMessage] = useState('Flip the balls when they turn GOLDEN before they burn!');
  const [gameOver, setGameOver] = useState(false);
  const [hasWonReward, setHasWonReward] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setHasWonReward(false);
    setScore(0);
    setGameMessage('Watch the grill carefully... get ready to flip!');
    
    const initialBalls: TakoBall[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      state: 'raw',
      timer: Math.floor(Math.random() * 15) + 10 // randomized timer ticks
    }));
    setBalls(initialBalls);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setBalls((prevBalls: TakoBall[]): TakoBall[] => {
        let allFinished = true;
        const updated = prevBalls.map((ball): TakoBall => {
          if (ball.state === 'flipped' || ball.state === 'burnt') return ball;
          allFinished = false;

          const newTimer = ball.timer - 1;
          if (newTimer <= 0) {
            if (ball.state === 'raw') {
              return { ...ball, state: 'cooking' as BallState, timer: 12 };
            } else if (ball.state === 'cooking') {
              return { ...ball, state: 'golden' as BallState, timer: 15 }; // golden window
            } else if (ball.state === 'golden') {
              return { ...ball, state: 'burnt' as BallState, timer: 0 }; // missed it
            }
          }
          return { ...ball, timer: newTimer };
        });

        if (allFinished && prevBalls.length > 0) {
          setGameOver(true);
        }

        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (gameOver) {
      const correctFlips = balls.filter(b => b.state === 'flipped').length;
      if (correctFlips >= 5 && !hasWonReward) {
        setGameMessage(`🎉 SENSATIONAL MASTER FLIPPER! (${correctFlips}/6 perfect flips)`);
        setHasWonReward(true);
        onAddPoints(50);
        try {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        } catch (e) { console.error(e); }
      } else if (correctFlips > 0) {
        setGameMessage(`Nice try! You flipped ${correctFlips}/6 perfect balls. Earn 10 points!`);
        if (!hasWonReward) {
          setHasWonReward(true);
          onAddPoints(10);
        }
      } else {
        setGameMessage('Oops! The grill got too hot. Try again!');
      }
    }
  }, [gameOver, balls, hasWonReward, onAddPoints]);

  const handleFlip = (id: number) => {
    if (gameOver) return;
    setBalls(prev => prev.map(ball => {
      if (ball.id === id) {
        if (ball.state === 'golden') {
          setScore(s => s + 1);
          return { ...ball, state: 'flipped' as BallState };
        } else if (ball.state === 'cooking' || ball.state === 'raw') {
          // flipped too early
          return { ...ball, state: 'raw' as BallState };
        }
      }
      return ball;
    }));
  };

  const getBallEmoji = (state: BallState) => {
    switch (state) {
      case 'raw': return '⚪'; // batter
      case 'cooking': return '🟡'; // bubbling
      case 'golden': return '🐙'; // Perfect golden takoyaki
      case 'burnt': return '⚫'; // charcoal
      case 'flipped': return '✨'; // success
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-10 pb-24">
      
      {/* Top Welcome Title */}
      <div className="bg-gradient-to-r from-amber-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-300">
        <div>
          <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
            Customer Satisfaction & Rewards
          </span>
          <h2 className="text-3xl font-black font-heading mt-2">Tako Craze Rewards Club 🐙</h2>
          <p className="text-white/90 text-sm mt-1">
            Play the master flipper challenge or collect loyalty stamps for free premium boxes!
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md flex-shrink-0">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-amber-200 block">My Pts</span>
            <span className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{loyaltyPoints}</span>
            </span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-amber-200 block">Stamps</span>
            <span className="text-2xl font-black text-white">{stampsCount} / 8</span>
          </div>
        </div>
      </div>

      {/* Section 1: Loyalty Stamp Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold font-heading text-neutral-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span>Buy 8 Boxes, Get 1 Free Feast!</span>
            </h3>
            <p className="text-xs text-neutral-500">Each party box order adds 1 stamp to your Osaka passport</p>
          </div>
          <button
            onClick={onAddStamp}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold px-4 py-2 rounded-2xl text-xs shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-rose-800" />
            <span>Simulate Order Stamp (+1)</span>
          </button>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isStamped = idx < stampsCount;
            const isTarget = idx === 7;

            return (
              <div 
                key={idx} 
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 relative transition-all ${
                  isStamped 
                    ? 'bg-gradient-to-br from-amber-400 to-rose-400 border-rose-500 text-white shadow-md transform rotate-1 scale-105' 
                    : isTarget
                      ? 'bg-rose-50 border-dashed border-rose-400 text-rose-600 animate-pulse'
                      : 'bg-white border-neutral-200 text-neutral-300'
                }`}
              >
                {isStamped ? (
                  <>
                    <span className="text-3xl animate-bounce">🐙</span>
                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1 bg-black/20 px-1 rounded">Stamped</span>
                  </>
                ) : isTarget ? (
                  <>
                    <Trophy className="w-8 h-8 text-rose-500" />
                    <span className="text-[9px] font-bold text-rose-700 mt-1 uppercase">Free Box!</span>
                  </>
                ) : (
                  <>
                    <Star className="w-6 h-6 text-neutral-300" />
                    <span className="text-[10px] font-bold mt-1">{idx + 1}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {stampsCount >= 8 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎁</span>
              <div>
                <h4 className="font-black text-base">You Unlocked a FREE Party Box!</h4>
                <p className="text-xs text-white/90">Claim your 12pcs premium assorted box on your next checkout.</p>
              </div>
            </div>
            <button
              onClick={onOpenMenu}
              className="bg-white text-emerald-800 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              Redeem Now
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Takoyaki Master Flipper Mini Game */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Interactive Chef Simulator</span>
            </div>
            <h3 className="text-xl font-bold font-heading text-neutral-900">Takoyaki Live Grill Challenge</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Flip the balls exactly when they turn golden (🐙) to win +50 points!</p>
          </div>

          {!isPlaying && (
            <button
              onClick={startGame}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-rose-500/20 flex items-center space-x-2 transition-transform active:scale-95 text-xs"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{gameOver ? 'Play Again' : 'Start Sizzling'}</span>
            </button>
          )}
        </div>

        {/* Game Area */}
        <div className="bg-neutral-900 rounded-3xl p-6 border-4 border-neutral-700 shadow-2xl relative overflow-hidden">
          
          {/* Iron Grill Texture Lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {/* Top Score Bar */}
          <div className="relative z-10 flex items-center justify-between bg-black/50 p-3 rounded-2xl mb-6 text-white border border-white/10">
            <span className="text-xs font-semibold text-neutral-300">{gameMessage}</span>
            <div className="flex items-center space-x-4">
              {isPlaying && <span className="text-xs text-amber-400 font-bold animate-pulse">🔥 Grill Hot</span>}
              <span className="text-xs font-bold bg-rose-600 px-3 py-1 rounded-xl">Score: {score}</span>
            </div>
          </div>

          {/* Grill Grid */}
          {!isPlaying ? (
            <div className="py-16 text-center text-white space-y-4">
              <div className="text-6xl animate-bounce">🥢</div>
              <h4 className="text-xl font-bold font-heading">Ready to test your reflexes?</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Real takoyaki chefs in Dotonbori flip thousands of balls a day. Tap the balls instantly when they look like 🐙 before they turn ⚫!
              </p>
              <button
                onClick={startGame}
                className="bg-amber-400 hover:bg-amber-300 text-neutral-900 font-black py-3 px-8 rounded-full shadow-lg shadow-amber-500/30 transition-transform active:scale-95 text-sm"
              >
                Start Flipper Game
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6 max-w-md mx-auto relative z-10">
              {balls.map((ball) => {
                const isGolden = ball.state === 'golden';
                const isBurnt = ball.state === 'burnt';
                const isFlipped = ball.state === 'flipped';

                return (
                  <button
                    key={ball.id}
                    onClick={() => handleFlip(ball.id)}
                    disabled={gameOver || isFlipped || isBurnt}
                    className={`aspect-square rounded-full flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-2xl border-4 transition-all duration-200 transform ${
                      isGolden 
                        ? 'bg-amber-500 border-amber-300 animate-bounce cursor-pointer scale-110 shadow-amber-500/50'
                        : isBurnt
                          ? 'bg-neutral-800 border-neutral-900 grayscale opacity-50'
                          : isFlipped
                            ? 'bg-emerald-500 border-emerald-300 scale-105 shadow-emerald-500/50'
                            : 'bg-amber-100/20 border-amber-100/40'
                    }`}
                  >
                    <span className="select-none">{getBallEmoji(ball.state)}</span>
                    <span className="text-[9px] font-black uppercase text-white tracking-widest mt-1 bg-black/60 px-1.5 py-0.5 rounded-full">
                      {ball.state}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {gameOver && isPlaying && (
            <div className="mt-6 text-center relative z-10">
              <button
                onClick={startGame}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg flex items-center space-x-2 mx-auto text-xs uppercase tracking-wider"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Play Next Round</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
