
import React, { useEffect, useState } from 'react';
import { SoftwareItem } from './SoftwareCard';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Image, Music, Video, Palette, BarChart3, Box, Edit,
  FileText, Layers, Bot, Shield, Scissors, Film, Stamp, PenTool,
  PaintBucket, Camera, Film as FilmIcon, Music as MusicIcon,
  Brush, FileType, LucideIcon, Layers3, Wallpaper
} from 'lucide-react';

interface SoftwareModalProps {
  software: SoftwareItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const SoftwareModal: React.FC<SoftwareModalProps> = ({ software, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { config } = useConfig();
  const { t } = useLanguage();
  
  // Function to determine which icon to use based on software name (same as SoftwareCard)
  const getSoftwareIcon = (softwareName: string): LucideIcon => {
    const name = softwareName.toLowerCase();
    
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
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(config.archive_password);
    setCopySuccess(true);
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  
  if (!software) return null;
  
  const IconComponent = getSoftwareIcon(software.name);
  
  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className={cn(
        "bg-glass-gradient backdrop-blur-md border border-white/10 shadow-glass rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 z-10",
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
      )}>
        <div className="relative p-6 md:p-8">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center bg-muted/50 relative">
              <IconComponent className="w-12 h-12 text-blue-400" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-light mb-2">{software.name}</h2>
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                <span>{software.version}</span>
                <span>|</span>
                <span>{software.releaseDate}</span>
                <span>|</span>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      key={i}
                      className={cn(
                        "w-4 h-4",
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
              <p className="text-white/80 text-sm md:text-base">{software.description}</p>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <a href={config.download_url} className="neumorphic-button w-full py-3 px-6 text-center text-blue-400 hover:text-blue-300 font-medium mb-4 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                {t("downloadNow")}
              </a>
              
              <div className="bg-black/30 border border-white/5 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium mb-2">{t("passwordForArchive")}:</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.archive_password}
                    readOnly
                    className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white/80 flex-1"
                  />
                  <button 
                    className={cn(
                      "bg-blue-600/80 hover:bg-blue-600 transition-colors px-3 py-2 rounded text-sm",
                      copySuccess && "bg-green-600/80"
                    )}
                    onClick={handleCopyPassword}
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-light mb-3">{t("howToInstall")}</h4>
              <ol className="space-y-3 list-decimal list-inside text-sm text-white/80">
                {software.installSteps.map((step, index) => (
                  <li key={index}>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-light mb-4 gradient-text">{t("features")}</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {software.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-1 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-light mb-4 gradient-text">{t("systemRequirements")}</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {software.systemRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-purple-400 mt-1 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareModal;
