package com.armaan.auth.auth.repositories;

import com.armaan.auth.auth.models.PasswordResetOtp;
import com.armaan.auth.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, UUID> {

    Optional<PasswordResetOtp>
    findTopByUserAndUsedFalseOrderByCreatedAtDesc(User user);

    void deleteAllByUser(User user);

    Optional<PasswordResetOtp> findTopByUserOrderByCreatedAtDesc(User user);

    @Modifying
    @Query("""
        UPDATE PasswordResetOtp o
        SET o.used = true
        WHERE o.user = :user
          AND o.used = false
    """)
    int markAllAsUsedByUser(@Param("user") User user);

    @Modifying
    @Query("""
    DELETE FROM PasswordResetOtp o
    WHERE o.used = true
       OR o.expiresAt < :now
""")
    int deleteUsedOrExpired(@Param("now") Instant now);
}