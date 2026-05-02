import React from 'react';

const ScoreLoader = () => {
  return (
    <div className="flex items-center justify-center p-10">
      {/* Injecting keyframes locally so you don't need to edit tailwind.config.js */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes jump {
          15% { border-bottom-right-radius: 3px; }
          25% { transform: translateY(9px) rotate(22.5deg); }
          50% { 
            transform: translateY(18px) scale(1, .9) rotate(45deg);
            border-bottom-right-radius: 40px;
          }
          75% { transform: translateY(9px) rotate(67.5deg); }
          100% { transform: translateY(0) rotate(90deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.2, 1); }
        }
        .animate-jump { animation: jump 0.5s linear infinite; }
        .animate-shadow { animation: shadow 0.5s linear infinite; }
      `}} />

      <div className="relative w-12 h-12">
        {/* Shadow */}
        <div className="absolute top-[60px] left-0 w-12 h-[5px] bg-[#f08080]/30 rounded-[50%] animate-shadow" />
        
        {/* Box */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#f08080] rounded-[4px] animate-jump" />
      </div>
    </div>
  );
};

export default ScoreLoader;