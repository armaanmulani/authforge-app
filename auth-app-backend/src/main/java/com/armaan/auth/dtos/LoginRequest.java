package com.armaan.auth.dtos;

public record LoginRequest(
        String email,
        String password
) {
}
