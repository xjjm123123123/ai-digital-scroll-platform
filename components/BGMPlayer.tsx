import React, { useState, useRef, useEffect } from 'react';

let audioInstance: HTMLAudioElement | null = null;

const BGMPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioInstance) {
      return;
    }

    if (audioRef.current) {
      audioInstance = audioRef.current;
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        console.log('Autoplay blocked, waiting for user interaction');
      });
    }

    return () => {
    };
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/bgm.mp3"
        loop
        preload="auto"
      />
      
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-[200] w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/80 transition-all group"
        title={isPlaying ? '暂停音乐' : '播放音乐'}
      >
        {isPlaying ? (
          <div className="flex items-center gap-[2px]">
            <div className="w-[2px] h-3 bg-[#c5a059] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-[2px] h-4 bg-[#c5a059] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-[2px] h-2 bg-[#c5a059] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <div className="w-[2px] h-3 bg-[#c5a059] rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
          </div>
        ) : (
          <svg className="w-4 h-4 text-white/40 group-hover:text-[#c5a059] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default BGMPlayer;
