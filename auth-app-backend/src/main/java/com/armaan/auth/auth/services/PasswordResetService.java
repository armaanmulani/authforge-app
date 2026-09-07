package com.armaan.auth.auth.services;

public interface PasswordResetService {

    void forgotPassword(String email);

    String verifyOtp(String email, String otp);

    void resetPassword(String resetToken, String newPassword);
}