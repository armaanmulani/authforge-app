package com.armaan.auth.services.impl;

import com.armaan.auth.dtos.RegisterRequest;
import com.armaan.auth.dtos.UserDto;
import com.armaan.auth.services.AuthService;
import com.armaan.auth.services.UserService;
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
