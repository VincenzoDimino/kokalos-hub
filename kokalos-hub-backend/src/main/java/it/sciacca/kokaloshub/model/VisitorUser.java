package it.sciacca.kokaloshub.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "visitor_users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VisitorUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Builder.Default
    private Double walletBalance = 100.0; // Bilancio iniziale del Wallet 
}
