import React, { useState } from 'react';

interface Props {
  id: string;
  className?: string;
  glow?: boolean;
}

export const AlienAvatar: React.FC<Props> = ({ id, className = 'w-32 h-32', glow = true }) => {
  const [imgError, setImgError] = useState(false);
  const filterId = `neon-glow-${id}`;

  const imagePath = `/creatures/${id}.jpg`;

  const renderSvgFallback = () => {
    switch (id) {
      case 'heatblast':
        return (
          <>
            <path d="M25,80 C15,65 10,45 25,25 C30,15 45,5 50,20 C55,5 70,15 75,25 C90,45 85,65 75,80 Z" fill="url(#heatblast-grad-1)" />
            <path d="M35,75 C25,65 25,50 35,35 C40,25 48,15 50,25 C52,15 60,25 65,35 C75,50 75,65 65,75 Z" fill="url(#heatblast-grad-2)" />
            <path d="M30,50 L50,60 L70,50 L65,72 L50,85 L35,72 Z" fill="#2C0F00" stroke="#FF4D00" strokeWidth="2" />
            <polygon points="40,55 46,54 44,59" fill="#FFF" filter={`url(#${filterId})`} />
            <polygon points="60,55 54,54 56,59" fill="#FFF" filter={`url(#${filterId})`} />
            <path d="M50,60 L45,67 L55,67 Z" fill="#FFD700" />
          </>
        );

      case 'xlr8':
        return (
          <>
            <path d="M20,60 L30,30 L70,30 L80,60 L50,80 Z" fill="#111" stroke="#00F0FF" strokeWidth="3" />
            <path d="M50,15 L45,30 L55,30 Z" fill="#00F0FF" />
            <path d="M24,48 L50,38 L76,48 L74,52 L50,42 L26,52 Z" fill="#00F0FF" filter={`url(#${filterId})`} />
            <path d="M15,45 L10,50 L20,53 Z" fill="#111" stroke="#00F0FF" strokeWidth="1" />
            <path d="M85,45 L90,50 L80,53 Z" fill="#111" stroke="#00F0FF" strokeWidth="1" />
            <circle cx="50" cy="65" r="4" fill="#00F0FF" />
          </>
        );

      case 'diamondhead':
        return (
          <>
            <polygon points="50,15 78,50 65,85 35,85 22,50" fill="#007F52" stroke="#00FFA3" strokeWidth="3" />
            <polygon points="50,22 72,50 50,78 28,50" fill="#00FFA3" opacity="0.3" />
            <polygon points="50,15 50,78" stroke="#00FFA3" strokeWidth="2" />
            <polygon points="22,50 78,50" stroke="#00FFA3" strokeWidth="1.5" />
            <polygon points="38,42 45,45 39,48" fill="#FFF" filter={`url(#${filterId})`} />
            <polygon points="62,42 55,45 61,48" fill="#FFF" filter={`url(#${filterId})`} />
            <polygon points="50,5 50,20 45,15" fill="#00FFA3" />
          </>
        );

      case 'fourarms':
        return (
          <>
            <path d="M25,35 C25,25 35,20 50,20 C65,20 75,25 75,35 L75,65 C75,75 65,85 50,85 C35,85 25,75 25,65 Z" fill="#A8151B" stroke="#FF1E27" strokeWidth="2.5" />
            <path d="M47,20 L53,20 L53,45 L47,45 Z" fill="#1A1A1A" />
            <circle cx="38" cy="38" r="4" fill="#FFD700" filter={`url(#${filterId})`} />
            <circle cx="62" cy="38" r="4" fill="#FFD700" filter={`url(#${filterId})`} />
            <circle cx="40" cy="48" r="4.5" fill="#FFD700" filter={`url(#${filterId})`} />
            <circle cx="60" cy="48" r="4.5" fill="#FFD700" filter={`url(#${filterId})`} />
            <path d="M40,68 C45,72 55,72 60,68" stroke="#FFD700" strokeWidth="3" fill="none" />
          </>
        );

      case 'upgrade':
        return (
          <>
            <path d="M25,70 C20,40 30,20 50,20 C70,20 80,40 75,70 C70,82 50,85 50,85 C50,85 30,82 25,70 Z" fill="#111" stroke="#32CD32" strokeWidth="3" />
            <circle cx="50" cy="42" r="10" fill="#32CD32" filter={`url(#${filterId})`} />
            <circle cx="50" cy="42" r="5" fill="#FFF" />
            <path d="M50,52 L50,75" stroke="#32CD32" strokeWidth="2.5" strokeDasharray="4 2" />
            <path d="M40,42 L25,42 C20,42 18,50 18,55" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M60,42 L75,42 C80,42 82,50 82,55" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="18" cy="55" r="2.5" fill="#32CD32" />
            <circle cx="82" cy="55" r="2.5" fill="#32CD32" />
          </>
        );

      case 'wildmutt':
        return (
          <>
            <path d="M15,50 C15,30 30,25 50,25 C70,25 85,30 85,50 C85,62 80,78 70,82 C60,85 40,85 30,82 C20,78 15,62 15,50 Z" fill="#D35400" stroke="#FF8C00" strokeWidth="2.5" />
            <path d="M25,55 L35,53 M23,61 L33,59 M21,67 L31,64" stroke="#A04000" strokeWidth="2" strokeLinecap="round" />
            <path d="M75,55 L65,53 M77,61 L67,59 M79,67 L69,64" stroke="#A04000" strokeWidth="2" strokeLinecap="round" />
            <path d="M30,70 Q50,78 70,70" stroke="#FFF" strokeWidth="3" fill="none" />
            <polygon points="35,68 39,68 37,73" fill="#FFF" />
            <polygon points="65,68 61,68 63,73" fill="#FFF" />
            <path d="M40,38 Q50,33 60,38" fill="none" stroke="#E67E22" strokeWidth="2" />
          </>
        );

      case 'ghostfreak':
        return (
          <>
            <path d="M30,30 C30,15 45,15 50,25 C55,15 70,15 70,30 C70,55 65,85 50,85 C35,85 30,55 30,30 Z" fill="#DFDFF0" stroke="#8E44AD" strokeWidth="2" />
            <path d="M35,40 C42,43 50,35 65,48 M35,40 L65,48" stroke="#333" strokeWidth="1.5" fill="none" />
            <circle cx="48" cy="42" r="5" fill="#8E44AD" filter={`url(#${filterId})`} />
            <circle cx="48" cy="42" r="2.5" fill="#FFF" />
            <path d="M38,60 C42,65 58,65 62,60" stroke="#8E44AD" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </>
        );

      case 'stinkfly':
        return (
          <>
            <polygon points="50,15 80,45 65,85 35,85 20,45" fill="#5F8500" stroke="#709D00" strokeWidth="2.5" />
            <path d="M32,35 L12,20" stroke="#709D00" strokeWidth="4" strokeLinecap="round" />
            <circle cx="12" cy="20" r="7.5" fill="#EEFF41" filter={`url(#${filterId})`} />
            <circle cx="12" cy="20" r="3" fill="#000" />
            <path d="M68,35 L88,20" stroke="#709D00" strokeWidth="4" strokeLinecap="round" />
            <circle cx="88" cy="20" r="7.5" fill="#EEFF41" filter={`url(#${filterId})`} />
            <circle cx="88" cy="20" r="3" fill="#000" />
            <ellipse cx="50" cy="65" rx="8" ry="4" fill="#3D5600" />
          </>
        );

      case 'cannonbolt':
        return (
          <>
            <path d="M15,50 C15,25 32,15 50,15 C68,15 85,25 85,50 C85,72 68,85 50,85 C32,85 15,72 15,50 Z" fill="#EAEAEA" stroke="#D0D0D0" strokeWidth="2.5" />
            {/* Shell segments */}
            <path d="M30,22 C30,22 40,32 40,50 C40,68 30,78 30,78" stroke="#B0B0B0" strokeWidth="2.5" fill="none" />
            <path d="M70,22 C70,22 60,32 60,50 C60,68 70,78 70,78" stroke="#B0B0B0" strokeWidth="2.5" fill="none" />
            {/* Yellow shell plates */}
            <ellipse cx="50" cy="30" rx="10" ry="8" fill="#FFC107" stroke="#FFA000" strokeWidth="1.5" />
            <ellipse cx="50" cy="70" rx="10" ry="8" fill="#FFC107" stroke="#FFA000" strokeWidth="1.5" />
            {/* Tiny green eyes */}
            <circle cx="42" cy="50" r="2.5" fill="#00FF00" />
            <circle cx="58" cy="50" r="2.5" fill="#00FF00" />
          </>
        );

      case 'ripjaws':
        return (
          <>
            <path d="M20,50 C20,30 32,22 50,22 C68,22 80,30 80,50 C80,68 70,85 50,85 C30,85 20,68 20,50 Z" fill="#134E5E" stroke="#11998E" strokeWidth="2.5" />
            <path d="M50,22 Q50,2 62,6" fill="none" stroke="#11998E" strokeWidth="3.5" />
            <circle cx="62" cy="6" r="6" fill="#1FFFD3" />
            <path d="M26,62 Q50,82 74,62" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="32,60 36,60 34,67" fill="#FFF" />
            <polygon points="40,62 44,62 42,69" fill="#FFF" />
            <polygon points="48,63 52,63 50,71" fill="#FFF" />
            <polygon points="56,63 60,63 58,71" fill="#FFF" />
            <polygon points="64,62 68,62 66,69" fill="#FFF" />
            <polygon points="72,60 76,60 74,67" fill="#FFF" />
            <polygon points="34,40 44,43 38,48" fill="#1FFFD3" />
            <polygon points="66,40 56,43 62,48" fill="#1FFFD3" />
          </>
        );

      default:
        return (
          <circle cx="50" cy="50" r="20" fill="#00FF00" opacity="0.4" />
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden rounded-full ${className}`}>
      {!imgError ? (
        <div className="relative w-full h-full flex items-center justify-center p-0.5">
          {/* Hologram Matrix background effect */}
          <div className="absolute inset-0 bg-[#001500]/65 rounded-full border border-[#00ff00]/40 overflow-hidden shadow-[inset_0_0_15px_rgba(0,255,0,0.4)]">
            {/* Scanlines layer */}
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)',
              backgroundSize: '100% 3px'
            }}></div>
            {/* Spinning Radar Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00ff00]/10 to-transparent rounded-full animate-spin" style={{ animationDuration: '3.5s' }}></div>
          </div>

          {/* Creature Image from Uploads */}
          <img
            src={imagePath}
            alt={id}
            onError={() => setImgError(true)}
            className="w-[88%] h-[88%] object-contain rounded-full relative z-10 filter transition-all duration-300"
            style={{
              // Perfect Hologram Styling mapping to green screen watch display logic:
              filter: 'brightness(1.1) saturate(1.25) contrast(1.15) drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))',
            }}
            referrerPolicy="no-referrer"
          />

          {/* Glowing Green Reticle Overlay Lines */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 opacity-70">
            {/* Scope crosshairs */}
            <div className="absolute top-1 bottom-1 w-[1px] bg-[#00ff00]/30"></div>
            <div className="absolute left-1 right-1 h-[1px] bg-[#00ff00]/30"></div>
            {/* Interactive green scopes */}
            <div className="absolute w-[82%] h-[82%] border border-dashed border-[#00ff00]/40 rounded-full animate-pulse"></div>
            <div className="absolute w-[94%] h-[94%] border-2 border-[#00ff00]/25 rounded-full"></div>
            {/* Blinking sensor dots inside display */}
            <div className="absolute top-6 left-6 w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-ping"></div>
            <div className="absolute bottom-6 right-6 w-1 h-1 rounded-full bg-[#00ff00]"></div>
          </div>
        </div>
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(50,205,50,0.4)]"
        >
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {id === 'heatblast' && (
              <>
                <linearGradient id="heatblast-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF8C00" />
                  <stop offset="50%" stopColor="#FF4D00" />
                  <stop offset="100%" stopColor="#8B0000" />
                </linearGradient>
                <linearGradient id="heatblast-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFF700" />
                  <stop offset="100%" stopColor="#FF4D00" />
                </linearGradient>
              </>
            )}
          </defs>

          {/* Circular tech background placeholder */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="rgba(5, 12, 5, 0.85)"
            stroke="rgba(50, 205, 50, 0.25)"
            strokeWidth="2"
          />

          {/* Tech decorative crosshair markers */}
          <line x1="12" y1="50" x2="18" y2="50" stroke="rgba(50, 205, 50, 0.4)" strokeWidth="1.5" />
          <line x1="82" y1="50" x2="88" y2="50" stroke="rgba(50, 205, 50, 0.4)" strokeWidth="1.5" />
          <line x1="50" y1="12" x2="50" y2="18" stroke="rgba(50, 205, 50, 0.4)" strokeWidth="1.5" />
          <line x1="50" y1="82" x2="50" y2="88" stroke="rgba(50, 205, 50, 0.4)" strokeWidth="1.5" />

          {renderSvgFallback()}
        </svg>
      )}
    </div>
  );
};
