package com.armaan.auth.schedulers;

import com.armaan.auth.repositories.PasswordResetOtpRepository;
import com.armaan.auth.repositories.PasswordResetTokenRepository;
import com.armaan.auth.repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    @Scheduled(fixedRate = 900000)
    public void cleanup() {

        Instant now = Instant.now();

        passwordResetOtpRepository.deleteUsedOrExpired(now);
        passwordResetTokenRepository.deleteUsedOrExpired(now);
        refreshTokenRepository.deleteRevokedOrExpired(now);
    }
}