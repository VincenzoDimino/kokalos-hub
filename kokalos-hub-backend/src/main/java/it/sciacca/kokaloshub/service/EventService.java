package it.sciacca.kokaloshub.service;

import it.sciacca.kokaloshub.model.CulturalEvent;
import it.sciacca.kokaloshub.repository.CulturalEventRepository;
import it.sciacca.kokaloshub.repository.BookingRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final CulturalEventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public List<CulturalEvent> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }

    public List<CulturalEvent> getEventsByCategory(String category) {
        if (category == null || category.equalsIgnoreCase("ALL")) {
            return getAllEvents();
        }
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    public CulturalEvent getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + id));
    }

    public CulturalEvent createEvent(CulturalEvent event) {
        if (event.getEventDate() != null && event.getEventEnd() != null && event.getEventEnd().isBefore(event.getEventDate())) {
            throw new IllegalArgumentException("La data e ora di fine deve essere successiva all'inizio.");
        }
        if (event.getAvailableSeats() == null) {
            event.setAvailableSeats(event.getMaxCapacity());
        }
        if (event.getFeatured() == null) {
            event.setFeatured(false);
        }
        return eventRepository.save(event);
    }

    public CulturalEvent updateEvent(Long id, CulturalEvent updated) {
        CulturalEvent existing = getEventById(id);
        existing.setTitleIt(updated.getTitleIt());
        existing.setTitleEn(updated.getTitleEn());
        existing.setTitleFr(updated.getTitleFr());
        existing.setTitleDe(updated.getTitleDe());
        existing.setDescriptionIt(updated.getDescriptionIt());
        existing.setDescriptionEn(updated.getDescriptionEn());
        existing.setDescriptionFr(updated.getDescriptionFr());
        existing.setDescriptionDe(updated.getDescriptionDe());
        existing.setCategory(updated.getCategory());
        existing.setLocation(updated.getLocation());
        existing.setEventDate(updated.getEventDate());
        existing.setEventEnd(updated.getEventEnd());
        existing.setTicketPrice(updated.getTicketPrice());
        if (updated.getMaxCapacity() == null || updated.getMaxCapacity() < 1) {
            throw new IllegalArgumentException("La capienza massima deve essere almeno 1.");
        }
        int currentAvailableSeats = existing.getAvailableSeats() != null ? existing.getAvailableSeats() : existing.getMaxCapacity();
        int alreadyReserved = Math.max(0, existing.getMaxCapacity() - currentAvailableSeats);
        if (updated.getMaxCapacity() < alreadyReserved) {
            throw new IllegalArgumentException("La nuova capienza non può essere inferiore ai posti già prenotati (" + alreadyReserved + ").");
        }
        existing.setMaxCapacity(updated.getMaxCapacity());
        existing.setAvailableSeats(updated.getMaxCapacity() - alreadyReserved);
        existing.setImageUrl(updated.getImageUrl());
        existing.setFeatured(updated.getFeatured() != null ? updated.getFeatured() : false);
        return eventRepository.save(existing);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) throw new RuntimeException("Evento non trovato");
        boolean hasActiveBookings = !bookingRepository.findByEvent_IdAndStatusIn(id, List.of("CONFIRMED", "PENDING", "ACTIVE")).isEmpty();
        if (hasActiveBookings) throw new IllegalStateException("Errore eliminazione evento: risultano prenotazioni attive");
        bookingRepository.deleteByEvent_IdAndStatus(id, "CANCELLED");
        eventRepository.deleteById(id);
    }
}
