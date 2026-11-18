import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" onClick={goHomeTop} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-orange-500 to-amber-500 flex items-center justify-center text-white font-display font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <span className="font-display font-black text-xl text-slate-900 tracking-tight block leading-none">
              KOKALOS<span className="text-orange-500">HUB</span>
            </span>
            <span className="text-[10px] font-bold text-sky-700 tracking-widest uppercase">
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
          
          {/* Language Selector */}
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

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
            {['IT', 'EN', 'FR', 'DE'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-full text-[10px] font-bold ${language === lang ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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