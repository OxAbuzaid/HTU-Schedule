import React from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface Props {
  current: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<Props> = ({ current, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(current === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
    >
      <Globe size={18} />
      <span className="font-bold">{current === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};