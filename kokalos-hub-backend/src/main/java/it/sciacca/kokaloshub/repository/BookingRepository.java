package it.sciacca.kokaloshub.repository;

import it.sciacca.kokaloshub.model.Booking;
import it.sciacca.kokaloshub.model.VisitorUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findByVisitorOrderByCreatedAtDesc(VisitorUser visitor);
    List<Booking> findByVisitorAndStatusInOrderByCreatedAtDesc(VisitorUser visitor, List<String> statuses);
    boolean existsByVisitorAndEvent_IdAndStatusIn(VisitorUser visitor, Long eventId, List<String> statuses);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByEvent_IdAndStatusIn(Long eventId, List<String> statuses);
    void deleteByEvent_IdAndStatus(Long eventId, String status);
}
