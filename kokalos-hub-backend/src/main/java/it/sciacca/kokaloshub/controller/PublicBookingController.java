package it.sciacca.kokaloshub.controller;

import it.sciacca.kokaloshub.dto.BookingRequest;
import it.sciacca.kokaloshub.model.Booking;
import it.sciacca.kokaloshub.security.JwtUtils;
import it.sciacca.kokaloshub.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class PublicBookingController {

    private final BookingService bookingService;
    private final JwtUtils jwtUtils;

    private String extractUsername(HttpServletRequest httpRequest) {
        String headerAuth = httpRequest.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            if (jwtUtils.validateJwtToken(token)) {
                return jwtUtils.getUserNameFromJwtToken(token);
            }
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request, HttpServletRequest httpRequest) {
        try {
            String username = extractUsername(httpRequest);
            Booking created = bookingService.createBooking(request, username);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(HttpServletRequest httpRequest) {
        try {
            String username = extractUsername(httpRequest);
            if (username == null) return ResponseEntity.status(401).body("Non autorizzato");
            List<Booking> list = bookingService.getBookingsForVisitor(username);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyBooking(@PathVariable Long id, HttpServletRequest httpRequest) {
        try {
            String username = extractUsername(httpRequest);
            if (username == null) return ResponseEntity.status(401).body("Non autorizzato");
            Booking cancelled = bookingService.cancelUserBooking(id, username);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getBookingByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(bookingService.getByCode(code));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
