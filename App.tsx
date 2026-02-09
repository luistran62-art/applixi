import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameState, Envelope, EnvelopeContent } from './types';
import { MAX_OPENS, generateEnvelopes, DEFAULT_QUESTIONS, DEFAULT_REWARDS, MUSIC_PLAYLIST, ENVELOPE_DECORATIONS } from './constants';
import { playSound } from './utils/audio';
import { saveScore } from './utils/storage';
import { EnvelopeItem } from './components/Envelope';
import { ResultModal } from './components/ResultModal';
import { SuspenseModal } from './components/SuspenseModal';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Trophy, RefreshCw, User, Star, Settings, Volume2, VolumeX, SkipForward, PlayCircle } from 'lucide-react';

// --- CUSTOM SVG COMPONENT: DETAILED GOD OF WEALTH TREE ---
const GodOfWealthTreeSVG = () => {
  // Generate a dense canopy of gold coins and leaves
  const canopyItems = useMemo(() => {
    const items = [];
    // Increase density: 500 items
    for (let i = 0; i < 500; i++) {
       // Distribution: Oval shape, denser in middle
       const r = Math.pow(Math.random(), 0.8) * 350; // Max radius 350
       const theta = Math.random() * 2 * Math.PI;
       
       // Squeeze Y to make it an oval canopy
       const cx = 400 + r * Math.cos(theta);
       const cy = 300 + r * Math.sin(theta) * 0.7; 

       const size = 8 + Math.random() * 12;
       const isCoin = Math.random() > 0.3; // 70% are coins, 30% leaves

       items.push({
         cx, cy, size,
         isCoin,
         // Varying shades of gold/orange
         fill: ['#FFD700', '#FFC107', '#FFB300', '#F57F17', '#FFF176'][Math.floor(Math.random() * 5)],
         rotation: Math.random() * 360,
         delay: Math.random() * 5
       });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none overflow-hidden bg-[#5d0f19]">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-20" 
            style={{
                backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', 
                backgroundSize: '30px 30px'
            }}>
      </div>
      
      {/* Rotating Light Rays */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] opacity-10 animate-spin-slow"
           style={{
             background: 'conic-gradient(from 0deg, transparent 0deg, #FFD700 20deg, transparent 40deg, #FFD700 60deg, transparent 80deg, #FFD700 100deg, transparent 120deg, #FFD700 140deg, transparent 160deg, #FFD700 180deg, transparent 200deg, #FFD700 220deg, transparent 240deg, #FFD700 260deg, transparent 280deg, #FFD700 300deg, transparent 320deg, #FFD700 340deg, transparent 360deg)',
             animationDuration: '60s'
           }}>
      </div>

      <svg viewBox="0 0 800 800" className="h-[100vh] w-auto max-w-full drop-shadow-2xl animate-zoom-in">
        <defs>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4E342E" />
            <stop offset="30%" stopColor="#795548" />
            <stop offset="70%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
          <radialGradient id="coinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- TREE TRUNK (Massive & Gnarled) --- */}
        <g transform="translate(400, 800)">
            {/* Roots */}
            <path d="M-100 0 Q-150 -50 -200 0 L200 0 Q150 -50 100 0" fill="#3E2723" />
            {/* Main Trunk */}
            <path d="M-80 0 C-100 -200 -120 -400 -250 -600 L250 -600 C120 -400 100 -200 80 0 Z" fill="url(#trunkGrad)" />
            {/* Branches */}
            <path d="M-50 -300 Q-150 -450 -300 -400" fill="none" stroke="url(#trunkGrad)" strokeWidth="40" strokeLinecap="round"/>
            <path d="M50 -350 Q150 -500 320 -450" fill="none" stroke="url(#trunkGrad)" strokeWidth="35" strokeLinecap="round"/>
            <path d="M0 -400 Q0 -550 -100 -650" fill="none" stroke="url(#trunkGrad)" strokeWidth="30" strokeLinecap="round"/>
            {/* Texture */}
            <path d="M-40 -100 Q0 -200 40 -100" fill="none" stroke="#3E2723" strokeWidth="5" opacity="0.5"/>
            <path d="M-50 -250 Q-20 -350 10 -250" fill="none" stroke="#3E2723" strokeWidth="5" opacity="0.5"/>
        </g>

        {/* --- CANOPY (Coins & Leaves) --- */}
        <g filter="url(#softGlow)">
            {canopyItems.map((item, i) => (
                <g key={i} transform={`translate(${item.cx}, ${item.cy}) rotate(${item.rotation})`}>
                    {/* Ancient Coin Animation */}
                    <animateTransform attributeName="transform" type="translate" 
                        values={`${item.cx},${item.cy}; ${item.cx},${item.cy + 5}; ${item.cx},${item.cy}`} 
                        dur={`${3 + item.delay}s`} repeatCount="indefinite" />
                    
                    {item.isCoin ? (
                        <g>
                            <circle r={item.size} fill={item.fill} stroke="#F9A825" strokeWidth="1" />
                            {/* Inner rim */}
                            <circle r={item.size * 0.8} fill="none" stroke="#F9A825" strokeWidth="1" opacity="0.5"/>
                            {/* Square hole */}
                            <rect x={-item.size * 0.3} y={-item.size * 0.3} width={item.size * 0.6} height={item.size * 0.6} fill="#5d0f19" />
                        </g>
                    ) : (
                        // Golden Leaf
                        <ellipse rx={item.size} ry={item.size * 0.6} fill={item.fill} />
                    )}
                </g>
            ))}
        </g>

        {/* --- GOD OF WEALTH (Detailed Chibi Style) --- */}
        <g transform="translate(400, 720) scale(1.4)">
           {/* Shadow */}
           <ellipse cx="0" cy="55" rx="70" ry="15" fill="black" opacity="0.3" />

           {/* Robe (Red & Gold) */}
           <path d="M-50 50 C-60 20 -40 -10 0 -10 C40 -10 60 20 50 50 L-50 50" fill="#D32F2F" />
           <path d="M-50 50 L-60 60 C-40 65 40 65 60 60 L50 50" fill="#B71C1C" /> {/* Bottom hem */}
           
           {/* Robe Pattern */}
           <circle cx="-25" cy="30" r="10" fill="#FFC107" opacity="0.2"/>
           <circle cx="25" cy="30" r="10" fill="#FFC107" opacity="0.2"/>

           {/* Arms holding Ingot */}
           <ellipse cx="-25" cy="15" rx="15" ry="10" fill="#D32F2F" transform="rotate(-20)"/>
           <ellipse cx="25" cy="15" rx="15" ry="10" fill="#D32F2F" transform="rotate(20)"/>

           {/* Gold Ingot (Big & Shiny) */}
           <g transform="translate(0, 20)">
               <path d="M-35 -10 Q0 10 35 -10 L45 -20 Q0 -5 -45 -20 Z" fill="#FFD700" />
               <path d="M-35 -10 Q0 10 35 -10" fill="none" stroke="#F57F17" strokeWidth="1"/>
               <ellipse cx="0" cy="-20" rx="45" ry="12" fill="#FFF59D" />
               <ellipse cx="0" cy="-20" rx="35" ry="8" fill="#FFD700" />
               <text x="0" y="-16" textAnchor="middle" fontSize="10" fill="#E65100" fontWeight="bold">Tài</text>
           </g>

           {/* Hands */}
           <circle cx="-35" cy="15" r="8" fill="#FFCCBC" />
           <circle cx="35" cy="15" r="8" fill="#FFCCBC" />

           {/* Head */}
           <circle cx="0" cy="-25" r="32" fill="#FFCCBC" /> {/* Face Skin */}
           
           {/* Beard (Black & Flowing) */}
           <path d="M-25 -10 Q0 40 25 -10" fill="black" />
           <path d="M-10 10 Q0 30 10 10" fill="black" />

           {/* Facial Features */}
           <path d="M-15 -25 Q-10 -30 -5 -25" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" /> {/* Left Eye */}
           <path d="M5 -25 Q10 -30 15 -25" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" /> {/* Right Eye */}
           <path d="M-12 -12 Q0 -5 12 -12" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
           <circle cx="-22" cy="-18" r="4" fill="#FF8A80" opacity="0.5" /> {/* Cheek */}
           <circle cx="22" cy="-18" r="4" fill="#FF8A80" opacity="0.5" /> {/* Cheek */}

           {/* Hat (Official's Hat) */}
           <path d="M-35 -35 Q0 -65 35 -35" fill="#D32F2F" stroke="#FFD700" strokeWidth="2"/>
           <rect x="-25" y="-55" width="50" height="25" rx="5" fill="#D32F2F" stroke="#FFD700" strokeWidth="2"/>
           <circle cx="0" cy="-42" r="6" fill="#FFD700" />
           {/* Hat Flaps */}
           <path d="M-25 -45 L-60 -50" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
           <path d="M25 -45 L60 -50" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
};

const App: React.FC = () => {
  // Config State
  const [customQuestions, setCustomQuestions] = useState(DEFAULT_QUESTIONS);
  const [customRewards, setCustomRewards] = useState(DEFAULT_REWARDS);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Music State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    screen: 'WELCOME',
    openedCount: 0,
    maxOpens: MAX_OPENS,
    totalScore: 0,
    history: []
  });

  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [suspenseEnvelopeId, setSuspenseEnvelopeId] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<EnvelopeContent | null>(null);

  useEffect(() => {
    resetGameData();
  }, []); 

  // --- MUSIC LOGIC ---
  const toggleMusic = () => {
    if (audioRef.current) {
        if (isMusicPlaying) {
            audioRef.current.pause();
            setIsMusicPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsMusicPlaying(true);
                    setUserInteracted(true);
                }).catch(e => {
                    console.error("Audio play blocked", e);
                    alert("Không thể phát nhạc tự động. Vui lòng bấm vào nút Bật Nhạc.");
                });
            }
        }
    }
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % MUSIC_PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    setTimeout(() => {
        if (audioRef.current && isMusicPlaying) {
            audioRef.current.play().catch(e => console.log("Next track play error", e));
        }
    }, 100);
  };

  const forcePlayMusic = () => {
      if(audioRef.current) {
          audioRef.current.play().then(() => {
              setIsMusicPlaying(true);
              setUserInteracted(true);
          }).catch(e => {
              console.error("Force play failed", e);
              playNextTrack();
          });
      }
  };

  // --- GAME LOGIC ---
  const resetGameData = (questions = customQuestions, rewards = customRewards) => {
     const contents = generateEnvelopes(questions, rewards);
     
     const placedEnvelopes: Envelope[] = [];
     const TOTAL_ENVELOPES = 25; // More envelopes for the bigger tree
     
     for (let i = 0; i < TOTAL_ENVELOPES; i++) {
        let xPos = 0, yPos = 0;
        let attempts = 0;
        let valid = false;
        
        let minDistance = 10; 

        while (!valid && attempts < 200) {
            if (attempts > 100) minDistance = 8;

            // UPDATED POSITIONING LOGIC FOR BIG CANOPY
            // Tree Canopy is roughly an oval centered at X=50, Y=35
            // Width radius ~ 45%, Height radius ~ 35%
            
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()); // Even distribution
            
            const radiusX = 42 * r; 
            const radiusY = 32 * r;

            xPos = 50 + radiusX * Math.cos(angle);
            yPos = 35 + radiusY * Math.sin(angle); 

            // COLLISION AVOIDANCE
            
            // 1. Avoid the God of Wealth (Bottom Center)
            // Box: X[35, 65], Y[65, 100]
            if (xPos > 35 && xPos < 65 && yPos > 65) {
                valid = false;
                attempts++;
                continue;
            }

            // 2. Ensure inside screen bounds with padding
            if (xPos < 5 || xPos > 95 || yPos < 5 || yPos > 85) {
                 valid = false;
                 attempts++;
                 continue;
            }

            // 3. Avoid other envelopes
            valid = true;
            for (const existing of placedEnvelopes) {
                const dx = existing.x - xPos;
                const dy = existing.y - yPos;
                if (Math.sqrt(dx*dx + dy*dy) < minDistance) {
                    valid = false;
                    break;
                }
            }
            attempts++;
        }

        placedEnvelopes.push({
            id: i,
            isOpen: false,
            content: contents[i],
            x: xPos,
            y: yPos,
            rotation: (Math.random() - 0.5) * 15,
            scale: 0.85 + Math.random() * 0.25,
            delay: Math.random() * 2,
            decoration: ENVELOPE_DECORATIONS[Math.floor(Math.random() * ENVELOPE_DECORATIONS.length)],
            variant: Math.floor(Math.random() * 3)
        });
     }
    setEnvelopes(placedEnvelopes);
  };

  const handleStart = (name: string) => {
    if (!name.trim()) return;
    playSound('click');
    setGameState(prev => ({
      ...prev,
      playerName: name,
      screen: 'PLAYING'
    }));
    
    if (audioRef.current && !isMusicPlaying && userInteracted) {
        audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const handleOpenEnvelope = (id: number) => {
    if (gameState.openedCount >= gameState.maxOpens) return;
    const envelope = envelopes.find(e => e.id === id);
    if (!envelope || envelope.isOpen) return;

    setSuspenseEnvelopeId(id);
  };

  const handleSuspenseFinish = () => {
    if (suspenseEnvelopeId === null) return;
    
    const envelope = envelopes.find(e => e.id === suspenseEnvelopeId);
    if (!envelope) return;

    setEnvelopes(prev => prev.map(e => 
      e.id === suspenseEnvelopeId ? { ...e, isOpen: true } : e
    ));

    setModalContent(envelope.content);
    setSuspenseEnvelopeId(null);
  };

  const handleModalClose = (points: number, description: string) => {
    playSound('click');
    setModalContent(null);
    
    setGameState(prev => {
      const newCount = prev.openedCount + 1;
      const newScore = prev.totalScore + points;
      const newHistory = [...prev.history, { 
        envelopeId: prev.openedCount + 1, 
        description, 
        pointsEarned: points 
      }];

      if (newCount >= prev.maxOpens) {
        saveScore(prev.playerName, newScore);
        return {
          ...prev,
          openedCount: newCount,
          totalScore: newScore,
          history: newHistory,
          screen: 'SUMMARY'
        };
      }

      return {
        ...prev,
        openedCount: newCount,
        totalScore: newScore,
        history: newHistory
      };
    });
  };

  const handleRestart = () => {
    playSound('click');
    resetGameData();
    setGameState(prev => ({
      ...prev,
      screen: 'PLAYING',
      openedCount: 0,
      totalScore: 0,
      history: []
    }));
  };

  const handleExit = () => {
    playSound('click');
    setGameState({
      playerName: '',
      screen: 'WELCOME',
      openedCount: 0,
      maxOpens: MAX_OPENS,
      totalScore: 0,
      history: []
    });
    resetGameData();
  };

  const handleSaveSettings = (q: any[], r: any[]) => {
    setCustomQuestions(q);
    setCustomRewards(r);
    resetGameData(q, r);
    playSound('click');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-cover bg-center" style={{backgroundColor: '#5d0f19'}}>
      
      {/* --- PERSISTENT AUDIO ELEMENT --- */}
      <audio 
        ref={audioRef} 
        src={MUSIC_PLAYLIST[currentTrackIndex]} 
        onEnded={playNextTrack}
        loop={false}
        preload="auto"
      />
      
      {/* SVG Background */}
      <GodOfWealthTreeSVG />

      {/* --- SCREEN: WELCOME --- */}
      {gameState.screen === 'WELCOME' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <button onClick={() => setShowLeaderboard(true)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full text-tet-gold transition border border-tet-gold/30">
                    <Trophy size={24} />
                </button>
                <button onClick={() => setShowSettings(true)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full text-tet-gold transition border border-tet-gold/30">
                    <Settings size={24} />
                </button>
            </div>

            <div className="bg-tet-cream p-8 rounded-3xl shadow-2xl border-4 border-tet-gold max-w-md w-full text-center relative overflow-hidden z-10 animate-zoom-in">
                <div className="absolute top-0 left-0 w-full h-4 bg-tet-red"></div>
                <div className="absolute bottom-0 left-0 w-full h-4 bg-tet-red"></div>
                
                <h1 className="font-tet text-6xl text-tet-red mb-2 drop-shadow-md">Xuân Bính Ngọ</h1>
                <h2 className="font-body text-xl font-bold text-tet-darkRed mb-6 uppercase tracking-widest">2026</h2>

                <div className="mb-6 flex justify-center gap-4">
                    <div className="w-24 h-32 bg-red-600 rounded-lg flex items-center justify-center border-2 border-yellow-400 shadow-lg transform -rotate-6">
                        <span className="text-4xl">🐎</span>
                    </div>
                    <div className="w-24 h-32 bg-red-600 rounded-lg flex items-center justify-center border-2 border-yellow-400 shadow-lg transform rotate-6">
                        <span className="text-4xl">🧧</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <input
                    type="text"
                    placeholder="Nhập tên của bạn..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-tet-gold focus:outline-none focus:ring-4 focus:ring-red-200 text-lg text-center font-bold text-gray-700 bg-white" 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleStart(e.currentTarget.value);
                    }}
                    onChange={(e) => setGameState(prev => ({...prev, playerName: e.target.value}))}
                    value={gameState.playerName}
                    />
                    
                    <button 
                        onClick={forcePlayMusic}
                        className={`w-full font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm mb-2 transition-all ${isMusicPlaying ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse'}`}
                    >
                        {isMusicPlaying ? <Volume2 size={16} /> : <PlayCircle size={16} />} 
                        {isMusicPlaying ? 'Nhạc đang phát' : 'Bấm để Bật Nhạc'}
                    </button>

                    <button
                    onClick={() => handleStart(gameState.playerName)}
                    className="w-full bg-tet-red hover:bg-tet-darkRed text-tet-gold font-bold py-3 px-6 rounded-lg shadow-lg transform transition active:scale-95 text-xl flex items-center justify-center gap-2"
                    >
                    <Star className="fill-current" /> Bắt Đầu Hái Lộc
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- SCREEN: PLAYING --- */}
      {gameState.screen === 'PLAYING' && (
         <div className="flex-1 flex flex-col relative z-10">
            {/* Header Bar */}
            <div className="w-full max-w-5xl mx-auto px-4 z-50">
                <div className="flex justify-between items-center bg-tet-cream/90 backdrop-blur rounded-full px-6 py-3 shadow-lg my-4 border-2 border-tet-gold">
                    <div className="flex items-center gap-2">
                    <div className="bg-tet-red text-tet-gold w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
                        {gameState.playerName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-tet-darkRed hidden sm:inline">{gameState.playerName}</span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex gap-2">
                            <button onClick={toggleMusic} className="text-gray-500 hover:text-tet-red bg-white/50 p-1.5 rounded-full">
                                {isMusicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </button>
                            <button onClick={playNextTrack} className="text-gray-500 hover:text-tet-red bg-white/50 p-1.5 rounded-full">
                                <SkipForward size={18} />
                            </button>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">Lượt</span>
                            <span className="text-xl font-black text-tet-red">{gameState.maxOpens - gameState.openedCount}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">Điểm</span>
                            <span className="text-xl font-black text-yellow-600">{gameState.totalScore}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tree Envelopes Container */}
            <div className="flex-1 w-full max-w-2xl mx-auto relative z-10 h-full mt-4">
                {envelopes.map((envelope) => (
                    <EnvelopeItem
                        key={envelope.id}
                        data={envelope}
                        disabled={gameState.openedCount >= gameState.maxOpens || suspenseEnvelopeId !== null}
                        onClick={handleOpenEnvelope}
                    />
                ))}
            </div>
         </div>
      )}

      {/* --- SCREEN: SUMMARY --- */}
      {gameState.screen === 'SUMMARY' && (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <div className="bg-tet-cream w-full max-w-lg rounded-2xl shadow-2xl border-4 border-tet-gold overflow-hidden animate-zoom-in z-20">
            <div className="bg-tet-red p-6 text-center text-tet-gold">
                <h2 className="font-tet text-4xl mb-2">Tổng Kết</h2>
                <p className="font-bold text-lg opacity-90">{gameState.playerName}</p>
            </div>
            
            <div className="p-6">
                <div className="flex flex-col items-center mb-8">
                <Trophy className="w-24 h-24 text-yellow-500 mb-4 drop-shadow-lg" />
                <div className="text-gray-600 font-bold text-lg">Tổng điểm đạt được</div>
                <div className="text-6xl font-extrabold text-tet-red">{gameState.totalScore}</div>
                </div>

                <div className="bg-white rounded-xl border-2 border-yellow-100 p-4 mb-6 max-h-48 overflow-y-auto">
                <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Lịch sử hái lộc:</h3>
                <div className="space-y-3">
                    {gameState.history.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1 pr-2">
                        {idx + 1}. {item.description}
                        </span>
                        <span className="font-bold text-tet-red">+{item.pointsEarned}</span>
                    </div>
                    ))}
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setShowLeaderboard(true)}
                    className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow"
                    >
                    Xem Bảng Xếp Hạng
                    </button>
                <button
                    onClick={handleRestart}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg shadow transition"
                >
                    <RefreshCw size={20} /> Chơi Lại
                </button>
                <button
                    onClick={handleExit}
                    className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow transition"
                >
                    <User size={20} /> Người Khác
                </button>
                </div>
            </div>
            </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {showSettings && (
        <SettingsModal 
            onClose={() => setShowSettings(false)}
            onSave={handleSaveSettings}
            currentQuestions={customQuestions}
            currentRewards={customRewards}
        />
      )}
        
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}

      {suspenseEnvelopeId !== null && (
        <SuspenseModal onFinish={handleSuspenseFinish} />
      )}

      {modalContent && (
        <ResultModal
          content={modalContent}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default App;