package com.armaan.auth.dtos;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        Long expiresIn,
        String tokenType,
        UserDto user
) {

    public static TokenResponse of(String accessToken, String refreshToken, Long expiresIn, UserDto user) {
        return new TokenResponse(accessToken, refreshToken, expiresIn, "Bearer", user);
    }
}
