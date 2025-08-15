
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import LanguageSelector from "./LanguageSelector";
import { useConfig } from "@/contexts/ConfigContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { config } = useConfig();
  const { t } = useLanguage();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glassmorphic-nav py-3" : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <span className="text-xl sm:text-2xl font-light tracking-tighter gradient-text">
            {config.site_name}
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {[
            { id: "home", label: t("home") },
            { id: "software", label: t("software") },
            { id: "reviews", label: t("reviews") },
            { id: "how-to-install", label: t("howToInstall") }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-white/80 hover:text-white transition-colors text-sm font-light"
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        {/* Language Selector */}
        <div className="hidden md:flex">
          <LanguageSelector />
        </div>
        
        {/* Mobile Burger */}
        <button
          className="md:hidden flex flex-col space-y-1.5 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn(
            "block w-6 h-0.5 bg-white transition-transform duration-300",
            isMenuOpen && "transform rotate-45 translate-y-2"
          )}></span>
          <span className={cn(
            "block w-6 h-0.5 bg-white transition-opacity duration-300",
            isMenuOpen && "opacity-0"
          )}></span>
          <span className={cn(
            "block w-6 h-0.5 bg-white transition-transform duration-300",
            isMenuOpen && "transform -rotate-45 -translate-y-2"
          )}></span>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-64 bg-background backdrop-blur-lg z-50 shadow-glass border-l border-white/5 transition-transform duration-300 ease-in-out transform",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col p-8 space-y-6">
          <div className="flex justify-between items-center mb-8">
            <span className="gradient-text text-lg font-light">{config.site_name}</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {[
            { id: "home", label: t("home") },
            { id: "software", label: t("software") },
            { id: "reviews", label: t("reviews") },
            { id: "how-to-install", label: t("howToInstall") }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-white/80 hover:text-white p-2 transition-colors text-lg font-light"
            >
              {item.label}
            </button>
          ))}
          
          <div className="mt-4">
            <LanguageSelector />
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Navbar;
