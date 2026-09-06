package com.armaan.auth.repositories;

import com.armaan.auth.models.RefreshToken;
import com.armaan.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByJti(String jti);

    void deleteAllByUser(User user);

    @Modifying
    @Query("""
    UPDATE RefreshToken r
    SET r.revoked = true
    WHERE r.user = :user
      AND r.revoked = false
""")
    int revokeAllByUser(@Param("user") User user);

    @Modifying
    @Query("""
    DELETE FROM RefreshToken r
    WHERE r.revoked = true
       OR r.expiresAt < :now
""")
    int deleteRevokedOrExpired(@Param("now") Instant now);

}
