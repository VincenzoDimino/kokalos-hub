package it.sciacca.kokaloshub.controller;

import it.sciacca.kokaloshub.model.CulturalEvent;
import it.sciacca.kokaloshub.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class PublicEventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<CulturalEvent>> getEvents(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(eventService.getEventsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CulturalEvent> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}
