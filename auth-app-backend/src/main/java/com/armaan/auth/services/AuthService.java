package com.armaan.auth.services;

import com.armaan.auth.dtos.RegisterRequest;
import com.armaan.auth.dtos.UserDto;

public interface AuthService {
    UserDto registerUser(RegisterRequest userDto);

}
