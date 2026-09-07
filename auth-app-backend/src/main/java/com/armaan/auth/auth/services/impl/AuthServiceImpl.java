package com.armaan.auth.auth.services.impl;

import com.armaan.auth.auth.payloads.RegisterRequest;
import com.armaan.auth.auth.payloads.UserDto;
import com.armaan.auth.auth.services.AuthService;
import com.armaan.auth.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto registerUser(RegisterRequest request) {
        return userService.createUser(request);
    }
}
