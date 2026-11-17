package it.sciacca.kokaloshub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cultural_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CulturalEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titleIt;
    private String titleEn;
    private String titleFr;
    private String titleDe;

    @Column(columnDefinition = "TEXT")
    private String descriptionIt;
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;
    @Column(columnDefinition = "TEXT")
    private String descriptionFr;
    @Column(columnDefinition = "TEXT")
    private String descriptionDe;

    @Column(nullable = false)
    private String category; // MUSEO, TEATRO, CERAMICA, CARNEVALE, TERME, GASTRONOMIA

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDateTime eventDate; // Data e ora di inizio

    private LocalDateTime eventEnd; // Data e ora di fine

    @Column(nullable = false)
    private Double ticketPrice;

    @Column(nullable = false)
    private Integer maxCapacity;

    @Column(nullable = false)
    private Integer availableSeats;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean featured;

    @PrePersist
    @PreUpdate
    private void normalizeEventEnd() {
        if (eventEnd == null && eventDate != null) eventEnd = eventDate.plusHours(2);
        if (eventDate != null && eventEnd != null && eventEnd.isBefore(eventDate)) {
            throw new IllegalStateException("La data e ora di fine deve essere successiva all'inizio.");
        }
    }
}
