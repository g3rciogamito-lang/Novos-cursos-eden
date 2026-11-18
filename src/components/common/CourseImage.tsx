import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface CourseImageProps {
  src: string;
  alt: string;
  title?: string;
  accentColor?: string;
  className?: string;
  aspectClassName?: string;
}

export const CourseImage: React.FC<CourseImageProps> = ({
  src,
  alt,
  title,
  accentColor = '#176BFF',
  className = '',
  aspectClassName = 'aspect-video',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none ${aspectClassName} ${className}`}
        style={{
          background: `radial-gradient(75% 75% at 30% 25%, ${accentColor}38 0%, #020B1C 72%)`,
        }}
        role="img"
        aria-label={alt}
      >
        <div className="w-11 h-11 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white/80 mb-3">
          <BookOpen className="w-5 h-5" />
        </div>
        {title && (
          <p className="font-display text-sm font-semibold text-white/90 max-w-[220px] leading-snug">
            {title}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#020B1C] ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
};
