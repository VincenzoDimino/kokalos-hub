package it.sciacca.kokaloshub.controller;

import it.sciacca.kokaloshub.dto.JwtResponse;
import it.sciacca.kokaloshub.dto.LoginRequest;
import it.sciacca.kokaloshub.model.AdminUser;
import it.sciacca.kokaloshub.repository.AdminUserRepository;
import it.sciacca.kokaloshub.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AdminUserRepository adminUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAdmin(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        String jwt = jwtUtils.generateJwtToken(authentication.getName());
        AdminUser admin = adminUserRepository.findByUsername(authentication.getName()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt, admin.getUsername(), admin.getFullName(), admin.getRole()));
    }
}
