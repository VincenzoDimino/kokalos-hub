package it.sciacca.kokaloshub.service;

import it.sciacca.kokaloshub.dto.BookingRequest;
import it.sciacca.kokaloshub.model.Booking;
import it.sciacca.kokaloshub.model.CulturalEvent;
import it.sciacca.kokaloshub.model.VisitorUser;
import it.sciacca.kokaloshub.repository.BookingRepository;
import it.sciacca.kokaloshub.repository.CulturalEventRepository;
import it.sciacca.kokaloshub.repository.VisitorUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CulturalEventRepository eventRepository;
    private final VisitorUserRepository visitorUserRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, String username) {
        CulturalEvent event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Evento non trovato"));

        if (request.getNumberOfTickets() == null || request.getNumberOfTickets() < 1 || request.getNumberOfTickets() > 10) {
            throw new RuntimeException("Puoi acquistare da 1 a 10 biglietti per prenotazione.");
        }

        if (event.getAvailableSeats() < request.getNumberOfTickets()) {
            throw new RuntimeException("Posti insufficienti disponibili per questo evento.");
        }

        if (username == null) {
            throw new RuntimeException("Devi effettuare il login per poter prenotare.");
        }

        VisitorUser visitor = visitorUserRepository.findByUsernameForUpdate(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato."));

        if (bookingRepository.existsByVisitorAndEvent_IdAndStatusIn(visitor, event.getId(), List.of("CONFIRMED", "PENDING"))) {
            throw new RuntimeException("Hai già una prenotazione attiva per questo evento. Annullala e attendi il rimborso prima di effettuare un nuovo acquisto.");
        }

        double totalCost = (event.getTicketPrice() != null ? event.getTicketPrice() : 0.0) * request.getNumberOfTickets();
        double currentBalance = visitor.getWalletBalance() != null ? visitor.getWalletBalance() : 0.0;

        if (currentBalance < totalCost) {
            throw new RuntimeException(String.format("Saldo wallet insufficiente (€ %.2f). Ricarica il tuo wallet dalla dashboard.", currentBalance));
        }

        // Scala il saldo dal wallet
        visitor.setWalletBalance(currentBalance - totalCost);
        visitorUserRepository.save(visitor);

        // Scala i posti disponibili
        event.setAvailableSeats(event.getAvailableSeats() - request.getNumberOfTickets());
        eventRepository.save(event);

        String code = "KKL-2026-" + (1000 + new Random().nextInt(9000));

        Booking booking = Booking.builder()
                .bookingCode(code)
                .event(event)
                .visitor(visitor)
                .visitorName(request.getVisitorName())
                .visitorEmail(request.getVisitorEmail())
                .visitorPhone(request.getVisitorPhone())
                .numberOfTickets(request.getNumberOfTickets())
                .preferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage().toUpperCase() : "IT")
                .status("CONFIRMED")
                .createdAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        System.out.println("=== EMAIL INVIATA A " + saved.getVisitorEmail() + " ===");
        System.out.println("Oggetto: Conferma Prenotazione Kokalos Hub - Codice: " + saved.getBookingCode());

        return saved;
    }

    @Transactional
    public Booking cancelUserBooking(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Prenotazione non trovata"));

        if (booking.getVisitor() == null || !booking.getVisitor().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a cancellare questa prenotazione.");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("La prenotazione è già stata cancellata.");
        }

        // Ripristina i posti
        CulturalEvent event = booking.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + booking.getNumberOfTickets());
        eventRepository.save(event);

        // Rimborsa il wallet
        double refund = (event.getTicketPrice() != null ? event.getTicketPrice() : 0.0) * booking.getNumberOfTickets();
        VisitorUser visitor = booking.getVisitor();
        visitor.setWalletBalance((visitor.getWalletBalance() != null ? visitor.getWalletBalance() : 0.0) + refund);
        visitorUserRepository.save(visitor);

        // La prenotazione viene rimossa definitivamente: il vecchio codice non è più verificabile.
        booking.setStatus("CANCELLED");
        booking.setBookingCode("VOID-" + java.util.UUID.randomUUID());
        bookingRepository.delete(booking);
        return booking;
    }

    public Booking getByCode(String code) {
        Booking booking = bookingRepository.findByBookingCode(code)
                .orElseThrow(() -> new RuntimeException("Codice prenotazione non trovato: " + code));
        if (!"CONFIRMED".equals(booking.getStatus()) && !"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Codice prenotazione non valido o annullato.");
        }
        return booking;
    }

    public List<Booking> getBookingsForVisitor(String username) {
        VisitorUser visitor = visitorUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        return bookingRepository.findByVisitorAndStatusInOrderByCreatedAtDesc(visitor, List.of("CONFIRMED", "PENDING"));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "PENDING".equals(b.getStatus()))
                .toList();
    }

    @Transactional
    public Booking updateBookingStatus(Long id, String newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazione non trovata"));

        String oldStatus = booking.getStatus();
        String targetStatus = newStatus.toUpperCase();

        if (!oldStatus.equals("CANCELLED") && targetStatus.equals("CANCELLED")) {
            CulturalEvent event = booking.getEvent();
            event.setAvailableSeats(event.getAvailableSeats() + booking.getNumberOfTickets());
            eventRepository.save(event);

            if (booking.getVisitor() != null) {
                double refund = (event.getTicketPrice() != null ? event.getTicketPrice() : 0.0) * booking.getNumberOfTickets();
                VisitorUser visitor = booking.getVisitor();
                visitor.setWalletBalance((visitor.getWalletBalance() != null ? visitor.getWalletBalance() : 0.0) + refund);
                visitorUserRepository.save(visitor);
            }
        }

        booking.setStatus(targetStatus);
        if (targetStatus.equals("CANCELLED")) {
            booking.setBookingCode("VOID-" + java.util.UUID.randomUUID());
        }
        return bookingRepository.save(booking);
    }
}
