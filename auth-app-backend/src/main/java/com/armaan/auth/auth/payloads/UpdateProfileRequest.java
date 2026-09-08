package com.armaan.auth.auth.payloads;

public record UpdateProfileRequest(
        String name,
        String image
) {}