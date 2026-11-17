package it.sciacca.kokaloshub.repository;

import it.sciacca.kokaloshub.model.Feedback;
import it.sciacca.kokaloshub.model.VisitorUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByApprovedTrueAndDeletedFalseOrderByCreatedAtDesc();
    List<Feedback> findByVisitorAndDeletedFalse(VisitorUser visitor);
    boolean existsByVisitorAndEvent_IdAndDeletedFalse(VisitorUser visitor, Long eventId);
    List<Feedback> findByDeletedFalseOrderByCreatedAtDesc();
}
