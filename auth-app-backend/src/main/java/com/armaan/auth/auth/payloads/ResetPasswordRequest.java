package com.armaan.auth.auth.payloads;

public record ResetPasswordRequest(
        String resetToken,
        String newPassword
) {}