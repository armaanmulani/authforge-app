package com.armaan.auth.auth.payloads;

public record LoginRequest(
        String email,
        String password
) {
}
