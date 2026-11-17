package it.sciacca.kokaloshub.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalEvents;
    private long totalBookings;
    private long confirmedBookings;
    private long pendingBookings;
    private long totalTicketsReserved;
    private double estimatedRevenue;
    private double averageRating;
    private long totalFeedbacks;
    private Map<String, Long> eventsByCategory;
    private Map<String, Long> bookingsByLanguage;
}
