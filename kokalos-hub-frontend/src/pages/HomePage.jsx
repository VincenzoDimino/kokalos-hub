import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, ArrowRight, Search, CheckCircle2, Star, User, ShieldCheck, ExternalLink, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import BookingModal from '../components/BookingModal';
import EventDetailModal from '../components/EventDetailModal';

const FALLBACK_EVENTS = [
  {
    id: 1,
    title: "Carnevale di Sciacca - Sfilata Carri Allegorici",
    titleEn: "Sciacca Carnival - Float Parade",
    category: "CARNEVALE",
    date: "15-17 Febbraio 2026",
    price: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    description: "Una delle manifestazioni carnevalesche più antiche e spettacolari d'Italia, celebre per i magnifici carri allegorici in cartapesta e i gruppi mascherati.",
    descriptionEn: "One of Italy's oldest and most spectacular carnival events, famous for its magnificent papier-mâché floats and masked groups.",
    availableSeats: 120
  },
  {
    id: 2,
    title: "Laboratorio Storico di Ceramica Artigianale",
    titleEn: "Historical Craft Ceramics Workshop",
    category: "CERAMICA",
    date: "Tutti i giorni",
    price: 25.0,
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
    description: "Vivi l'esperienza di modellare l'argilla nelle botteghe storiche del quartiere dei vasai guidato dai Maestri ceramisti di Sciacca.",
    descriptionEn: "Experience shaping clay in the historic pottery workshops guided by Sciacca's master ceramists.",
    availableSeats: 30
  },
  {
    id: 3,
    title: "Visita Guidata Terme di Monte Kronio e Stufe",
    titleEn: "Guided Tour of Monte Kronio Thermal Baths",
    category: "TERME",
    date: "Sabato e Domenica",
    price: 18.0,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    description: "Esplora le grotte vaporose naturali più antiche del mondo sul Monte Kronio, unicum geotermico e storico.",
    descriptionEn: "Explore the world's oldest natural vapor caves on Monte Kronio, a unique geothermal and historical site.",
    availableSeats: 45
  },
  {
    id: 4,
    title: "Museo Diffuso dei 5 Sensi - Trekking Urbano",
    titleEn: "5 Senses Diffuse Museum - Urban Trekking",
    category: "MUSEO",
    date: "Su prenotazione",
    price: 12.0,
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1000&q=80",
    description: "Un percorso esperienziale tra i vicoli, i cortili e i racconti della comunità di Sciacca.",
    descriptionEn: "An experiential path through the alleys, courtyards, and stories of the Sciacca community.",
    availableSeats: 50
  }
];

const FALLBACK_FEEDBACKS = [
  { id: 1, authorName: "Marco Rossi", nationality: "Milano, Italia", event: { titleIt: "Laboratorio di Ceramica" }, rating: 5, comment: "Un'esperienza straordinaria! Il laboratorio di ceramica mi ha fatto innamorare di Sciacca.", date: "10 Maggio 2026" },
  { id: 2, authorName: "Sophie Dupont", nationality: "Lione, Francia", event: { titleIt: "Museo Diffuso" }, rating: 5, comment: "Magnifique ville ! Le Musée Diffus et les thermes de Monte Kronio sont inoubliables.", date: "2 Giugno 2026" },
  { id: 3, authorName: "Hans Weber", nationality: "Monaco, Germania", event: { titleIt: "Visita guidata di Sciacca" }, rating: 4, comment: "Wunderschöne Stadt und sehr gut organisiertes Buchungssystem.", date: "18 Giugno 2026" }
];


// Mostra la media delle sole recensioni approvate associate all'evento.
function EventRating({ eventId, feedbacks }) {
  const eventFeedbacks = feedbacks.filter((feedback) => {
    const feedbackEventId = feedback.event?.id ?? feedback.eventId;
    return feedbackEventId != null && String(feedbackEventId) === String(eventId);
  });

  if (eventFeedbacks.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400" aria-label="Nessuna recensione">
        <span className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} className="w-[17px] h-[17px] text-slate-300" />
          ))}
        </span>
        <span>Ancora nessuna recensione</span>
      </div>
    );
  }

  const average = eventFeedbacks.reduce((sum, feedback) => sum + Number(feedback.rating || 0), 0) / eventFeedbacks.length;
  const roundedAverage = Math.round(average * 10) / 10;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={`Valutazione media ${roundedAverage.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} su 5, basata su ${eventFeedbacks.length} recensioni`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, average - index)) * 100;
          return (
            <span key={index} className="relative inline-block w-[18px] h-[18px]">
              <Star className="absolute inset-0 w-[18px] h-[18px] text-slate-300" />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <Star className="w-[18px] h-[18px] text-amber-400 fill-amber-400 max-w-none" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-sm font-extrabold text-slate-800">{roundedAverage.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}/5</span>
      <span className="text-xs text-slate-500">({eventFeedbacks.length} {eventFeedbacks.length === 1 ? 'recensione' : 'recensioni'})</span>
    </div>
  );
}

export default function HomePage() {
  const { t, getLocalizedField } = useLanguage();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [feedbacks, setFeedbacks] = useState(FALLBACK_FEEDBACKS);
  const [category, setCategory] = useState('ALL');
  
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState('');

  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

  const [feedbackForm, setFeedbackForm] = useState({ author: '', country: '', eventId: '', rating: 5, comment: '', bookingCode: '' });
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const userToken = localStorage.getItem('kokalos_user_jwt');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadEvents();
    loadFeedbacks();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/events');
      if (res.data && res.data.length > 0) {
        setEvents(res.data);
      }
    } catch (err) {
      console.log('Using fallback events due to offline mode');
    }
  };

  const loadFeedbacks = async () => {
    try {
      const res = await api.get('/feedbacks/approved');
      if (res.data && res.data.length > 0) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.log('Using fallback feedbacks');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingResult(null);
    try {
      const res = await api.get(`/bookings/code/${bookingCodeInput.trim()}`);
      setBookingResult(res.data);
    } catch (err) {
      setBookingError(t.verify.notFound || 'Nessuna prenotazione trovata con questo codice.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    try {
      await api.post('/feedbacks', { eventId: Number(feedbackForm.eventId), bookingCode: feedbackForm.bookingCode.trim(), authorName: feedbackForm.author.trim(), nationality: feedbackForm.country.trim(), rating: feedbackForm.rating, comment: feedbackForm.comment.trim() });
      setFeedbackSuccess('Recensione pubblicata con successo!');
      setFeedbackForm({ author: '', country: '', eventId: '', rating: 5, comment: '', bookingCode: '' });
      loadFeedbacks();
    } catch (err) {
      setFeedbackError(err.response?.data || 'Errore nell\'invio del feedback. Verifica il codice di prenotazione.');
    }
  };

  const filteredEvents = category === 'ALL' 
    ? events 
    : events.filter(ev => ev.category === category);

  return (
    <div className="space-y-20 pb-20">
      
      {/* ================= HERO SECTION CON MAPPA ================= */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-sky-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Colonna Sinistra: Titolo e CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 text-sky-700 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-orange-500" />
                {t.hero.badge}
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
                {t.hero.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-orange-500 to-amber-500">{t.hero.titleHighlight}</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#events"
                  className="px-7 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 shadow-xl glow-btn flex items-center gap-2 hover:scale-105 transition-all"
                >
                  {t.hero.ctaExplore}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#verify"
                  className="px-7 py-4 rounded-2xl font-bold text-white bg-sky-500 hover:bg-sky-600 border border-sky-600 shadow-sm flex items-center gap-2 transition-all"
                >
                  {t.hero.ctaVerify}
                </a>
              </div>
            </div>

            {/* Colonna Destra: Box Localizzazione e Mappa */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    {t.heritage?.mapTitle || 'Localizzazione Geografica'}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Sciacca (AG)
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {t.heritage?.mapSubtitle || 'Sciacca si affaccia sul Canale di Sicilia, punto strategico tra Agrigento, Selinunte e Palermo.'}
                </p>

                {/* Mappa Pulita senza segnaposto personalizzato */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 shadow-inner group">
                  <iframe
                    title="Sciacca Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49495.27581977934!2d13.0645!3d37.5085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1311e552093e004b%3A0x40af138cb943560!2s92019%20Sciacca%20AG!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
                    className="w-full h-full border-0 filter contrast-105"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>

                  <div className="absolute bottom-3 left-3">
                    <a
                      href="https://maps.google.com/?q=Sciacca+AG"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all"
                    >
                      Apri in Maps <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CARTELLONE CULTURALE & ESPERIENZE ================= */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              {t.events.sectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t.events.sectionSub}
            </p>
          </div>

          {/* Filtri Categorie */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: t.categories.ALL },
              { id: 'CARNEVALE', label: t.categories.CARNEVALE },
              { id: 'CERAMICA', label: t.categories.CERAMICA },
              { id: 'MUSEO', label: t.categories.MUSEO },
              { id: 'TERME', label: t.categories.TERME }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  category === cat.id
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia Eventi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedItemForDetail(ev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedItemForDetail(ev); }}
            >
              <div>
                <div className="px-5 pt-4 pb-2 bg-white">
                  <EventRating eventId={ev.id} feedbacks={feedbacks} />
                </div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={ev.imageUrl || 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80'}
                    alt={getLocalizedField(ev, 'title')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                    {t.categories[ev.category] || ev.category}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-sky-700 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.eventDate ? new Date(ev.eventDate).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' }) : (ev.date || 'Evento ufficiale')} {ev.eventEnd ? ` — ${new Date(ev.eventEnd).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}` : ''}</span>
                  </div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 line-clamp-1">
                    {getLocalizedField(ev, 'title')}
                  </h3>
                  <p className="text-slate-600 text-xs line-clamp-2">
                    {getLocalizedField(ev, 'description')}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <span className="font-display font-black text-slate-900 text-base">
                  {(ev.ticketPrice !== undefined && ev.ticketPrice !== null) ? `€ ${ev.ticketPrice.toFixed(2)}` : (ev.price ? `€ ${ev.price.toFixed(2)}` : t.events.free)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedEventForBooking(ev); }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  {t.events.bookNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VERIFICA PRENOTAZIONE ================= */}
      <section id="verify" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.verify.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Inserisci il codice ricevuto via email per verificare i dettagli del tuo biglietto.
            </p>
          </div>

          <form onSubmit={handleVerifyCode} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder={t.verify.placeholder}
              value={bookingCodeInput}
              onChange={(e) => setBookingCodeInput(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-6 h-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t.verify.btn}
            </button>
          </form>

          {bookingError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              {bookingError}
            </div>
          )}

          {bookingResult && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Prenotazione Valida
                </span>
                <span className="font-mono font-bold text-xs bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                  {bookingResult.bookingCode}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-emerald-800 pt-2 border-t border-emerald-200">
                <div><b>Visitatore:</b> {bookingResult.visitorName}</div>
                <div><b>Posti riservati:</b> {bookingResult.numberOfTickets ?? bookingResult.seats ?? 'Dato non disponibile'}</div>
                <div><b>Stato:</b> {bookingResult.status || 'Confermato'}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= RECENSIONI E VALUTAZIONI (VISIBILI A TUTTI) ================= */}
      <section id="feedback" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t.feedback.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.feedback.subtitle}
          </p>
        </div>

        {/* Griglia Recensioni Pubbliche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((f) => (
            <div key={f.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500 gap-1">
                    {[...Array(f.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{f.date || 'Recensione verificata'}</span>
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "{f.comment}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{f.authorName || f.author || 'Visitatore'}</div>
                  <div className="text-slate-500 text-[11px]">{f.nationality || f.country || 'Provenienza non indicata'}</div>
                  <div className="mt-2 text-[11px] font-semibold text-sky-700">Evento: {f.event?.titleIt || f.eventTitle || 'Evento non specificato'}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-[10px]">
                  Verificato
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Box per Lasciare Feedback (Richiede login o codice prenotazione) */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <h3 className="font-display text-xl font-extrabold text-slate-900 text-center">
            {t.feedback.formTitle}
          </h3>

          {feedbackSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
              {feedbackSuccess}
            </div>
          )}

          {feedbackError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              {feedbackError}
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome e cognome dello scrivente</label>
                <input
                  required
                  type="text"
                  placeholder="Nome e Cognome"
                  value={feedbackForm.author}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, author: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.feedback.country}</label>
                <input
                  required
                  type="text"
                  placeholder="Es. Roma, Italia"
                  value={feedbackForm.country}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, country: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Evento a cui si riferisce la recensione</label>
              <select required value={feedbackForm.eventId} onChange={(e) => setFeedbackForm({ ...feedbackForm, eventId: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none">
                <option value="">Seleziona l'evento</option>
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.titleIt || ev.title || 'Evento'}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Codice Prenotazione</label>
                <input
                  required
                  type="text"
                  placeholder="Es. KKL-2026-XXXX"
                  value={feedbackForm.bookingCode}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, bookingCode: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valutazione</label>
                <select
                  value={feedbackForm.rating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Eccellente</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Ottimo</option>
                  <option value={3}>⭐⭐⭐ 3 - Buono</option>
                  <option value={2}>⭐⭐ 2 - Sufficiente</option>
                  <option value={1}>⭐ 1 - Scarse</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.feedback.comment}</label>
              <textarea
                required
                rows={3}
                placeholder="Condividi la tua esperienza a Sciacca..."
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 shadow-md glow-btn flex items-center justify-center gap-2"
            >
              {t.feedback.submit}
            </button>
          </form>
        </div>
      </section>

      {selectedItemForDetail && (
        <EventDetailModal item={selectedItemForDetail} onClose={() => setSelectedItemForDetail(null)} onBookClick={(ev) => setSelectedEventForBooking(ev)} />
      )}

      {/* Modale Prenotazione */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
        />
      )}

    </div>
  );
}
