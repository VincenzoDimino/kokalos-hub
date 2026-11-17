package it.sciacca.kokaloshub.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull
    private Long eventId;
    private String bookingCode;
    @NotBlank
    private String authorName;
    @NotBlank
    private String nationality;
    @NotNull @Min(1) @Max(5)
    private Integer rating;
    @NotBlank
    private String comment;
}
