package com.armaan.auth.services.impl;

import com.armaan.auth.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetOtp(String email, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Your AuthForge Password Reset Code");

            String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1.0">
                    </head>

                    <body style="
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f5;
                        font-family: Arial, Helvetica, sans-serif;
                    ">

                        <div style="
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        ">

                            <!-- Header -->
                            <div style="
                                background: #18181b;
                                padding: 28px 30px;
                                text-align: center;
                            ">
                                <h1 style="
                                    margin: 0;
                                    color: #ffffff;
                                    font-size: 26px;
                                    letter-spacing: 0.5px;
                                ">
                                    AuthForge
                                </h1>

                                <p style="
                                    margin: 8px 0 0;
                                    color: #a1a1aa;
                                    font-size: 14px;
                                ">
                                    Secure authentication made simple
                                </p>
                            </div>

                            <!-- Content -->
                            <div style="padding: 35px 30px;">

                                <h2 style="
                                    margin: 0 0 15px;
                                    color: #18181b;
                                    font-size: 22px;
                                ">
                                    Reset your password
                                </h2>

                                <p style="
                                    color: #52525b;
                                    font-size: 15px;
                                    line-height: 1.6;
                                    margin-bottom: 25px;
                                ">
                                    We received a request to reset the password
                                    for your AuthForge account.
                                </p>

                                <p style="
                                    color: #52525b;
                                    font-size: 15px;
                                    margin-bottom: 12px;
                                ">
                                    Your verification code is:
                                </p>

                                <!-- OTP -->
                                <div style="
                                    background: #f4f4f5;
                                    border: 1px solid #e4e4e7;
                                    border-radius: 10px;
                                    padding: 20px;
                                    text-align: center;
                                    margin: 20px 0 25px;
                                ">
                                    <span style="
                                        font-size: 32px;
                                        font-weight: bold;
                                        letter-spacing: 8px;
                                        color: #18181b;
                                    ">
                                        %s
                                    </span>
                                </div>

                                <p style="
                                    color: #71717a;
                                    font-size: 14px;
                                    line-height: 1.6;
                                ">
                                    This code will expire in
                                    <strong>5 minutes</strong>.
                                    For your security, never share this code
                                    with anyone.
                                </p>

                                <div style="
                                    margin-top: 25px;
                                    padding: 15px;
                                    background: #fafafa;
                                    border-left: 4px solid #18181b;
                                    border-radius: 4px;
                                ">
                                    <p style="
                                        margin: 0;
                                        color: #52525b;
                                        font-size: 13px;
                                        line-height: 1.5;
                                    ">
                                        If you didn't request a password reset,
                                        you can safely ignore this email.
                                        Your account remains secure.
                                    </p>
                                </div>

                            </div>

                            <!-- Footer -->
                            <div style="
                                border-top: 1px solid #e4e4e7;
                                padding: 20px 30px;
                                text-align: center;
                                background: #fafafa;
                            ">
                                <p style="
                                    margin: 0;
                                    color: #a1a1aa;
                                    font-size: 12px;
                                ">
                                    © 2026 AuthForge. All rights reserved.
                                </p>

                                <p style="
                                    margin: 8px 0 0;
                                    color: #a1a1aa;
                                    font-size: 12px;
                                ">
                                    This is an automated message.
                                    Please do not reply.
                                </p>
                            </div>

                        </div>

                    </body>
                    </html>
                    """.formatted(otp);

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException(
                    "Failed to send password reset email", e
            );
        }
    }
}