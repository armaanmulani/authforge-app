package com.armaan.auth.dtos;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}