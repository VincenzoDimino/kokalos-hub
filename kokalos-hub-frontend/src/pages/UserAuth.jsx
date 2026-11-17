import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function UserAuth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await api.post('/visitor/auth/register', form);
        setIsRegister(false);
        alert('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
      } else {
        const res = await api.post('/visitor/auth/login', {
          username: form.username,
          password: form.password
        });
        const role = res.data.role;
        const token = res.data.token;
        const fullName = res.data.fullName;

        if (role === 'ADMIN') {
          localStorage.setItem('kokalos_jwt', token);
          localStorage.removeItem('kokalos_user_jwt');
          localStorage.removeItem('kokalos_user_name');
          navigate('/admin/dashboard');
        } else {
          localStorage.setItem('kokalos_user_jwt', token);
          localStorage.setItem('kokalos_user_name', fullName);
          localStorage.removeItem('kokalos_jwt');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data || 'Errore di autenticazione. Verifica le credenziali.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl max-w-md w-full space-y-6 text-slate-800">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/15 text-sky-600 mb-1">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isRegister ? t.auth.registerTitle : t.auth.welcomeTitle}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            {isRegister ? 'Crea il tuo account visitatore per prenotare e lasciare feedback' : t.auth.welcomeSubtitle}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.auth.fullName}</label>
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
            <input
              required
              type="text"
              placeholder={t.auth.usernamePlaceholder}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              required
              type="password"
              placeholder={t.auth.passwordPlaceholder}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 shadow-md glow-btn flex items-center justify-center gap-2"
          >
            {isRegister ? t.auth.registerBtn : t.auth.loginBtn}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            {isRegister ? t.auth.haveAccount : t.auth.noAccount} <span className="underline">{isRegister ? t.auth.loginLink : t.auth.registerLink}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
