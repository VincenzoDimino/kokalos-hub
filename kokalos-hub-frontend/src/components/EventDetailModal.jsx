import React from 'react';
import { X, MapPin, Sparkles, CheckCircle2, ArrowRight, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function EventDetailModal({ item, onClose, onBookClick }) {
  const { t, getLocalizedField } = useLanguage();

  if (!item) return null;

  const isAttraction = item.type === 'attraction';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col text-slate-800">
        
        {/* Header con Immagine */}
        <div className="relative h-64 sm:h-72 overflow-hidden shrink-0">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1000&q=80'}
            alt={getLocalizedField(item, 'title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/90 text-white text-xs font-bold backdrop-blur-md uppercase tracking-wider">
              {isAttraction ? t.detailModal.badge : (t.categories[item.category] || item.category)}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold">{getLocalizedField(item, 'title')}</h2>
          </div>
        </div>

        {/* Contenuto Modale */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              {isAttraction ? t.detailModal.detailsTitle : 'Dettagli Evento'}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {getLocalizedField(item, 'description')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900">Date e orari</h4>
            <p className="text-sm text-slate-700 flex items-center gap-2"><Calendar className="w-4 h-4 text-sky-600"/> Inizio: {item.eventDate ? new Date(item.eventDate).toLocaleString('it-IT') : 'Da definire'}</p>
            <p className="text-sm text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4 text-sky-600"/> Fine: {item.eventEnd ? new Date(item.eventEnd).toLocaleString('it-IT') : 'Da definire'}</p>
            <p className="text-sm text-slate-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-600"/> {item.location || 'Sciacca'}</p>
          </div>

          {/* Box Punti di Forza */}
          <div className="hidden p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900">
              {isAttraction ? t.detailModal.strengthsTitle : 'Informazioni Principali'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Tradizione millenaria tramandata dai maestri artigiani locali.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Percorsi immersivi all'interno del Museo Diffuso 5 Sensi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Esperienze uniche tra mare, terme storiche e cultura enogastronomica.</span>
              </li>
            </ul>
          </div>

          {/* Pulsanti Azione */}
          <div className="flex gap-4 pt-2">
            {!isAttraction && onBookClick && (
              <button
                onClick={() => { onClose(); onBookClick(item); }}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-orange-500 shadow-md glow-btn flex items-center justify-center gap-2"
              >
                {t.events.bookNow}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
            >
              {t.detailModal.closeBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
