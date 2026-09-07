package com.armaan.auth.services;

import com.armaan.auth.models.Provider;

public interface EmailService {

    void sendPasswordResetOtp(String email, String otp);
    void sendWelcomeEmail(String email, String name, Provider provider);

}