package com.armaan.auth.auth.services;

import com.armaan.auth.auth.models.Provider;

public interface EmailService {

    void sendPasswordResetOtp(String email, String otp);
    void sendWelcomeEmail(String email, String name, Provider provider);

}