
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Image, Download, Music, Video, Palette, BarChart3, Box, Edit,
  FileText, Layers, Bot, Shield, Scissors, Film, Stamp, PenTool,
  PaintBucket, Camera, Film as FilmIcon, Music as MusicIcon,
  Brush, FileType, LucideIcon, Layers3, Wallpaper, Figma, Folder,
  Play, Cpu, Hammer, Palette as PaletteIcon, Code, FileImage,
  Settings, BookOpen, Zap, Database, Archive
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
    
    // Software icons
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
    if (name.includes('xd')) return Figma;
    if (name.includes('bridge')) return Folder;
    if (name.includes('videostudio')) return Play;
    if (name.includes('vegas')) return Video;
    if (name.includes('serato')) return Music;
    if (name.includes('captivate')) return Code;
    if (name.includes('pinnacle')) return Edit;
    if (name.includes('solidworks')) return Cpu;
    if (name.includes('zbrush')) return Hammer;
    if (name.includes('uniconverter')) return Video;
    if (name.includes('robohelp')) return BookOpen;
    if (name.includes('avs')) return Edit;
    if (name.includes('nitro')) return FileText;
    if (name.includes('systemcare')) return Settings;
    
    // Game cheat icons
    if (name.includes('gta') || name.includes('kiddions')) return Play;
    if (name.includes('krnl') || name.includes('executor') || name.includes('roblox')) return Bot;
    if (name.includes('among us')) return Shield;
    if (name.includes('forza') || name.includes('horizon')) return Zap;
    if (name.includes('minecraft')) return Box;
    if (name.includes('ea fc') || name.includes('fifa')) return Play;
    if (name.includes('cod') || name.includes('warzone') || name.includes('black ops')) return Zap;
    if (name.includes('8 ball') || name.includes('pool')) return Play;
    if (name.includes('cs2') || name.includes('counter-strike')) return Shield;
    if (name.includes('rdr') || name.includes('red dead')) return Play;
    if (name.includes('valorant')) return Zap;
    if (name.includes('lol') || name.includes('league of legends')) return Play;
    if (name.includes('albion')) return Shield;
    if (name.includes('rainbow six')) return Zap;
    if (name.includes('peak') || name.includes('trainer')) return Settings;
    if (name.includes('fortnite')) return Zap;
    if (name.includes('apex')) return Shield;
    if (name.includes('pubg')) return Zap;
    if (name.includes('tarkov')) return Shield;
    if (name.includes('destiny')) return Zap;
    if (name.includes('palworld')) return Play;
    if (name.includes('rust')) return Shield;
    if (name.includes('ark')) return Play;
    if (name.includes('finals')) return Zap;
    if (name.includes('dota')) return Play;
    if (name.includes('overwatch')) return Zap;
    if (name.includes('helldivers')) return Shield;
    if (name.includes('stalcraft')) return Zap;
    if (name.includes('enshrouded')) return Play;
    if (name.includes('squad')) return Shield;
    if (name.includes('hunt')) return Zap;
    if (name.includes('ghost of tsushima')) return Play;
    if (name.includes('horizon forbidden')) return Play;
    if (name.includes('spider-man')) return Play;
    if (name.includes('cyberpunk')) return Zap;
    if (name.includes('elden ring')) return Play;
    if (name.includes('baldur')) return Play;
    if (name.includes('starfield')) return Zap;
    if (name.includes('dayz')) return Shield;
    if (name.includes('sea of thieves')) return Play;
    if (name.includes('nba')) return Play;
    if (name.includes('monster hunter')) return Zap;
    if (name.includes('silent hill')) return Play;
    if (name.includes('alan wake')) return Play;
    if (name.includes('lies of p')) return Play;
    if (name.includes('assassin')) return Zap;
    if (name.includes('god of war')) return Play;
    if (name.includes('hogwarts')) return Play;
    if (name.includes('mortal kombat')) return Zap;
    if (name.includes('tekken')) return Play;
    if (name.includes('street fighter')) return Zap;
    if (name.includes('gran turismo')) return Play;
    if (name.includes('flight simulator')) return Play;
    if (name.includes('farming simulator')) return Play;
    if (name.includes('euro truck')) return Play;
    if (name.includes('kerbal')) return Zap;
    if (name.includes('cities')) return Settings;
    if (name.includes('total war')) return Shield;
    if (name.includes('company of heroes')) return Zap;
    if (name.includes('crusader kings')) return Play;
    if (name.includes('hearts of iron')) return Shield;
    if (name.includes('stellaris')) return Zap;
    if (name.includes('civilization')) return Play;
    if (name.includes('age of empires')) return Shield;
    if (name.includes('xcom')) return Zap;
    if (name.includes('warhammer')) return Play;
    if (name.includes('path of exile')) return Shield;
    if (name.includes('diablo')) return Zap;
    if (name.includes('world of warcraft')) return Bot;
    if (name.includes('lost ark')) return Bot;
    if (name.includes('black desert')) return Bot;
    if (name.includes('new world')) return Bot;
    if (name.includes('elder scrolls')) return Play;
    if (name.includes('fallout')) return Zap;
    if (name.includes('state of decay')) return Shield;
    if (name.includes('metro')) return Zap;
    if (name.includes('stalker')) return Play;
    if (name.includes('control')) return Zap;
    if (name.includes('payday')) return Shield;
    if (name.includes('witcher')) return Play;
    
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
