package com.armaan.auth.auth.payloads;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}