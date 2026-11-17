package it.sciacca.kokaloshub.repository;

import it.sciacca.kokaloshub.model.VisitorUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface VisitorUserRepository extends JpaRepository<VisitorUser, Long> {
    Optional<VisitorUser> findByUsername(String username);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select v from VisitorUser v where v.username = :username")
    Optional<VisitorUser> findByUsernameForUpdate(@Param("username") String username);
    Optional<VisitorUser> findByEmail(String email);
}
