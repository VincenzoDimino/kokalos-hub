import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FlagIcon = ({ lang }) => {
  switch (lang) {
    case 'IT':
      return (
        <svg className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[3px] shadow-sm border border-slate-200/80 shrink-0" viewBox="0 0 3 2">
          <rect width="1" height="2" x="0" fill="#009246" />
          <rect width="1" height="2" x="1" fill="#ffffff" />
          <rect width="1" height="2" x="2" fill="#ce2b37" />
        </svg>
      );
    case 'EN':
      return (
        <svg className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[3px] shadow-sm border border-slate-200/80 shrink-0" viewBox="0 0 60 30">
          <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      );
    case 'FR':
      return (
        <svg className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[3px] shadow-sm border border-slate-200/80 shrink-0" viewBox="0 0 3 2">
          <rect width="1" height="2" x="0" fill="#002395" />
          <rect width="1" height="2" x="1" fill="#ffffff" />
          <rect width="1" height="2" x="2" fill="#ed2939" />
        </svg>
      );
    case 'DE':
      return (
        <svg className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[3px] shadow-sm border border-slate-200/80 shrink-0" viewBox="0 0 5 3">
          <rect width="5" height="3" y="0" fill="#000000" />
          <rect width="5" height="2" y="1" fill="#DD0000" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userToken = localStorage.getItem('kokalos_user_jwt');
  const userName = localStorage.getItem('kokalos_user_name');
  const adminToken = localStorage.getItem('kokalos_jwt');

  const goHomeTop = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') navigate('/');
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('kokalos_user_jwt');
    localStorage.removeItem('kokalos_user_name');
    localStorage.removeItem('kokalos_jwt');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Logo */}
        <a href="/" onClick={goHomeTop} className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-500 via-orange-500 to-amber-500 flex items-center justify-center text-white font-display font-extrabold text-base sm:text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
            K
          </div>
          <div className="min-w-0">
            <span className="font-display font-black text-sm sm:text-xl text-slate-900 tracking-tight block leading-none truncate">
              KOKALOS<span className="text-orange-500">HUB</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-sky-700 tracking-wider sm:tracking-widest uppercase block truncate">
              Sciacca • Sicilia
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-700">
          <a href="/" onClick={goHomeTop} className="hover:text-sky-600 transition-colors">{t.nav.home}</a>
          <a href="/#events" className="hover:text-sky-600 transition-colors">{t.nav.events}</a>
          <a href="/#verify" className="hover:text-sky-600 transition-colors">{t.nav.bookings}</a>
          <a href="/#feedback" className="hover:text-sky-600 transition-colors">{t.nav.feedback}</a>
        </nav>

        {/* Right Action Bar (Language Switcher & Auth) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Bandiera attiva + Language Selector */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center" title={`Lingua attiva: ${language}`}>
              <FlagIcon lang={language} />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              {['IT', 'EN', 'FR', 'DE'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === lang
                      ? 'bg-slate-900 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Autenticazione Condizionale Rigorosa */}
          {adminToken ? (
            <div className="flex items-center gap-3">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all glow-btn"
              >
                <ShieldCheck className="w-4 h-4" />
                Dashboard Admin
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Esci
              </button>
            </div>
          ) : userToken ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-all"
              >
                <User className="w-4 h-4 text-sky-600" />
                {userName || t.nav.userDashboard}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Esci
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-orange-500 text-white text-xs font-bold shadow-md transition-all glow-btn"
            >
              <User className="w-4 h-4" />
              {t.nav.loginRegister}
            </Link>
          )}

        </div>

        {/* Mobile menu button + Bandiera + Lingue */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <div className="flex items-center justify-center shrink-0" title={`Lingua attiva: ${language}`}>
            <FlagIcon lang={language} />
          </div>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 shrink-0">
            {['IT', 'EN', 'FR', 'DE'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-tight ${
                  language === lang ? 'bg-slate-900 text-white' : 'text-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Apri o chiudi menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-xl">
          
          {/* Tasto Dashboard condizionale posizionato sopra la Home */}
          {adminToken ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-orange-50 text-orange-600 font-bold"
            >
              <ShieldCheck className="w-4 h-4" />
              Dashboard Admin
            </Link>
          ) : userToken ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-sky-50 text-sky-700 font-bold"
            >
              <User className="w-4 h-4 text-sky-600" />
              {userName || t.nav.userDashboard}
            </Link>
          ) : null}

          <a href="/" onClick={goHomeTop} className="block py-2 font-bold text-slate-800">{t.nav.home}</a>
          <a href="/#events" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-bold text-slate-800">{t.nav.events}</a>
          <a href="/#verify" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-bold text-slate-800">{t.nav.bookings}</a>
          <a href="/#feedback" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-bold text-slate-800">{t.nav.feedback}</a>
          
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {adminToken || userToken ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-center text-xs"
              >
                Esci
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-sky-500 text-white font-bold text-center text-xs"
              >
                {t.nav.loginRegister}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}