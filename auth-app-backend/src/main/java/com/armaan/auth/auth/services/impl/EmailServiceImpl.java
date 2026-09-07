package com.armaan.auth.auth.services.impl;

import com.armaan.auth.auth.models.Provider;
import com.armaan.auth.auth.services.EmailService;
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
            <title>AuthForge Password Reset</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <table
                width="100%%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="background-color: #f4f4f5;"
            >
                <tr>
                    <td align="center" style="padding: 24px 12px;">

                        <table
                            width="100%%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width: 600px;
                                background-color: #ffffff;
                                border-radius: 12px;
                                overflow: hidden;
                            "
                        >

                            <!-- Header -->
                            <tr>
                                <td style="
                                    padding: 28px 24px 20px;
                                    text-align: center;
                                ">
                                    <h1 style="
                                        margin: 0;
                                        font-size: 26px;
                                        line-height: 1.3;
                                        color: #18181b;
                                    ">
                                        Reset your password 🔐
                                    </h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="
                                    padding: 0 24px 28px;
                                    color: #52525b;
                                    font-size: 15px;
                                    line-height: 1.6;
                                ">

                                    <p style="margin: 0 0 16px;">
                                        Hi,
                                    </p>

                                    <p style="margin: 0 0 20px;">
                                        We received a request to reset your
                                        AuthForge password. Use the verification
                                        code below to continue.
                                    </p>

                                    <!-- OTP -->
                                    <table
                                        width="100%%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="
                                            background-color: #f4f4f5;
                                            border-radius: 8px;
                                            margin: 24px 0;
                                        "
                                    >
                                        <tr>
                                            <td align="center"
                                                style="padding: 22px 16px;">

                                                <p style="
                                                    margin: 0 0 8px;
                                                    font-size: 13px;
                                                    color: #71717a;
                                                ">
                                                    Your verification code
                                                </p>

                                                <div style="
                                                    font-size: 32px;
                                                    line-height: 1.3;
                                                    font-weight: bold;
                                                    letter-spacing: 8px;
                                                    color: #18181b;
                                                    word-break: break-all;
                                                ">
                                                    %s
                                                </div>

                                            </td>
                                        </tr>
                                    </table>

                                    <p style="
                                        margin: 0 0 16px;
                                        font-size: 14px;
                                        color: #71717a;
                                    ">
                                        This code will expire in
                                        <strong>5 minutes</strong>.
                                    </p>

                                    <p style="
                                        margin: 20px 0 0;
                                        font-size: 14px;
                                        color: #71717a;
                                    ">
                                        If you did not request a password reset,
                                        you can safely ignore this email.
                                        Your password will remain unchanged.
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="
                                    padding: 18px 24px;
                                    text-align: center;
                                    border-top: 1px solid #e4e4e7;
                                ">
                                    <p style="
                                        margin: 0;
                                        font-size: 12px;
                                        color: #a1a1aa;
                                    ">
                                        © AuthForge
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

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

    @Override
    public void sendWelcomeEmail(
            String email,
            String name,
            Provider provider
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Welcome to AuthForge! 🎉");

            String providerName = provider == Provider.GOOGLE
                    ? "Google"
                    : provider == Provider.GITHUB
                    ? "GitHub"
                    : "AuthForge";

            String htmlContent = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">
            <title>Welcome to AuthForge</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <table
                width="100%%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="background-color: #f4f4f5;"
            >
                <tr>
                    <td align="center" style="padding: 24px 12px;">

                        <table
                            width="100%%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width: 600px;
                                background-color: #ffffff;
                                border-radius: 12px;
                                overflow: hidden;
                            "
                        >

                            <!-- Header -->
                            <tr>
                                <td style="
                                    padding: 28px 24px 20px;
                                    text-align: center;
                                ">
                                    <h1 style="
                                        margin: 0;
                                        font-size: 26px;
                                        line-height: 1.3;
                                        color: #18181b;
                                    ">
                                        Welcome to AuthForge! 🎉
                                    </h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="
                                    padding: 0 24px 28px;
                                    color: #52525b;
                                    font-size: 15px;
                                    line-height: 1.6;
                                ">

                                    <p style="margin: 0 0 16px;">
                                        Hi
                                        <strong style="color: #18181b;">
                                            %s
                                        </strong>,
                                    </p>

                                    <p style="margin: 0 0 20px;">
                                        Your AuthForge account has been
                                        successfully created using
                                        <strong style="color: #18181b;">
                                            %s
                                        </strong>.
                                        We're excited to have you with us!
                                    </p>

                                    <!-- Account Details -->
                                    <table
                                        width="100%%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="
                                            background-color: #f4f4f5;
                                            border-radius: 8px;
                                            margin: 20px 0;
                                        "
                                    >
                                        <tr>
                                            <td style="
                                                padding: 16px;
                                                font-size: 14px;
                                                line-height: 1.6;
                                                color: #52525b;
                                            ">

                                                <strong style="
                                                    color: #18181b;
                                                    font-size: 15px;
                                                ">
                                                    Your account
                                                </strong>

                                                <div style="
                                                    margin-top: 12px;
                                                    word-break: break-word;
                                                ">
                                                    <strong>Email:</strong>
                                                    %s
                                                </div>

                                                <div style="
                                                    margin-top: 6px;
                                                    word-break: break-word;
                                                ">
                                                    <strong>
                                                        Sign-in method:
                                                    </strong>
                                                    %s
                                                </div>

                                            </td>
                                        </tr>
                                    </table>

                                    <p style="
                                        margin: 20px 0 0;
                                        font-size: 14px;
                                        color: #71717a;
                                    ">
                                        You can continue signing in with your
                                        %s account whenever you visit
                                        AuthForge.
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="
                                    padding: 18px 24px;
                                    text-align: center;
                                    border-top: 1px solid #e4e4e7;
                                ">
                                    <p style="
                                        margin: 0;
                                        font-size: 12px;
                                        color: #a1a1aa;
                                    ">
                                        © AuthForge
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        """.formatted(
                    name,
                    providerName,
                    email,
                    providerName,
                    providerName
            );

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException(
                    "Failed to send welcome email", e
            );
        }
    }
}