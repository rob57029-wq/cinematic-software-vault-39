
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Image, Download, Music, Video, Palette, BarChart3, Box, Edit,
  FileText, Layers, Bot, Shield, Scissors, Film, Stamp, PenTool,
  PaintBucket, Camera, Film as FilmIcon, Music as MusicIcon,
  Brush, FileType, LucideIcon, Layers3, Wallpaper
} from 'lucide-react';

export interface SoftwareItem {
  id: string;
  name: string;
  icon: string;
  version: string;
  releaseDate: string;
  rating: number;
  description: string;
  installSteps: string[];
  features: string[];
  systemRequirements: string[];
}

interface SoftwareCardProps {
  software: SoftwareItem;
  onClick: () => void;
  className?: string;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ software, onClick, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Function to determine which icon to use based on software name
  const getSoftwareIcon = (): LucideIcon => {
    const name = software.name.toLowerCase();
    
    if (name.includes('photoshop')) return Image;
    if (name.includes('spotify')) return Music;
    if (name.includes('internet download')) return Download;
    if (name.includes('fl studio')) return MusicIcon;
    if (name.includes('davinci resolve')) return Video;
    if (name.includes('trading bot')) return BarChart3;
    if (name.includes('substance 3d')) return Box;
    if (name.includes('capcut')) return Edit;
    if (name.includes('acrobat')) return FileText;
    if (name.includes('after effects')) return Layers;
    if (name.includes('proton vpn')) return Shield;
    if (name.includes('wondershare')) return Scissors;
    if (name.includes('premiere pro')) return Film;
    if (name.includes('topaz')) return Stamp;
    if (name.includes('coreldraw')) return PenTool;
    if (name.includes('illustrator')) return PaintBucket;
    if (name.includes('lightroom')) return Camera;
    if (name.includes('media encoder')) return FilmIcon;
    if (name.includes('audition')) return Music;
    if (name.includes('fresco')) return Brush;
    if (name.includes('indesign')) return FileType;
    if (name.includes('animate')) return Layers3;
    if (name.includes('wallpaper')) return Wallpaper;
    
    // Default icon for any other software
    return Box;
  };
  
  const IconComponent = getSoftwareIcon();
  
  return (
    <div 
      className={cn("glass-card p-4 cursor-pointer group transition-all duration-300 hover:-translate-y-1", className)}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
          <IconComponent className="w-8 h-8 text-blue-400" />
        </div>
        <div className="star-rating flex">
          {Array(5).fill(0).map((_, i) => (
            <svg 
              key={i}
              className={cn(
                "w-4 h-4 transition-all duration-300 star",
                i < software.rating ? "text-yellow-400" : "text-gray-600"
              )}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          ))}
        </div>
      </div>
      
      <h3 className="text-lg font-normal text-white mb-1 group-hover:text-blue-400 transition-colors">
        {software.name}
      </h3>
      
      <div className="flex justify-between items-center text-xs text-white/60">
        <span>{software.version}</span>
        <span>{software.releaseDate}</span>
      </div>
      
      <div className={cn(
        "absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100"
      )}></div>
    </div>
  );
};

export default SoftwareCard;
