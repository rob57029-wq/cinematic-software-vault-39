
import React from 'react';
import { X } from 'lucide-react';
import { SoftwareItem } from './SoftwareCard';
import { Button } from '@/components/ui/button';
import { useConfig } from '@/contexts/ConfigContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SoftwareModalProps {
  software: SoftwareItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const SoftwareModal: React.FC<SoftwareModalProps> = ({ software, isOpen, onClose }) => {
  const { config } = useConfig();
  const { t } = useLanguage();
  
  if (!software) return null;
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          ></div>
          
          <div 
            className="glass-modal relative bg-background/80 backdrop-blur-md w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-white/10 shadow-glow rounded-lg"
          >
            <div className="sticky top-0 z-10 px-6 py-4 backdrop-blur-md bg-background/50 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-medium">{software.name}</h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-white/60 text-sm mb-2">{t("version")}</h3>
                    <p className="text-white">{software.version}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white/60 text-sm mb-2">{t("releaseDate")}</h3>
                    <p className="text-white">{software.releaseDate}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white/60 text-sm mb-2">{t("password")}</h3>
                    <div className="flex items-center gap-2">
                      <code className="bg-white/10 px-3 py-1 rounded font-mono text-sm">
                        {config.archive_password}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(config.download_url, '_blank')}
                    >
                      {t("download")} {software.name}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-white/60 text-sm mb-2">{t("features")}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {software.features.map((feature, idx) => (
                        <li key={idx} className="text-white/80 text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white/60 text-sm mb-2">{t("systemRequirements")}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {software.systemRequirements.map((req, idx) => (
                        <li key={idx} className="text-white/80 text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-white/60 text-sm mb-2">{t("installationSteps")}</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {software.installSteps.map((step, idx) => (
                    <li key={idx} className="text-white/80 text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoftwareModal;
