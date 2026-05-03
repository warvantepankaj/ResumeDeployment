import React from 'react';

const SearchLoader = () => {
  const text = "Searching";

  return (
    <div className="flex items-center justify-center relative gap-[10px] select-none text-white">
      {/* Custom Keyframe Animations */}
      <style italic>{`
        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow: 0 1px 1px 0 #fff inset, 0 3px 5px 0 #ff5f9f inset, 0 4px 4px 0 #0693ff inset;
          }
          50% {
            transform: rotate(270deg);
            background: #7c0911;
            box-shadow: 0 1px 1px 0 #fff inset, 0 3px 5px 0 #d60a47 inset, 0 4px 4px 0 #fbef19 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow: 0 1px 1px 0 #fff inset, 0 3px 5px 0 #ff5f9f inset, 0 4px 4px 0 #28a9ff inset;
          }
        }

        @keyframes loader-letter-anim {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          20% { opacity: 1; transform: scale(1.15); }
          40% { opacity: 0.7; transform: translateY(0); }
        }

        .animate-loader-rotate {
          animation: loader-rotate 1.5s linear infinite;
        }

        .animate-letter {
          animation: loader-letter-anim 2s infinite;
        }
      `}</style>

      {/* The Rotating Circle */}
      <div className="w-5 h-5 aspect-square rounded-full bg-transparent z-0 animate-loader-rotate" />

      {/* The Lettering */}
      <div className="flex gap-[1px]">
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className="inline-block opacity-40 z-10 rounded-[50ch] border-none animate-letter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchLoader;