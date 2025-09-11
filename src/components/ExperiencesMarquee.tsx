import React from 'react';
import Marquee from './magicui/Marquee';

type ExperienceLogo = {
  src: string;
  alt: string;
};

interface ExperiencesMarqueeProps {
  logos: ExperienceLogo[];
  speedMs?: number;
}

export default function ExperiencesMarquee({ logos, speedMs = 20000 }: ExperiencesMarqueeProps) {
  return (
    <Marquee pauseOnHover className={`[--duration:${Math.max(2000, speedMs)}ms]`}>
      {logos.map((logo, idx) => (
        <div key={idx} className="shrink-0 opacity-80 hover:opacity-100 transition">
          <img src={logo.src} alt={logo.alt} className="h-12 w-auto object-contain" />
        </div>
      ))}
    </Marquee>
  );
}


