package it.sciacca.kokaloshub;

import it.sciacca.kokaloshub.security.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class KokalosHubFunctionalTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testBCryptPasswordHashing() {
        String raw = "Sciacca2026!";
        String encoded = passwordEncoder.encode(raw);
        assertNotEquals(raw, encoded);
        assertTrue(passwordEncoder.matches(raw, encoded));
    }

    @Test
    void testJwtGenerationAndValidation() {
        String token = jwtUtils.generateJwtToken("admin");
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("admin", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void testPublicEventsEndpointAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void testAdminEndpointBlockedWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isForbidden());
    }
}
