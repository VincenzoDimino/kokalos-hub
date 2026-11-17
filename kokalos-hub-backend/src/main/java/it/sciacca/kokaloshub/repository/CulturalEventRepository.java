package it.sciacca.kokaloshub.repository;

import it.sciacca.kokaloshub.model.CulturalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CulturalEventRepository extends JpaRepository<CulturalEvent, Long> {
    List<CulturalEvent> findByCategoryIgnoreCase(String category);
    List<CulturalEvent> findByFeaturedTrue();
    List<CulturalEvent> findAllByOrderByEventDateAsc();
}
