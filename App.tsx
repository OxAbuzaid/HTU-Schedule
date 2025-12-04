import React, { useState, useEffect } from 'react';
import { Language, ViewState } from './types';
import { storageService } from './services/storage';
import { TRANSLATIONS } from './constants';
import { LanguageToggle } from './components/LanguageToggle';
import { Registration } from './views/Registration';
import { StudentLookup } from './views/StudentLookup';
import { Admin } from './views/Admin';
import { Summary } from './views/Summary';
import { LayoutGrid, UserSearch, PlusSquare, Table, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<ViewState>('registration');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    storageService.initialize();
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [lang]);

  const renderView = () => {
    switch(view) {
      case 'registration': return <Registration lang={lang} />;
      case 'lookup': return <StudentLookup lang={lang} />;
      case 'add-sections': return <Admin lang={lang} mode="add" />;
      case 'rebuild-sections': return <Admin lang={lang} mode="rebuild" />;
      case 'summary': return <Summary lang={lang} />;
      default: return <Registration lang={lang} />;
    }
  };

  const NavButton = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(target)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        view === target 
          ? 'bg-red-700 text-white shadow-lg' 
          : 'text-red-100 hover:bg-red-600 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white text-red-600 font-bold p-2 rounded">HTU</div>
            <h1 className="text-xl font-bold hidden md:block">{t.app_title}</h1>
          </div>
          <LanguageToggle current={lang} onToggle={setLang} />
        </div>
        
        {/* Navigation */}
        <div className="bg-red-800 overflow-x-auto">
          <div className="container mx-auto px-4 py-2 flex gap-2 min-w-max">
            <NavButton target="registration" icon={LayoutGrid} label={t.nav_register} />
            <NavButton target="lookup" icon={UserSearch} label={t.nav_lookup} />
            <NavButton target="add-sections" icon={PlusSquare} label={t.nav_add_sections} />
            <NavButton target="rebuild-sections" icon={RotateCcw} label={t.nav_rebuild} />
            <NavButton target="summary" icon={Table} label={t.nav_summary} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderView()}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} HTU Schedule System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;