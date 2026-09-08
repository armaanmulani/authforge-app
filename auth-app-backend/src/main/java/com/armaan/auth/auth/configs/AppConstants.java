package com.armaan.auth.auth.configs;

public class AppConstants {

    public static final String[] AUTH_PUBLIC_URLS = {
            "/error",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/api/v1/auth/**"
    };

    public static final String[] AUTH_ADMIN_URLS = {
            "/api/v1/users/**"
    };

    public static final String[] AUTH_GUEST_URLS = {
    };

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_GUEST = "GUEST";
}