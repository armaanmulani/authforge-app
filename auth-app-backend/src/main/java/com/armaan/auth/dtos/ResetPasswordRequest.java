package com.armaan.auth.dtos;

public record ResetPasswordRequest(
        String resetToken,
        String newPassword
) {}