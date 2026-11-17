package it.sciacca.kokaloshub.controller;

import it.sciacca.kokaloshub.dto.FeedbackRequest;
import it.sciacca.kokaloshub.model.Booking;
import it.sciacca.kokaloshub.model.CulturalEvent;
import it.sciacca.kokaloshub.model.Feedback;
import it.sciacca.kokaloshub.model.VisitorUser;
import it.sciacca.kokaloshub.repository.BookingRepository;
import it.sciacca.kokaloshub.repository.CulturalEventRepository;
import it.sciacca.kokaloshub.repository.FeedbackRepository;
import it.sciacca.kokaloshub.repository.VisitorUserRepository;
import it.sciacca.kokaloshub.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final CulturalEventRepository eventRepository;
    private final VisitorUserRepository visitorUserRepository;
    private final BookingRepository bookingRepository;
    private final JwtUtils jwtUtils;

    private VisitorUser authenticatedVisitor(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) return null;
        String token = header.substring(7);
        if (!jwtUtils.validateJwtToken(token)) return null;
        return visitorUserRepository.findByUsername(jwtUtils.getUserNameFromJwtToken(token)).orElse(null);
    }

    private VisitorUser authenticatedVisitorForUpdate(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) return null;
        String token = header.substring(7);
        if (!jwtUtils.validateJwtToken(token)) return null;
        return visitorUserRepository.findByUsernameForUpdate(jwtUtils.getUserNameFromJwtToken(token)).orElse(null);
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Feedback>> getApprovedFeedbacks() {
        return ResponseEntity.ok(feedbackRepository.findByApprovedTrueAndDeletedFalseOrderByCreatedAtDesc());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyFeedbacks(HttpServletRequest request) {
        VisitorUser visitor = authenticatedVisitor(request);
        if (visitor == null) return ResponseEntity.status(401).body("Non autorizzato");
        return ResponseEntity.ok(feedbackRepository.findByVisitorAndDeletedFalse(visitor));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest req, HttpServletRequest request) {
        try {
            VisitorUser visitor = authenticatedVisitorForUpdate(request);
            if (visitor == null) return ResponseEntity.status(401).body("Devi accedere con il tuo account per pubblicare una recensione.");

            CulturalEvent event = eventRepository.findById(req.getEventId()).orElse(null);
            if (event == null) return ResponseEntity.badRequest().body("Evento associato alla recensione non trovato.");
            if (!StringUtils.hasText(req.getBookingCode())) return ResponseEntity.badRequest().body("Inserisci il codice della prenotazione attiva.");

            Booking booking = bookingRepository.findByBookingCode(req.getBookingCode().trim()).orElse(null);
            if (booking == null || !"CONFIRMED".equals(booking.getStatus())
                    || booking.getVisitor() == null || !booking.getVisitor().getId().equals(visitor.getId())
                    || booking.getEvent() == null || !booking.getEvent().getId().equals(event.getId())) {
                return ResponseEntity.badRequest().body("Codice non valido: serve una prenotazione attiva intestata a te per questo evento.");
            }
            if (feedbackRepository.existsByVisitorAndEvent_IdAndDeletedFalse(visitor, event.getId())) {
                return ResponseEntity.status(409).body("Hai già pubblicato una recensione per questo evento. Puoi modificarla o eliminarla dalla tua dashboard.");
            }

            Feedback fb = Feedback.builder().event(event).visitor(visitor)
                    .authorName(req.getAuthorName().trim()).nationality(req.getNationality().trim())
                    .rating(req.getRating()).comment(req.getComment().trim())
                    .approved(true).createdAt(LocalDateTime.now()).build();
            return ResponseEntity.ok(feedbackRepository.save(fb));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMyFeedback(@PathVariable Long id, @Valid @RequestBody FeedbackRequest req, HttpServletRequest request) {
        VisitorUser visitor = authenticatedVisitor(request);
        if (visitor == null) return ResponseEntity.status(401).body("Non autorizzato");
        Feedback fb = feedbackRepository.findById(id).orElse(null);
        if (fb == null) return ResponseEntity.notFound().build();
        if (fb.getVisitor() == null || !fb.getVisitor().getId().equals(visitor.getId())) return ResponseEntity.status(403).body("Non autorizzato");
        if (Boolean.TRUE.equals(fb.getDeleted())) return ResponseEntity.notFound().build();
        if (fb.getEvent() == null || !fb.getEvent().getId().equals(req.getEventId())) return ResponseEntity.badRequest().body("Non puoi associare la recensione a un evento diverso.");
        fb.setAuthorName(req.getAuthorName().trim());
        fb.setNationality(req.getNationality().trim());
        fb.setRating(req.getRating());
        fb.setComment(req.getComment().trim());
        fb.setApproved(true);
        return ResponseEntity.ok(feedbackRepository.save(fb));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMyFeedback(@PathVariable Long id, HttpServletRequest request) {
        VisitorUser visitor = authenticatedVisitor(request);
        if (visitor == null) return ResponseEntity.status(401).body("Non autorizzato");
        Feedback fb = feedbackRepository.findById(id).orElse(null);
        if (fb == null) return ResponseEntity.notFound().build();
        if (fb.getVisitor() == null || !fb.getVisitor().getId().equals(visitor.getId())) return ResponseEntity.status(403).body("Non autorizzato");
        fb.setDeleted(true);
        fb.setApproved(false);
        feedbackRepository.save(fb);
        return ResponseEntity.ok().build();
    }
}
