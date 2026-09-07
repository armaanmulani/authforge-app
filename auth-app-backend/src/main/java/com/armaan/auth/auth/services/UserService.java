package com.armaan.auth.auth.services;

import com.armaan.auth.auth.payloads.RegisterRequest;
import com.armaan.auth.auth.payloads.UserDto;

public interface UserService {

    UserDto createUser(RegisterRequest userDto);

    UserDto getUserByEmail(String email);

    UserDto updateUser(UserDto userDto, String userId);

    void deleteUserById(String userId);

    UserDto getUserById(String userId);

    Iterable<UserDto> getAllUsers();

}
