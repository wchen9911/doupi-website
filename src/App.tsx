import { useState, useEffect, useRef } from 'react';
import { Languages, Utensils, History, Play, ChefHat, ExternalLink, Globe, ChevronLeft, ChevronRight, Info, Music, Pause } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    title: "Wuhan Three-Fresh Doupi",
    subtitle: "The King of Wuhan Breakfast (Guo Zao)",
    tagline: "Crispy Golden Skin, Fragrant Sticky Rice, Savory Filling.",
    about: "About Doupi",
    history: "A Rich History",
    recipe: "Authentic Recipe",
    gallery: "Watch the Magic (Street Food & Tutorials)",
    intro_text: "Wuhan Doupi (三鲜豆皮) is a legendary breakfast dish from Hubei. It's a savory, multi-layered masterpiece consisting of a golden egg crepe, aromatic glutinous rice, and a rich filling of pork, mushrooms, and bamboo shoots.",
    history_text: "With a history of nearly 400 years, Doupi evolved from a rural Lunar New Year delicacy to the urban staple it is today. In 1931, chef Gao Jinan opened 'Lao Tong Cheng', perfecting the 'Three-Fresh' (pork, mushroom, bamboo) version that even Chairman Mao praised in 1958.",
    ingredients: "Key Ingredients",
    steps: "Preparation Steps",
    ingredients_list: ["Mung Bean & Rice Batter", "Eggs", "Glutinous Rice", "Diced Pork Belly", "Shiitake Mushrooms", "Bamboo Shoots", "Firm Tofu", "Scallions"],
    steps_list: [
      "Steam the glutinous rice until perfectly soft yet chewy.",
      "Sauté the 'Three-Fresh' filling with savory seasonings.",
      "Spread the thin batter in a giant wok to form the skin.",
      "Crack an egg over the skin for that golden finish.",
      "Flip the skin, layer the rice and filling, then fold and cut into squares."
    ],
    video_caption: "Wuhan street food is best experienced visually. Watch how the massive pans are flipped with rhythm and skill.",
    how_to_make: "Visual Guide: Making Doupi",
    animation_steps: [
      "Pour Batter",
      "Add Egg",
      "Flip Skin",
      "Layer Rice",
      "Add Filling",
      "Fold & Cut"
    ],
    animation_desc: [
      "Pour mung bean and rice batter into a hot wok.",
      "Crack an egg and spread it evenly for a golden skin.",
      "Flip the skin carefully to cook the other side.",
      "Spread a thick layer of steamed glutinous rice.",
      "Add the 'Three-Fresh' savory filling on top.",
      "Fold the sides, flip again, and cut into perfect squares."
    ],
    play_music: "Play Doupi Rap",
    pause_music: "Pause Music",
    rap_lyrics: [
      "Wuhan morning, fragrance in every lane.",
      "Three-Fresh Doupi, golden in the big wok.",
      "Listen to the spatula, the rhythm is crisp.",
      "Mung bean batter spread thin, that's the essence.",
      "Crack! Egg spread even, color so pure.",
      "Master flips it over, steady and sure.",
      "Glutinous rice spread thick, white like pearls.",
      "Mushrooms, pork, and shoots, flavors for the world.",
      "Fold it, flip it, cut into squares, sprinkle the onions.",
      "One bite, mouth full of fragrance, like in the clouds."
    ],
    footer: "Built for doupi.us - Celebrating Wuhan Street Food Culture"
  },
  zh: {
    title: "武汉三鲜豆皮",
    subtitle: "武汉过早之王",
    tagline: "金黄脆皮，软糯米香，鲜美馅料。",
    about: "关于豆皮",
    history: "历史渊源",
    recipe: "正宗做法",
    gallery: "现场盛况 (街头美食与教程)",
    intro_text: "武汉豆皮是湖北武汉极具代表性的传统小吃。它由三层组成：最外层是绿豆大米浆加鸡蛋摊成的金黄脆皮；中间是软糯的糯米；里层是猪肉、香菇和笋丁组成的“三鲜”馅料。",
    history_text: "豆皮已有近400年历史，最初是农村过年时的节日佳肴。1931年，厨师高金安创办“老通城”酒楼，改良了三鲜豆皮的做法。1958年，毛泽东主席曾两次品尝并给予高度评价。",
    ingredients: "主要原料",
    steps: "制作步骤",
    ingredients_list: ["绿豆大米浆", "鲜鸡蛋", "糯米", "五花肉丁", "香菇丁", "冬笋丁", "豆干丁", "葱花"],
    steps_list: [
      "将糯米蒸熟，要求颗粒饱满，软糯入味。",
      "将三鲜馅料下锅煸炒，加入调料焖煮。",
      "在大平底锅中摊开浆水，抹上蛋液，摊成金黄脆皮。",
      "翻面铺上糯米 and 馅料，折叠整齐。",
      "煎至底部焦脆，切成小方块，撒上葱花即可。",
    ],
    video_caption: "武汉街头美食的魅力在于现场感。看师傅们如何有节奏地翻动巨大的炒锅。",
    how_to_make: "制作过程演示",
    animation_steps: ["摊浆", "抹蛋液", "翻面", "铺糯米", "撒馅料", "成型"],
    animation_desc: [
      "在大锅中均匀摊开绿豆大米浆。",
      "抹上一层鲜艳的鸡蛋液，形成脆皮。",
      "顺滑地将整块豆皮翻转。",
      "均匀地铺上一层软糯的糯米。",
      "撒上精心准备的“三鲜”馅料。",
      "折叠边缘并切块，香喷喷的豆皮出锅了！"
    ],
    play_music: "播放豆皮之歌",
    pause_music: "暂停音乐",
    rap_lyrics: [
      "武汉的早晨，街头巷尾的香。",
      "三鲜豆皮，金黄在那大锅里漾。",
      "听那铲子在平底锅上，节奏响得清脆。",
      "绿豆大米浆，摊得薄，功夫才是精粹。",
      "咔嚓一声，蛋液抹匀，颜色变得纯正。",
      "师傅手一抖，翻个身，动作那是真稳。",
      "糯米铺得厚，颗颗晶莹，像那珍珠白。",
      "香菇猪肉冬笋丁，鲜味全都排成排。",
      "折叠，翻转，切成方块，撒上一把葱。",
      "这一口下去，满嘴生香，像在云雾中。"
    ],
    footer: "为 doupi.us 制作 - 传播武汉街头美食文化"
  }
};

const VIDEOS = [
  { 
    id: 'N66iAlKUA5s', 
    title: 'Authentic Wuhan Three-Fresh Doupi', 
    zhTitle: '不是你想像的豆皮，教你做一份地道的武汉三鲜豆皮 (大碗拿铁)' 
  },
  { 
    id: 'h_-EB17kaZY', 
    title: 'Wuhan Doupi Overseas Experience', 
    zhTitle: '在海外能吃到武汉豆皮的含金量！ (加拿大俩哥特)' 
  },
  { 
    id: 'TOlCIjFQfDg', 
    title: 'Homemade Wuhan Doupi (Tasty & Crispy)', 
    zhTitle: 'Homemade Wuhan Doupi (家庭版武汉豆皮) - 菲菲的家' 
  },
  { 
    id: 'VxjoILRaK-c', 
    title: 'Aromatic Street-Style Doupi', 
    zhTitle: '【食语集】武汉过早香满街的三鲜豆皮，焦香美味！' 
  }
];

function MusicPlayer({ lang, t }: { lang: string, t: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  
  const speakLyric = (index: number, forcePlay = false) => {
    if (!synthesisRef.current || (!isPlaying && !forcePlay)) return;
    
    // Chrome fix: resume synthesis
    synthesisRef.current.resume();
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(t.rap_lyrics[index]);
    
    // Try to find a good voice
    const voices = synthesisRef.current.getVoices();
    if (lang === 'zh') {
      utterance.lang = 'zh-CN';
      const zhVoice = voices.find(v => v.lang.includes('zh-CN') || v.lang.includes('zh_CN'));
      if (zhVoice) utterance.voice = zhVoice;
    } else {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => v.lang.includes('en-US'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.rate = 1.2;
    utterance.pitch = 0.9;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setCurrentLyricIndex(index);
    utterance.onend = () => {
      if (index + 1 < t.rap_lyrics.length) {
        setTimeout(() => {
          if (synthesisRef.current) speakLyric(index + 1);
        }, 800); // Wait a bit before next line
      } else {
        setTimeout(() => speakLyric(0), 3000); // Loop after a pause
      }
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
    };
    
    synthesisRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (!synthesisRef.current) return;

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      synthesisRef.current.cancel();
      setCurrentLyricIndex(-1);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Use the audio's play promise to handle browser restrictions
      if (audioRef.current) {
        audioRef.current.volume = 0.3; // Lower volume for background beat
        audioRef.current.play().catch(e => console.log('Audio background play blocked, starting rap only'));
      }
      // Pass forcePlay=true because state update is async
      speakLyric(0, true);
    }
  };

  // Pre-load voices (browsers load them async)
  useEffect(() => {
    const loadVoices = () => {
      if (synthesisRef.current) synthesisRef.current.getVoices();
    };
    loadVoices();
    if (synthesisRef.current?.onvoiceschanged !== undefined) {
      synthesisRef.current.onvoiceschanged = loadVoices;
    }
    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isPlaying && (
        <div className="bg-orange-950/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-orange-500/40 max-w-xs animate-fade-in mb-2 text-white ring-4 ring-orange-500/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] mb-1">AI Performer</p>
              <p className="text-sm font-black italic tracking-tighter">DOUPI FLOW</p>
            </div>
            <div className="flex gap-1 h-4 items-end">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-orange-500 rounded-full animate-bounce" style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.3 + Math.random() * 0.4}s` }} />
              ))}
            </div>
          </div>
          
          <div className="relative h-20 flex flex-col justify-center">
            {t.rap_lyrics.map((line: string, i: number) => (
              <p 
                key={i} 
                className={`text-sm absolute w-full transition-all duration-500 text-center ${currentLyricIndex === i ? 'opacity-100 scale-105 text-orange-300 font-bold translate-y-0' : 'opacity-0 scale-95 -translate-y-4'}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={togglePlay}
        className={`group relative p-6 rounded-full shadow-[0_20px_50px_rgba(234,88,12,0.3)] transition-all duration-700 ${isPlaying ? 'bg-orange-600 scale-110 ring-4 ring-orange-400/20' : 'bg-white hover:bg-orange-50'}`}
        aria-label={isPlaying ? t.pause_music : t.play_music}
      >
        {isPlaying ? (
          <Pause className="text-white animate-pulse" size={32} />
        ) : (
          <div className="relative">
             <Music className="text-orange-600" size={32} />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
        
        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-orange-950 text-white px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl">
          {isPlaying ? t.pause_music : t.play_music}
        </div>
      </button>

      <audio 
        ref={audioRef}
        loop
        crossOrigin="anonymous"
        src="https://assets.mixkit.co/active_storage/sfx/133/133-preview.mp3" 
      />
    </div>
  );
}

function DoupiAnimation({ steps, descriptions, lang }: { steps: string[], descriptions: string[], lang: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextStep = () => {
    setIsAnimating(true);
    setCurrentStep((prev) => (prev + 1) % steps.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevStep = () => {
    setIsAnimating(true);
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        nextStep();
      } else {
        setTimeout(() => setCurrentStep(0), 3000);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentStep, steps.length]);

  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-orange-50 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Visual Part */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 shrink-0">
          <div className="absolute inset-0 bg-[#333] rounded-full border-[12px] border-[#444] shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
            
            {/* Batter */}
            <div 
              className={`absolute inset-6 bg-[#f5e6d3] rounded-full transition-all duration-1000 origin-center shadow-inner ${currentStep >= 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
              style={{ filter: 'brightness(0.95)' }}
            />
            
            {/* Egg */}
            <div 
              className={`absolute inset-6 bg-[#ffcf40] rounded-full transition-all duration-700 origin-center mix-blend-multiply ${currentStep >= 1 ? 'scale-100 opacity-80' : 'scale-0 opacity-0'}`}
            />
            
            {/* Flip */}
            <div 
              className={`absolute inset-6 bg-[#e6b800] rounded-full transition-all duration-1000 shadow-lg ${currentStep >= 2 ? 'rotate-180 brightness-110' : 'rotate-0'}`}
              style={{ opacity: currentStep >= 2 ? 1 : 0 }}
            />

            {/* Rice */}
            <div 
              className={`absolute inset-12 bg-[#fffcf5] rounded-full transition-all duration-700 shadow-md flex flex-wrap gap-0.5 p-4 items-center justify-center content-center ${currentStep >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
            >
              {[...Array(60)].map((_, i) => (
                <div key={i} className="w-1.5 h-3 bg-white rounded-full shadow-sm rotate-45" />
              ))}
            </div>

            {/* Filling */}
            <div 
              className={`absolute inset-20 flex flex-wrap gap-2 items-center justify-center p-2 transition-all duration-700 ${currentStep >= 4 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
            >
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-sm shadow-sm transition-all duration-500`}
                  style={{ 
                    backgroundColor: i % 3 === 0 ? '#5d4037' : i % 3 === 1 ? '#2e7d32' : '#d84315',
                    transform: `rotate(${i * 15}deg) translate(${Math.sin(i) * 5}px)`
                  }} 
                />
              ))}
            </div>

            {/* Cut Lines */}
            <div className={`absolute inset-6 grid grid-cols-3 grid-rows-3 transition-all duration-1000 ${currentStep >= 5 ? 'opacity-100' : 'opacity-0'}`}>
               {[...Array(9)].map((_, i) => (
                 <div key={i} className="border border-black/10 flex items-center justify-center relative">
                    {currentStep >= 5 && <div className="w-full h-[1px] bg-black/5 rotate-45 absolute" />}
                 </div>
               ))}
            </div>
          </div>
          
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-8 opacity-20 pointer-events-none">
             <div className="w-4 h-20 bg-white blur-xl animate-pulse delay-75" />
             <div className="w-6 h-24 bg-white blur-xl animate-pulse" />
             <div className="w-4 h-20 bg-white blur-xl animate-pulse delay-150" />
          </div>
        </div>

        {/* Info Part */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
              <ChefHat size={16} />
              {lang === 'zh' ? `第 ${currentStep + 1} 步` : `Step ${currentStep + 1}`}
            </div>
            <h4 className={`text-4xl md:text-5xl font-black text-orange-950 mb-6 transition-all duration-500 ${isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
              {steps[currentStep]}
            </h4>
            <p className={`text-xl text-gray-600 leading-relaxed min-h-[6rem] transition-all duration-500 delay-100 ${isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
              {descriptions[currentStep]}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button 
              onClick={prevStep} 
              className="p-4 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all active:scale-90"
              aria-label="Previous step"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={nextStep} 
              className="px-8 py-4 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center gap-3 text-lg"
            >
              {lang === 'zh' ? '下一步' : 'Next Step'} <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="flex justify-center lg:justify-start gap-3 pt-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-3 rounded-full transition-all duration-500 ${currentStep === i ? 'w-12 bg-orange-500' : 'w-3 bg-orange-200 hover:bg-orange-300'}`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-50 rounded-full -z-10" />
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#fff9f0] text-gray-800 font-sans">
      <MusicPlayer lang={lang} t={t} />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Utensils className="text-orange-500" />
          <h1 className="text-xl font-bold tracking-tight text-orange-900">DOUPI.US</h1>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-all shadow-md active:scale-95"
        >
          <Languages size={18} />
          <span className="font-semibold">{lang === 'zh' ? 'English' : '中文'}</span>
        </button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-orange-950 mb-4 animate-fade-in">
            {t.title}
          </h2>
          <p className="text-xl md:text-2xl text-orange-800 font-medium mb-8">
            {t.subtitle}
          </p>
          <div className="bg-orange-100 text-orange-900 px-6 py-3 rounded-full inline-block font-bold text-lg mb-12 border-2 border-orange-200">
            {t.tagline}
          </div>
        </div>
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl -z-10 translate-x-1/4 translate-y-1/4"></div>
      </section>

      {/* Content Grid */}
      <main className="max-w-6xl mx-auto px-6 grid gap-12 pb-24">
        
        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-50">
            <div className="flex items-center gap-3 mb-6 text-orange-600">
              <ChefHat size={32} />
              <h3 className="text-2xl font-bold">{t.about}</h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">{t.intro_text}</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-50">
            <div className="flex items-center gap-3 mb-6 text-orange-600">
              <History size={32} />
              <h3 className="text-2xl font-bold">{t.history}</h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">{t.history_text}</p>
          </div>
        </div>

        {/* Animation Section */}
        <section className="space-y-12">
          <div className="text-center">
             <h3 className="text-4xl font-bold text-orange-950 mb-4 flex items-center justify-center gap-3">
              <Info className="text-orange-600" /> {t.how_to_make}
            </h3>
          </div>
          <DoupiAnimation 
            steps={t.animation_steps} 
            descriptions={t.animation_desc} 
            lang={lang}
          />
        </section>

        {/* Recipe Section */}
        <section className="bg-orange-900 text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Utensils /> {t.ingredients}
              </h3>
              <ul className="grid grid-cols-2 gap-4">
                {t.ingredients_list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-orange-100">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ChefHat /> {t.steps}
              </h3>
              <ol className="space-y-4">
                {t.steps_list.map((step, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="bg-orange-700 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-orange-100">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="absolute top-0 right-0 opacity-10 -translate-y-1/4 translate-x-1/4">
             <Utensils size={400} />
          </div>
        </section>

        {/* Video Gallery */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-orange-950 mb-4 flex items-center justify-center gap-3">
              <Play className="fill-orange-600 text-orange-600" /> {t.gallery}
            </h3>
            <p className="text-xl text-orange-800 max-w-2xl mx-auto">{t.video_caption}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VIDEOS.map((vid, idx) => (
              <div key={`${vid.id}-${idx}`} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100">
                <div className="aspect-video relative">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${vid.id}`}
                    title={lang === 'zh' ? vid.zhTitle : vid.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 truncate">
                    {lang === 'zh' ? vid.zhTitle : vid.title}
                  </span>
                  <a 
                    href={`https://youtube.com/watch?v=${vid.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-700"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-orange-950 text-orange-200 py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-8">
            <Globe className="hover:text-white transition-colors cursor-pointer" />
            <ChefHat className="hover:text-white transition-colors cursor-pointer" />
            <Utensils className="hover:text-white transition-colors cursor-pointer" />
          </div>
          <p className="text-lg font-medium opacity-80">{t.footer}</p>
          <div className="mt-4 text-sm opacity-50">© 2026 doupi.us - Three-Fresh Doupi (三鲜豆皮)</div>
        </div>
      </footer>

      {/* Custom Styles for Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
