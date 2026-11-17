package it.sciacca.kokaloshub.controller;

import it.sciacca.kokaloshub.dto.DashboardStatsDTO;
import it.sciacca.kokaloshub.model.Booking;
import it.sciacca.kokaloshub.model.CulturalEvent;
import it.sciacca.kokaloshub.model.Feedback;
import it.sciacca.kokaloshub.repository.FeedbackRepository;
import it.sciacca.kokaloshub.service.BookingService;
import it.sciacca.kokaloshub.service.DashboardService;
import it.sciacca.kokaloshub.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final BookingService bookingService;
    private final DashboardService dashboardService;
    private final FeedbackRepository feedbackRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // Eventi CRUD
    @PostMapping("/events")
    public ResponseEntity<CulturalEvent> createEvent(@RequestBody CulturalEvent event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<CulturalEvent> updateEvent(@PathVariable Long id, @RequestBody CulturalEvent event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Prenotazioni
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, payload.get("status")));
    }

    // Feedbacks
    @GetMapping("/feedbacks")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackRepository.findByDeletedFalseOrderByCreatedAtDesc());
    }

    @DeleteMapping("/feedbacks/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
