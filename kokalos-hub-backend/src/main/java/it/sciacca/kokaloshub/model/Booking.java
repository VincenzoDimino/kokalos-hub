package it.sciacca.kokaloshub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private CulturalEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "visitor_id")
    private VisitorUser visitor;

    @Column(nullable = false)
    private String visitorName;

    @Column(nullable = false)
    private String visitorEmail;

    private String visitorPhone;

    @Column(nullable = false)
    private Integer numberOfTickets;

    @Column(nullable = false)
    private String preferredLanguage; // IT, EN, FR, DE

    @Column(nullable = false)
    private String status; // PENDING, CONFIRMED, CANCELLED

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
