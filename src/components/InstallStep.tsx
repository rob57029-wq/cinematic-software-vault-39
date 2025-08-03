
import React from 'react';
import { Download, Archive, MonitorPlay, Zap } from 'lucide-react';

interface InstallStepProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

const InstallStep: React.FC<InstallStepProps> = ({ number, title, description, delay = 0, className = '' }) => {
  // Choose icon based on step number
  const getStepIcon = () => {
    switch(number) {
      case 1: return <Download className="w-5 h-5 text-blue-400" />;
      case 2: return <Archive className="w-5 h-5 text-purple-400" />;
      case 3: return <MonitorPlay className="w-5 h-5 text-green-400" />;
      case 4: return <Zap className="w-5 h-5 text-yellow-400" />;
      default: return <Download className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div 
      className={`bg-glass-gradient backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-glass-sm relative reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -left-3">
        <span className="text-blue-400 text-lg font-light">{number}</span>
      </div>
      
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-8 h-8 rounded-full flex items-center justify-center">
        {getStepIcon()}
      </div>
      
      <h3 className="text-lg font-light mb-2 mt-2">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );
};

export default InstallStep;
