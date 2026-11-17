package it.sciacca.kokaloshub.service;

import it.sciacca.kokaloshub.dto.DashboardStatsDTO;
import it.sciacca.kokaloshub.model.Booking;
import it.sciacca.kokaloshub.repository.BookingRepository;
import it.sciacca.kokaloshub.repository.CulturalEventRepository;
import it.sciacca.kokaloshub.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private CulturalEventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    public DashboardStatsDTO getStats() {
        long totalEvents = eventRepository.count();
        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> bookings = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || "PENDING".equals(b.getStatus()) || b.getStatus() == null)
                .toList();
        long totalBookings = bookings.size();
        long confirmedBookings = bookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus()) || b.getStatus() == null).count();
        long pendingBookings = bookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();

        long totalTicketsReserved = bookings.stream()
                .filter(b -> b.getNumberOfTickets() != null)
                .mapToLong(Booking::getNumberOfTickets)
                .sum();

        double estimatedRevenue = bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()) || b.getStatus() == null)
                .mapToDouble(b -> {
                    double price = 15.0;
                    if (b.getEvent() != null && b.getEvent().getTicketPrice() != null) {
                        price = b.getEvent().getTicketPrice();
                    }
                    int tickets = b.getNumberOfTickets() != null ? b.getNumberOfTickets() : 1;
                    return price * tickets;
                })
                .sum();


        double avgRating = feedbackRepository.findByDeletedFalseOrderByCreatedAtDesc().stream()
                .mapToInt(f -> f.getRating())
                .average()
                .orElse(5.0);

        long totalFeedbacks = feedbackRepository.findByDeletedFalseOrderByCreatedAtDesc().size();

        return DashboardStatsDTO.builder()
                .totalEvents(totalEvents)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmedBookings)
                .pendingBookings(pendingBookings)
                .totalTicketsReserved(totalTicketsReserved)
                .estimatedRevenue(estimatedRevenue)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalFeedbacks(totalFeedbacks)
                .build();
    }
}
