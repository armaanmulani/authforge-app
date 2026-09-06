package com.armaan.auth.repositories;

import com.armaan.auth.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByTokenIdAndUsedFalse(String tokenId);

    void deleteAllByUserId(UUID userId);

    @Modifying
    @Query("""
        DELETE FROM PasswordResetToken t
        WHERE t.used = true
           OR t.expiresAt < :now
    """)
    int deleteUsedOrExpired(@Param("now") Instant now);
}