package com.armaan.auth.auth.services.impl;

import com.armaan.auth.auth.models.PasswordResetOtp;
import com.armaan.auth.auth.models.PasswordResetToken;
import com.armaan.auth.auth.models.User;
import com.armaan.auth.auth.repositories.PasswordResetOtpRepository;
import com.armaan.auth.auth.repositories.PasswordResetTokenRepository;
import com.armaan.auth.auth.repositories.RefreshTokenRepository;
import com.armaan.auth.auth.repositories.UserRepository;
import com.armaan.auth.auth.services.EmailService;
import com.armaan.auth.auth.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional
    public void forgotPassword(String email) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        // Prevent user enumeration
        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();
        Instant now = Instant.now();

        // 60-second resend cooldown
        Optional<PasswordResetOtp> latestOtp =
                passwordResetOtpRepository.findTopByUserOrderByCreatedAtDesc(user);

        if (latestOtp.isPresent()) {
            Instant cooldownEnds =
                    latestOtp.get().getCreatedAt().plusSeconds(60);

            if (cooldownEnds.isAfter(now)) {
                throw new BadCredentialsException(
                        "Please wait before requesting another OTP"
                );
            }
        }

        // Invalidate previous OTPs
        passwordResetOtpRepository.markAllAsUsedByUser(user);

        // Generate 6-digit OTP
        SecureRandom secureRandom = new SecureRandom();
        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        PasswordResetOtp passwordResetOtp = PasswordResetOtp.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(now.plusSeconds(300))
                .used(false)
                .attempts(0)
                .createdAt(now)
                .build();

        passwordResetOtpRepository.save(passwordResetOtp);

        emailService.sendPasswordResetOtp(user.getEmail(), otp);
    }

    @Override
    @Transactional
    public String verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid request"));

        PasswordResetOtp otpRecord =
                passwordResetOtpRepository
                        .findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid or expired OTP"
                                ));

        Instant now = Instant.now();

        if (otpRecord.getExpiresAt().isBefore(now)) {
            throw new BadCredentialsException("OTP expired");
        }

        if (otpRecord.getAttempts() >= 5) {
            throw new BadCredentialsException("Too many attempts");
        }

        if (!passwordEncoder.matches(
                otp,
                otpRecord.getOtpHash()
        )) {
            otpRecord.setAttempts(otpRecord.getAttempts() + 1);
            passwordResetOtpRepository.save(otpRecord);

            throw new BadCredentialsException("Invalid OTP");
        }

        otpRecord.setUsed(true);
        passwordResetOtpRepository.save(otpRecord);

        // Generate one-time reset token
        String tokenId = UUID.randomUUID().toString();
        String secret = UUID.randomUUID().toString();

        String resetToken = tokenId + "." + secret;

        PasswordResetToken resetTokenEntity =
                PasswordResetToken.builder()
                        .user(user)
                        .tokenId(tokenId)
                        .tokenHash(passwordEncoder.encode(secret))
                        .expiresAt(now.plusSeconds(600))
                        .used(false)
                        .createdAt(now)
                        .build();

        passwordResetTokenRepository.save(resetTokenEntity);

        return resetToken;
    }

    @Override
    @Transactional
    public void resetPassword(
            String resetToken,
            String newPassword
    ) {

        String[] tokenParts = resetToken.split("\\.", 2);

        if (tokenParts.length != 2) {
            throw new BadCredentialsException("Invalid reset token");
        }

        String tokenId = tokenParts[0];
        String secret = tokenParts[1];

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findByTokenIdAndUsedFalse(tokenId)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid reset token"
                                ));

        Instant now = Instant.now();

        if (token.getExpiresAt().isBefore(now)) {
            throw new BadCredentialsException("Reset token expired");
        }

        if (!passwordEncoder.matches(
                secret,
                token.getTokenHash()
        )) {
            throw new BadCredentialsException("Invalid reset token");
        }

        User user = token.getUser();

        // Change password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Consume reset token
        token.setUsed(true);
        passwordResetTokenRepository.save(token);

        // Invalidate all active sessions
        refreshTokenRepository.revokeAllByUser(user);
    }
}