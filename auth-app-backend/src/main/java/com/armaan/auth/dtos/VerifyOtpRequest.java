package com.armaan.auth.dtos;

public record VerifyOtpRequest(
        String email,
        String otp
) {
}