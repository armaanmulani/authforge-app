package com.armaan.auth.configs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Auth Application built by Armaan Mulani",
                description = "This authentication service provides a complete security layer for applications using Spring Boot and Spring Security. It supports user registration and login with JWT access tokens, cookie-based refresh tokens, token refresh and logout operations, and OAuth2 authentication through Google and GitHub. The service also includes user management, role-based authorization, and centralized handling of authentication and authorization exceptions.",
                contact = @Contact(
                        name = "Armaan Mulani",
                        url = "https://armaanmulani.netlify.app",
                        email = "armaan.mulani@outlook.com"
                ),
                version = "1.0",
                summary = "Authentication and authorization API built with Spring Boot, providing user registration, login, JWT-based authentication, refresh token handling, logout, and OAuth2 authentication with Google and GitHub. The API also supports role-based authorization and centralized exception handling."
        ),
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)

@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class ApiDocConfig {



}
