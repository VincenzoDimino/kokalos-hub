import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wallet, Ticket, Plus, LogOut, CheckCircle2, XCircle, MessageSquare, Pencil, Trash2, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function UserDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const userToken = localStorage.getItem('kokalos_user_jwt');

  useEffect(() => {
    if (!userToken) {
      navigate('/login');
      return;
    }
    loadProfile();
    loadMyBookings();
    loadMyFeedbacks();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/visitor/auth/me', { headers: { Authorization: `Bearer ${userToken}` } });
      setProfile(res.data);
    } catch (err) {
      console.log('Error loading profile');
    }
  };

  const loadMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my', { headers: { Authorization: `Bearer ${userToken}` } });
      setMyBookings(res.data);
    } catch (err) {
      console.log('Error loading bookings');
    }
  };

  const loadMyFeedbacks = async () => {
    try {
      const res = await api.get('/feedbacks/my', { headers: { Authorization: `Bearer ${userToken}` } });
      setMyFeedbacks(res.data || []);
    } catch (err) { console.log('Error loading feedbacks'); }
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/feedbacks/${editingFeedback.id}`, {
        eventId: editingFeedback.event.id, authorName: editingFeedback.authorName,
        nationality: editingFeedback.nationality, rating: Number(editingFeedback.rating), comment: editingFeedback.comment
      }, { headers: { Authorization: `Bearer ${userToken}` } });
      setEditingFeedback(null);
      setSuccessMsg('Recensione aggiornata con successo.');
      await loadMyFeedbacks();
    } catch (err) { setErrorMsg(err.response?.data || 'Impossibile modificare la recensione.'); }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Vuoi eliminare definitivamente questa recensione?')) return;
    try {
      await api.delete(`/feedbacks/${id}`, { headers: { Authorization: `Bearer ${userToken}` } });
      await loadMyFeedbacks();
      setSuccessMsg('Recensione eliminata.');
    } catch (err) { setErrorMsg(err.response?.data || 'Impossibile eliminare la recensione.'); }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.post('/visitor/auth/wallet/topup', { amount: parseFloat(topUpAmount) }, { headers: { Authorization: `Bearer ${userToken}` } });
      setProfile({ ...profile, walletBalance: res.data.walletBalance });
      setSuccessMsg('Ricarica wallet effettuata con successo!');
    } catch (err) {
      setErrorMsg(err.response?.data || 'Errore ricarica wallet.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Vuoi cancellare questa prenotazione? Il rimborso sarà accreditato immediatamente sul Wallet.')) return;
    setErrorMsg(''); setSuccessMsg('');
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {}, { headers: { Authorization: `Bearer ${userToken}` } });
      await Promise.all([loadProfile(), loadMyBookings()]);
      setSuccessMsg('Prenotazione cancellata: rimborso accreditato immediatamente sul Wallet.');
    } catch (err) {
      setErrorMsg(typeof err.response?.data === 'string' ? err.response.data : 'Impossibile cancellare la prenotazione.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kokalos_user_jwt');
    localStorage.removeItem('kokalos_user_name');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header Area */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <User className="w-4 h-4" />
            {t.userDash.title}
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900">
            Benvenuto, {profile?.fullName || 'Visitatore'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            {t.userDash.subtitle}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Esci
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Wallet & Topup Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-sky-950 rounded-3xl p-6 text-white shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-sky-300 uppercase">{t.userDash.walletTitle}</span>
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
            <div className="font-display text-4xl font-black">
              € {profile?.walletBalance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-slate-300">
              Utilizza il credito del wallet per prenotare istantaneamente eventi e tour guidati a Sciacca.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">{t.userDash.topUpBtn}</h3>
            {successMsg && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">{successMsg}</div>}
            {errorMsg && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold">{errorMsg}</div>}
            
            <form onSubmit={handleTopUp} className="space-y-3">
              <select
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:border-sky-500 focus:outline-none"
              >
                <option value={20}>€ 20.00</option>
                <option value={50}>€ 50.00</option>
                <option value={100}>€ 100.00</option>
                <option value={200}>€ 200.00</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 text-xs shadow-md glow-btn flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Ricarica Immediata
              </button>
            </form>
          </div>
        </div>

        {/* My Bookings List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-sky-600" /> {t.userDash.myBookings}
            </h2>
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
              {myBookings.length} prenotazioni attive
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {t.userDash.noBookings}
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                      {b.bookingCode}
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-900 pt-1">
                      {b.event?.titleIt || 'Evento Culturale'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Posti riservati: <b>{b.numberOfTickets}</b> • Data: {b.event?.eventDate ? new Date(b.event.eventDate).toLocaleDateString() : 'Programmato'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                      <><CheckCircle2 className="w-3.5 h-3.5" /> {b.status || 'CONFERMATO'}</>
                    </span>
                    <button onClick={() => handleCancelBooking(b.id)} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5"/> Annulla e rimborsa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recensioni personali: una sola per evento, modificabile o eliminabile */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
          <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-sky-600" /> Le mie recensioni</h2>
          {myFeedbacks.length === 0 ? <p className="text-sm text-slate-500">Non hai ancora pubblicato recensioni.</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myFeedbacks.map((feedback) => <div key={feedback.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              {editingFeedback?.id === feedback.id ? <form onSubmit={handleUpdateFeedback} className="space-y-3">
                <p className="font-bold text-slate-900">{feedback.event?.titleIt || 'Evento'}</p>
                <input required value={editingFeedback.authorName} onChange={e => setEditingFeedback({...editingFeedback, authorName:e.target.value})} className="w-full p-2 rounded-lg border" placeholder="Nome e cognome" />
                <input required value={editingFeedback.nationality} onChange={e => setEditingFeedback({...editingFeedback, nationality:e.target.value})} className="w-full p-2 rounded-lg border" placeholder="Città e paese" />
                <select value={editingFeedback.rating} onChange={e => setEditingFeedback({...editingFeedback, rating:Number(e.target.value)})} className="w-full p-2 rounded-lg border">{[5,4,3,2,1].map(n=><option key={n} value={n}>{n}/5 stelle</option>)}</select>
                <textarea required rows="3" value={editingFeedback.comment} onChange={e => setEditingFeedback({...editingFeedback, comment:e.target.value})} className="w-full p-2 rounded-lg border" />
                <div className="flex gap-2"><button className="px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center gap-1"><Save className="w-4 h-4"/> Salva</button><button type="button" onClick={()=>setEditingFeedback(null)} className="px-3 py-2 rounded-lg bg-slate-200 text-xs font-bold">Annulla</button></div>
              </form> : <><div className="flex justify-between gap-3"><div><p className="font-bold text-slate-900">{feedback.event?.titleIt || 'Evento'}</p><p className="text-xs text-slate-500">{feedback.authorName} · {feedback.nationality}</p></div><span className="text-amber-500 font-bold">★ {feedback.rating}/5</span></div><p className="text-sm text-slate-700">{feedback.comment}</p><div className="flex gap-2"><button onClick={()=>setEditingFeedback({...feedback})} className="px-3 py-2 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold flex items-center gap-1"><Pencil className="w-3.5 h-3.5"/> Modifica</button><button onClick={()=>handleDeleteFeedback(feedback.id)} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center gap-1"><Trash2 className="w-3.5 h-3.5"/> Elimina</button></div></>}
            </div>)}
          </div>}
        </div>

      </div>
    </div>
  );
}
