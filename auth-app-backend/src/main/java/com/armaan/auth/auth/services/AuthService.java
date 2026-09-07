package com.armaan.auth.auth.services;

import com.armaan.auth.auth.payloads.RegisterRequest;
import com.armaan.auth.auth.payloads.UserDto;

public interface AuthService {
    UserDto registerUser(RegisterRequest userDto);

}
