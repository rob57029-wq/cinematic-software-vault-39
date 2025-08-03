
import React from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { config } = useConfig();
  const { t } = useLanguage();
  
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black/40 border-t border-white/5 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-light tracking-tight gradient-text mb-2">
              {config.site_name}
            </h2>
            <p className="text-sm text-white/50 max-w-xs">
              {t("browseCollection")}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            {[
              { id: "home", label: t("home") },
              { id: "software", label: t("software") },
              { id: "reviews", label: t("reviews") },
              { id: "how-to-install", label: t("howToInstall") }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-8 pt-6 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {config.site_name}. {t("copyrightRights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
