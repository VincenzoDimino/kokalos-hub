package it.sciacca.kokaloshub.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull
    private Long eventId;
    @NotBlank
    private String visitorName;
    @Email @NotBlank
    private String visitorEmail;
    private String visitorPhone;
    @Min(1) @Max(10)
    private Integer numberOfTickets;
    private String preferredLanguage;
}
