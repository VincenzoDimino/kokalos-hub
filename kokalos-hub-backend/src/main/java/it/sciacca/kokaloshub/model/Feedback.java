package it.sciacca.kokaloshub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id")
    private CulturalEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "visitor_id")
    private VisitorUser visitor;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private String nationality;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    @Column(nullable = false)
    private Boolean approved;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
