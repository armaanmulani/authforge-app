package com.armaan.auth.services.impl;

import com.armaan.auth.dtos.UserDto;
import com.armaan.auth.services.AuthService;
import com.armaan.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;

    @Override
    public UserDto registerUser(UserDto userDto) {
        UserDto userDto1 = userService.createUser(userDto);
        return null;
    }
}
