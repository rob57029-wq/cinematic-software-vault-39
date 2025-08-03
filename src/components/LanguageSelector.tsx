
import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  const handleChange = (value: string) => {
    setLanguage(value as Language);
  };

  return (
    <div className="flex items-center">
      <Globe className="mr-2 h-4 w-4 text-white/70" />
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger className="w-[110px] bg-transparent border-white/20 text-white/80">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
