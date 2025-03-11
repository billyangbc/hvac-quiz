import React from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  imageSrc,
  imageAlt,
  className = '',
}) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-900/20 transition-all ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-cyan-500/10 p-3 rounded-lg">
          <Icon className="text-cyan-400" size={24} />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-slate-300 mb-6">
        {description}
      </p>
      <div className="relative h-48 rounded-lg overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default FeatureCard;
