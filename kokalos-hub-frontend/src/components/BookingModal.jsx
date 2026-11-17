import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function BookingModal({ event, onClose, onBooked }) {
  const { lang, t, getLocalizedField } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    visitorName: localStorage.getItem('kokalos_user_name') || '',
    visitorEmail: '',
    visitorPhone: '',
    numberOfTickets: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  const userToken = localStorage.getItem('kokalos_user_jwt');

  useEffect(() => {
    if (userToken) {
      api.get('/visitor/auth/me')
        .then((res) => {
          setForm((prev) => ({
            ...prev,
            visitorName: res.data.fullName || prev.visitorName,
            visitorEmail: res.data.email || prev.visitorEmail
          }));
        })
        .catch(() => {});
    }
  }, [userToken]);

  if (!event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userToken) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/bookings', {
        eventId: event.id,
        ...form,
        numberOfTickets: Number(form.numberOfTickets),
        preferredLanguage: lang
      });
      setCreatedBooking(res.data);
      if (onBooked) onBooked();
    } catch (err) {
      setError(err.response?.data || 'Errore durante la prenotazione.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border border-slate-200 shadow-2xl text-slate-900"
        >
          {/* Tasto X con contrasto eccellente */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg transition-all"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>

          {!userToken ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-9 h-9" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">Login Richiesto</h3>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">{t.bookingModal.loginRequired}</p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 shadow-md glow-btn"
                >
                  Accedi o Registrati
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300"
                >
                  Annulla
                </button>
              </div>
            </div>
          ) : !createdBooking ? (
            <>
              <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Ticket className="w-4 h-4 text-sky-600" />
                {t.bookingModal.title}
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-6 pr-8">
                {getLocalizedField(event, 'title')}
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.bookingModal.name}</label>
                  <input
                    required
                    type="text"
                    value={form.visitorName}
                    onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:border-sky-500 focus:outline-none shadow-sm"
                    placeholder="Mario Rossi"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Indirizzo Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.visitorEmail}
                      onChange={(e) => setForm({ ...form, visitorEmail: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:border-sky-500 focus:outline-none shadow-sm"
                      placeholder="mario@email.com"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.bookingModal.phone}
                    </label>
                    <input
                      type="text"
                      value={form.visitorPhone}
                      onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:border-sky-500 focus:outline-none shadow-sm"
                      placeholder="+39 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Numero di Biglietti (max {Math.min(10, event.availableSeats)})
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max={Math.min(10, event.availableSeats)}
                    value={form.numberOfTickets}
                    onChange={(e) => setForm({ ...form, numberOfTickets: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:border-sky-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-sm text-slate-700 font-medium">
                  <span>Totale da scalare dal Wallet:</span>
                  <span className="text-xl font-bold text-orange-600">
                    € {(event.ticketPrice * form.numberOfTickets).toFixed(2)}
                  </span>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 via-orange-500 to-amber-500 shadow-md glow-btn"
                >
                  {loading ? '...' : t.bookingModal.confirm}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">{t.bookingModal.successTitle}</h3>
              <p className="text-slate-600 text-sm">{t.bookingModal.successMsg} <strong className="text-slate-900">{createdBooking.visitorEmail}</strong></p>
              <div className="p-4 rounded-2xl bg-slate-100 border border-sky-300 font-mono text-2xl font-extrabold text-sky-700 tracking-wider flex items-center justify-center gap-2 shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {createdBooking.bookingCode}
              </div>
              <p className="text-xs text-sky-700 font-semibold">✓ Codice salvato nella tua Dashboard e importo scalato dal Wallet.</p>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold shadow glow-btn"
              >
                {t.bookingModal.close}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
