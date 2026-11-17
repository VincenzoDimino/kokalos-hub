import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart3, Calendar, Ticket, MessageSquare, LogOut, Plus, Trash2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

  // New Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    titleIt: '',
    titleEn: '',
    titleFr: '',
    titleDe: '',
    descriptionIt: '',
    descriptionEn: '',
    descriptionFr: '',
    descriptionDe: '',
    category: 'CARNEVALE',
    location: 'Sciacca',
    eventDate: '',
    eventEnd: '',
    ticketPrice: 15.0,
    maxCapacity: 100,
    availableSeats: 100,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    featured: true
  });
  const [createError, setCreateError] = useState('');

  const adminToken = localStorage.getItem('kokalos_jwt');

  useEffect(() => {
    if (!adminToken) {
      navigate('/login');
      return;
    }
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      if (activeTab === 'stats') {
        const res = await api.get('/admin/stats', { headers });
        setStats(res.data);
      } else if (activeTab === 'events') {
        const res = await api.get('/events');
        setEvents(res.data);
      } else if (activeTab === 'bookings') {
        const res = await api.get('/admin/bookings', { headers });
        setBookings((res.data || []).filter(b => b.status !== 'CANCELLED'));
      } else if (activeTab === 'feedbacks') {
        const res = await api.get('/admin/feedbacks', { headers });
        setFeedbacks(res.data);
      }
    } catch (err) {
      setError('Errore nel caricamento dati admin o sessione scaduta.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kokalos_jwt');
    navigate('/login');
  };

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const payload = {
        ...newEvent,
        ticketPrice: Number(newEvent.ticketPrice),
        maxCapacity: Number(newEvent.maxCapacity),
        availableSeats: Number(newEvent.maxCapacity),
        eventDate: newEvent.eventDate,
        eventEnd: newEvent.eventEnd
      };
      if (editingEventId) {
        await api.put(`/admin/events/${editingEventId}`, payload, { headers });
      } else {
        await api.post('/admin/events', payload, { headers });
      }
      setShowCreateModal(false);
      setEditingEventId(null);
      setNewEvent({
        titleIt: '',
        titleEn: '',
        titleFr: '',
        titleDe: '',
        descriptionIt: '',
        descriptionEn: '',
        descriptionFr: '',
        descriptionDe: '',
        category: 'CARNEVALE',
        location: 'Sciacca',
        eventDate: '',
        eventEnd: '',
        ticketPrice: 15.0,
        maxCapacity: 100,
        availableSeats: 100,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        featured: true
      });
      loadData();
    } catch (err) {
      setCreateError(typeof err.response?.data === 'string' ? err.response.data : `Errore durante ${editingEventId ? 'la modifica' : 'la creazione'} dell'evento.`);
    }
  };

  const handleEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setCreateError('');
    setNewEvent({
      titleIt: ev.titleIt || '', titleEn: ev.titleEn || '', titleFr: ev.titleFr || '', titleDe: ev.titleDe || '',
      descriptionIt: ev.descriptionIt || '', descriptionEn: ev.descriptionEn || '', descriptionFr: ev.descriptionFr || '', descriptionDe: ev.descriptionDe || '',
      category: ev.category || 'CARNEVALE', location: ev.location || 'Sciacca',
      eventDate: ev.eventDate ? ev.eventDate.slice(0, 16) : '',
      eventEnd: ev.eventEnd ? ev.eventEnd.slice(0, 16) : '',
      ticketPrice: ev.ticketPrice ?? 0, maxCapacity: ev.maxCapacity ?? 1,
      availableSeats: ev.availableSeats ?? ev.maxCapacity ?? 1,
      imageUrl: ev.imageUrl || '', featured: Boolean(ev.featured)
    });
    setShowCreateModal(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo evento?')) return;
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      await api.delete(`/admin/events/${id}`, { headers });
      loadData();
    } catch (err) {
      alert(typeof err.response?.data === 'string' ? err.response.data : 'Errore eliminazione evento');
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      await api.delete(`/admin/feedbacks/${id}`, { headers });
      loadData();
    } catch (err) {
      alert('Errore eliminazione feedback');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Admin */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/15 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            {t.adminDash.title}
          </div>
          <h1 className="font-display text-3xl font-black text-slate-900">
            {t.adminDash.title}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            {t.adminDash.subtitle}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t.adminDash.logout}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'stats', label: t.adminDash.statsTab, icon: BarChart3 },
            { id: 'events', label: t.adminDash.eventsTab, icon: Calendar },
            { id: 'bookings', label: t.adminDash.bookingsTab, icon: Ticket },
            { id: 'feedbacks', label: t.adminDash.feedbacksTab, icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'events' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-sky-500 to-orange-500 text-white shadow-md glow-btn flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Crea Nuovo Evento
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-6">
            {error}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.adminDash.activeEvents}</span>
              <div className="font-display text-4xl font-black text-slate-900">{stats.totalEvents}</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.adminDash.totalBookings}</span>
              <div className="font-display text-4xl font-black text-slate-900">{stats.totalBookings}</div>
              <div className="text-xs text-emerald-600 font-bold">{stats.confirmedBookings} confermate</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.adminDash.confirmedRevenue}</span>
              <div className="font-display text-4xl font-black text-slate-900">€ {stats.estimatedRevenue?.toFixed(2)}</div>
              <div className="text-xs text-slate-500">{stats.totalTicketsReserved} biglietti riservati</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.adminDash.avgRating}</span>
              <div className="font-display text-4xl font-black text-amber-500">{stats.averageRating} / 5</div>
              <div className="text-xs text-slate-500">Su {stats.totalFeedbacks} recensioni</div>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-bold text-slate-900">{t.adminDash.eventsTab}</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm">
                  <div className="p-4 space-y-2">
                    <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold">{ev.category}</span>
                    <h3 className="font-display font-bold text-sm text-slate-900">{ev.titleIt}</h3>
                    <p className="text-xs text-slate-500">Inizio: {ev.eventDate ? new Date(ev.eventDate).toLocaleString('it-IT') : '—'}</p>
                    <p className="text-xs text-slate-500">Fine: {ev.eventEnd ? new Date(ev.eventEnd).toLocaleString('it-IT') : '—'}</p>
                    <p className="text-xs text-slate-500">Luogo: {ev.location || '—'}</p>
                    <p className="text-xs text-slate-500">Prezzo: € {Number(ev.ticketPrice || 0).toFixed(2)}</p>
                    {ev.imageUrl && <img src={ev.imageUrl} alt={ev.titleIt} className="mt-2 w-full h-28 object-cover rounded-xl" />}
                  </div>
                  <div className="p-4 pt-0 flex justify-end gap-2">
                    <button onClick={() => handleEditEvent(ev)} className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Modifica</button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 overflow-x-auto">
            <h2 className="font-display text-xl font-bold text-slate-900">{t.adminDash.bookingsTab}</h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase">
                  <th className="pb-3">Codice</th>
                  <th className="pb-3">Visitatore</th>
                  <th className="pb-3">Evento</th>
                  <th className="pb-3">Biglietti</th>
                  <th className="pb-3">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="text-slate-700">
                    <td className="py-3 font-mono font-bold text-sky-600">{b.bookingCode}</td>
                    <td className="py-3 font-bold">{b.visitorName} ({b.visitorEmail})</td>
                    <td className="py-3">{b.event?.titleIt || 'Evento Culturale'}</td>
                    <td className="py-3 font-bold">{b.numberOfTickets}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        {b.status || 'CONFIRMED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FEEDBACKS TAB */}
        {activeTab === 'feedbacks' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
            <h2 className="font-display text-xl font-bold text-slate-900">{t.adminDash.feedbacksTab}</h2>
            <div className="space-y-4">
              {feedbacks.map((f) => (
                <div key={f.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{f.authorName}</span>
                      <span className="text-xs text-slate-400">({f.nationality})</span>
                      <span className="text-amber-500 font-bold">⭐ {f.rating}/5</span>
                    </div>
                    <p className="text-xs text-slate-500">Evento: <strong>{f.event?.titleIt || 'Non specificato'}</strong></p>
                    <p className="text-xs text-slate-600 italic">"{f.comment}"</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFeedback(f.id)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative border border-slate-200 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-2xl font-bold text-slate-900 mb-6">{editingEventId ? 'Modifica Evento Culturale' : 'Crea Nuovo Evento Culturale'}</h3>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-bold">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titolo Evento (Italiano)</label>
                <input
                  required
                  type="text"
                  placeholder="Es. Sagra del Pesce di Sciacca"
                  value={newEvent.titleIt}
                  onChange={(e) => setNewEvent({ ...newEvent, titleIt: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titolo Evento (Inglese)</label>
                <input
                  type="text"
                  placeholder="Es. Sciacca Fish Festival"
                  value={newEvent.titleEn}
                  onChange={(e) => setNewEvent({ ...newEvent, titleEn: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Titolo (Francese)</label><input type="text" value={newEvent.titleFr} onChange={(e) => setNewEvent({ ...newEvent, titleFr: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Titolo (Tedesco)</label><input type="text" value={newEvent.titleDe} onChange={(e) => setNewEvent({ ...newEvent, titleDe: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Luogo / indirizzo</label>
                  <input required type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="CARNEVALE">Carnevale</option>
                    <option value="CERAMICA">Ceramica</option>
                    <option value="MUSEO">Musei & Arte</option>
                    <option value="TERME">Terme & Natura</option>
                    <option value="GASTRONOMIA">Gastronomia</option>
                    <option value="TEATRO">Teatro & Musica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prezzo Biglietto (€)</label>
                  <input
                    required
                    type="number"
                    step="0.5"
                    min="0"
                    value={newEvent.ticketPrice}
                    onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data e Ora Evento</label>
                  <input
                    required
                    type="datetime-local"
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data e Ora Fine Evento</label>
                  <input required type="datetime-local" min={newEvent.eventDate || undefined} value={newEvent.eventEnd} onChange={(e) => setNewEvent({ ...newEvent, eventEnd: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capienza Massima</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newEvent.maxCapacity}
                    onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Immagine</label>
                <input
                  type="text"
                  value={newEvent.imageUrl}
                  onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrizione (Italiano)</label>
                <textarea
                  required
                  rows={3}
                  value={newEvent.descriptionIt}
                  onChange={(e) => setNewEvent({ ...newEvent, descriptionIt: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                  placeholder="Descrivi l'evento..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrizione (Inglese)</label>
                <textarea rows={3} value={newEvent.descriptionEn} onChange={(e) => setNewEvent({ ...newEvent, descriptionEn: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none" placeholder="Event description in English..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Descrizione (Francese)</label><textarea rows={3} value={newEvent.descriptionFr} onChange={(e) => setNewEvent({ ...newEvent, descriptionFr: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1">Descrizione (Tedesco)</label><textarea rows={3} value={newEvent.descriptionDe} onChange={(e) => setNewEvent({ ...newEvent, descriptionDe: e.target.value })} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm" /></div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 shadow-md glow-btn"
              >
                {editingEventId ? 'Salva modifiche' : 'Salva e Pubblica Evento'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
