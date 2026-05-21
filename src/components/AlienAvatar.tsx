import React from 'react';

interface Props {
  id: string;
  className?: string;
  glow?: boolean;
  imageUrl?: string;
}

export const AlienAvatar: React.FC<Props> = ({ id, className = 'w-32 h-32', glow = true, imageUrl }) => {
  const filterId = `neon-glow-${id}`;

  const renderContent = () => {
    if (imageUrl) {
      return (
        <foreignObject x="15" y="15" width="70" height="70">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={id} 
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,255,0,0.6)] brightness-110 contrast-125 mix-blend-screen opacity-80"
              style={{
                filter: `drop-shadow(0 0 10px #00ff00) hue-rotate(${id === 'heatblast' ? '0deg' : '0deg'})`
              }}
            />
          </div>
        </foreignObject>
      );
    }

    switch (id) {
      case 'heatblast':
        return (
          <>
            {/* Flames background pattern */}
            <path d="M25,80 C15,65 10,45 25,25 C30,15 45,5 50,20 C55,5 70,15 75,25 C90,45 85,65 75,80 Z" fill="url(#heatblast-grad-1)" />
            <path d="M35,75 C25,65 25,50 35,35 C40,25 48,15 50,25 C52,15 60,25 65,35 C75,50 75,65 65,75 Z" fill="url(#heatblast-grad-2)" />
            {/* Rocky base mask/lines */}
            <path d="M30,50 L50,60 L70,50 L65,72 L50,85 L35,72 Z" fill="#2C0F00" stroke="#FF4D00" strokeWidth="2" />
            {/* High energy eyes */}
            <polygon points="40,55 46,54 44,59" fill="#FFF" filter={`url(#${filterId})`} />
            <polygon points="60,55 54,54 56,59" fill="#FFF" filter={`url(#${filterId})`} />
            <path d="M50,60 L45,67 L55,67 Z" fill="#FFD700" />
          </>
        );

      case 'xlr8':
        return (
          <>
            {/* Cyber Visor Base */}
            <path d="M20,60 L30,30 L70,30 L80,60 L50,80 Z" fill="#111" stroke="#00F0FF" strokeWidth="3" />
            {/* Slanted racing stripes */}
            <path d="M50,15 L45,30 L55,30 Z" fill="#00F0FF" />
            {/* Glowing cyan visor strip */}
            <path d="M24,48 L50,38 L76,48 L74,52 L50,42 L26,52 Z" fill="#00F0FF" filter={`url(#${filterId})`} />
            {/* Sleek aerodynamics */}
            <path d="M15,45 L10,50 L20,53 Z" fill="#111" stroke="#00F0FF" strokeWidth="1" />
            <path d="M85,45 L90,50 L80,53 Z" fill="#111" stroke="#00F0FF" strokeWidth="1" />
            <circle cx="50" cy="65" r="4" fill="#00F0FF" />
          </>
        );

      case 'diamondhead':
        return (
          <>
            {/* Sharp crystalline sharp helmet */}
            <polygon points="50,15 78,50 65,85 35,85 22,50" fill="#007F52" stroke="#00FFA3" strokeWidth="3" />
            {/* Inner crystalline shards */}
            <polygon points="50,22 72,50 50,78 28,50" fill="#00FFA3" opacity="0.3" />
            {/* Crystal crown structure */}
            <polygon points="50,15 50,78" stroke="#00FFA3" strokeWidth="2" />
            <polygon points="22,50 78,50" stroke="#00FFA3" strokeWidth="1.5" />
            {/* Glowing crystal eyes */}
            <polygon points="38,42 45,45 39,48" fill="#FFF" filter={`url(#${filterId})`} />
            <polygon points="62,42 55,45 61,48" fill="#FFF" filter={`url(#${filterId})`} />
            <polygon points="50,5 50,20 45,15" fill="#00FFA3" />
          </>
        );

      case 'fourarms':
        return (
          <>
            {/* Bulky skull structure */}
            <path d="M25,35 C25,25 35,20 50,20 C65,20 75,25 75,35 L75,65 C75,75 65,85 50,85 C35,85 25,75 25,65 Z" fill="#A8151B" stroke="#FF1E27" strokeWidth="2.5" />
            {/* Central muscle stripes */}
            <path d="M47,20 L53,20 L53,45 L47,45 Z" fill="#1A1A1A" />
            {/* 4 neon yellow glowing eyes */}
            {/* Left Top */}
            <circle cx="38" cy="38" r="4" fill="#FFD700" filter={`url(#${filterId})`} />
            {/* Right Top */}
            <circle cx="62" cy="38" r="4" fill="#FFD700" filter={`url(#${filterId})`} />
            {/* Left Bottom */}
            <circle cx="40" cy="48" r="4.5" fill="#FFD700" filter={`url(#${filterId})`} />
            {/* Right Bottom */}
            <circle cx="60" cy="48" r="4.5" fill="#FFD700" filter={`url(#${filterId})`} />
            {/* Stern chin structure */}
            <path d="M40,68 C45,72 55,72 60,68" stroke="#FFD700" strokeWidth="3" fill="none" />
          </>
        );

      case 'upgrade':
        return (
          <>
            {/* Liquid tech dome */}
            <path d="M25,70 C20,40 30,20 50,20 C70,20 80,40 75,70 C70,82 50,85 50,85 C50,85 30,82 25,70 Z" fill="#111" stroke="#32CD32" strokeWidth="3" />
            {/* Glowing mechanical cyclopean eye */}
            <circle cx="50" cy="42" r="10" fill="#32CD32" filter={`url(#${filterId})`} />
            <circle cx="50" cy="42" r="5" fill="#FFF" />
            {/* Circuit wiring trails */}
            <path d="M50,52 L50,75" stroke="#32CD32" strokeWidth="2.5" strokeDasharray="4 2" />
            <path d="M40,42 L25,42 C20,42 18,50 18,55" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M60,42 L75,42 C80,42 82,50 82,55" stroke="#32CD32" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="18" cy="55" r="2.5" fill="#32CD32" />
            <circle cx="82" cy="55" r="2.5" fill="#32CD32" />
          </>
        );

      case 'alien_x':
        return (
          <>
            {/* Dark cosmic starry body head */}
            <path d="M25,35 C20,25 30,12 40,20 C43,10 50,5 57,20 C67,12 75,25 75,35 C75,55 68,80 50,80 C32,80 25,55 25,35 Z" fill="#020205" stroke="#00FF00" strokeWidth="2.5" />
            {/* Starry dots */}
            <circle cx="35" cy="40" r="1.5" fill="#FFF" />
            <circle cx="45" cy="50" r="1" fill="#FFF" />
            <circle cx="55" cy="60" r="1.5" fill="#FFF" />
            <circle cx="65" cy="35" r="1" fill="#FFF" />
            {/* Glowing neon green eyes */}
            <polygon points="36,44 46,46 40,51" fill="#00FF00" filter={`url(#${filterId})`} />
            <polygon points="64,44 54,46 60,51" fill="#00FF00" filter={`url(#${filterId})`} />
          </>
        );

      case 'ampfibian':
        return (
          <>
            {/* Jellyfish electrical blue dome head */}
            <path d="M20,40 C20,20 30,15 50,15 C70,15 80,20 80,40 C80,55 72,70 50,70 C28,70 20,55 20,40 Z" fill="#0D2E40" stroke="#00F0FF" strokeWidth="2.5" />
            {/* Flowing blue water electrical channels */}
            <path d="M35,22 Q50,45 65,22" stroke="#00F0FF" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M30,35 Q50,60 70,35" stroke="#00F0FF" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* Glowing green slanted eyes */}
            <polygon points="32,42 42,46 36,48" fill="#00FF00" filter={`url(#${filterId})`} />
            <polygon points="68,42 58,46 64,48" fill="#00FF00" filter={`url(#${filterId})`} />
            {/* Small dangling electrode nodes on head base */}
            <circle cx="35" cy="70" r="3" fill="#00F0FF" />
            <circle cx="50" cy="72" r="3" fill="#00F0FF" />
            <circle cx="65" cy="70" r="3" fill="#00F0FF" />
          </>
        );

      case 'stinkfly':
        return (
          <>
            {/* Triangular buggy head shape */}
            <polygon points="50,15 80,45 65,85 35,85 20,45" fill="#5F8500" stroke="#709D00" strokeWidth="2.5" />
            {/* Four yellow stalk eyes pointing outer */}
            {/* Top Left Stalk */}
            <path d="M32,35 L12,20" stroke="#709D00" strokeWidth="4" strokeLinecap="round" />
            <circle cx="12" cy="20" r="7.5" fill="#EEFF41" filter={`url(#${filterId})`} />
            <circle cx="12" cy="20" r="3" fill="#000" />
            {/* Top Right Stalk */}
            <path d="M68,35 L88,20" stroke="#709D00" strokeWidth="4" strokeLinecap="round" />
            <circle cx="88" cy="20" r="7.5" fill="#EEFF41" filter={`url(#${filterId})`} />
            <circle cx="88" cy="20" r="3" fill="#000" />
            {/* Bottom Left Stalk */}
            <path d="M26,52 L6,52" stroke="#709D00" strokeWidth="4" strokeLinecap="round" />
            <circle cx="6" cy="52" r="7.5" fill="#EEFF41" filter={`url(#${filterId})`} />
            <circle cx="6" cy="52" r="3" fill="#000" />
            {/* Bottom Right Stalk */}
            <path d="M74,52 L94,52" stroke="#709D00" strokeWidth="4" strokeLinecap="round" />
            <circle cx="94" cy="52" r="7.5" fill="#EEFF41" filter={`url(#${filterId})`} />
            <circle cx="94" cy="52" r="3" fill="#000" />
            {/* Viscous breathing slots */}
            <ellipse cx="50" cy="65" rx="8" ry="4" fill="#3D5600" />
            <line x1="50" y1="61" x2="50" y2="69" stroke="#EEFF41" strokeWidth="2.5" />
          </>
        );

      case 'goop':
        return (
          <>
            {/* Highly fluid translucent green gel head and drop */}
            <path d="M25,50 C23,35 35,20 50,15 C65,20 77,35 75,50 C73,65 60,82 50,82 C40,82 27,65 25,50 Z" fill="rgba(0, 255, 100, 0.25)" stroke="#00FF00" strokeWidth="2.5" />
            {/* Floating hover saucers node above head */}
            <ellipse cx="50" cy="8" rx="14" ry="4" fill="#111" stroke="#00FF00" strokeWidth="1.5" />
            <line x1="50" y1="8" x2="50" y2="15" stroke="#00FF00" strokeWidth="2" />
            {/* Internal floating core nucleus */}
            <circle cx="50" cy="45" r="8" fill="#00FF00" opacity="0.5" />
            {/* Highly bright small fluorescent eyes */}
            <ellipse cx="40" cy="40" rx="3.5" ry="1.5" fill="#00FF00" filter={`url(#${filterId})`} />
            <ellipse cx="60" cy="40" rx="3.5" ry="1.5" fill="#00FF00" filter={`url(#${filterId})`} />
          </>
        );

      case 'rath':
        return (
          <>
            {/* Robust tiger tiger Appoplexian skull orange/white */}
            <path d="M20,40 C20,25 35,20 50,20 C65,20 80,25 80,40 C80,55 75,75 50,78 C25,75 20,55 20,40 Z" fill="#D35400" stroke="#FF6A00" strokeWidth="2.5" />
            {/* Rath's prominent single black horn on forehead */}
            <polygon points="50,10 44,22 56,22" fill="#111" stroke="#FF6A00" strokeWidth="1" />
            {/* Black stripes */}
            <path d="M28,30 L38,32" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M72,30 L62,32" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
            {/* Heavy white snarling cheek jaw lines */}
            <path d="M30,55 C35,65 65,65 70,55" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Glowing narrow green feline eyes */}
            <polygon points="32,38 43,40 37,44" fill="#00FF00" filter={`url(#${filterId})`} />
            <polygon points="68,38 57,40 63,44" fill="#00FF00" filter={`url(#${filterId})`} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(50,205,50,0.4)]"
      >
        <defs>
          {/* Neon Glow Filter */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Special Gradients */}
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

        {renderContent()}
      </svg>
    </div>
  );
};
