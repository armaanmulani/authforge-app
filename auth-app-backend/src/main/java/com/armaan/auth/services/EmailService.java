package com.armaan.auth.services;

public interface EmailService {

    void sendPasswordResetOtp(String email, String otp);
}