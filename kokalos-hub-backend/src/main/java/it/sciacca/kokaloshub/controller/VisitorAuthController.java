package it.sciacca.kokaloshub.controller;

import it.sciacca.kokaloshub.dto.JwtResponse;
import it.sciacca.kokaloshub.dto.LoginRequest;
import it.sciacca.kokaloshub.dto.VisitorRegisterRequest;
import it.sciacca.kokaloshub.model.AdminUser;
import it.sciacca.kokaloshub.model.VisitorUser;
import it.sciacca.kokaloshub.repository.AdminUserRepository;
import it.sciacca.kokaloshub.repository.VisitorUserRepository;
import it.sciacca.kokaloshub.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/visitor/auth")
@RequiredArgsConstructor
public class VisitorAuthController {

    private final VisitorUserRepository visitorUserRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody VisitorRegisterRequest req) {
        if (visitorUserRepository.findByUsername(req.getUsername()).isPresent() ||
            adminUserRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username già in uso.");
        }
        if (visitorUserRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email già registrata.");
        }

        VisitorUser user = VisitorUser.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .email(req.getEmail())
                .walletBalance(100.0)
                .build();

        visitorUserRepository.save(user);
        String token = jwtUtils.generateJwtToken(user.getUsername());
        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getFullName(), "VISITOR"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        // 1. Controlla prima se è un Admin
        AdminUser admin = adminUserRepository.findByUsername(req.getUsername()).orElse(null);
        if (admin != null && passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            String token = jwtUtils.generateJwtToken(admin.getUsername());
            return ResponseEntity.ok(new JwtResponse(token, admin.getUsername(), admin.getFullName(), "ADMIN"));
        }

        // 2. Altrimenti controlla se è un Visitatore
        VisitorUser user = visitorUserRepository.findByUsername(req.getUsername()).orElse(null);
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Credenziali non valide.");
        }

        String token = jwtUtils.generateJwtToken(user.getUsername());
        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getFullName(), "VISITOR"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(HttpServletRequest httpRequest) {
        String username = extractUsername(httpRequest);
        if (username == null) return ResponseEntity.status(401).body("Non autorizzato");

        VisitorUser user = visitorUserRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "walletBalance", user.getWalletBalance() != null ? user.getWalletBalance() : 0.0
        ));
    }

    @PostMapping("/wallet/topup")
    public ResponseEntity<?> topUpWallet(@RequestBody Map<String, Object> body, HttpServletRequest httpRequest) {
        String username = extractUsername(httpRequest);
        if (username == null) return ResponseEntity.status(401).body("Non autorizzato");

        VisitorUser user = visitorUserRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        double amount = Double.parseDouble(body.get("amount").toString());
        if (amount <= 0 || amount > 1000) {
            return ResponseEntity.badRequest().body("Importo ricarica non valido (min € 1, max € 1000).");
        }

        double newBalance = (user.getWalletBalance() != null ? user.getWalletBalance() : 0.0) + amount;
        user.setWalletBalance(newBalance);
        visitorUserRepository.save(user);

        return ResponseEntity.ok(Map.of("walletBalance", newBalance));
    }

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
}
