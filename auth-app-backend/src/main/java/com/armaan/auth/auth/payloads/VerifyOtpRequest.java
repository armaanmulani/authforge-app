package com.armaan.auth.auth.payloads;

public record VerifyOtpRequest(
        String email,
        String otp
) {
}