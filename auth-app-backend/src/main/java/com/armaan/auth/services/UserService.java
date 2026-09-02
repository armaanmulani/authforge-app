package com.armaan.auth.services;

import com.armaan.auth.dtos.UserDto;

public interface UserService {

    UserDto createUser(UserDto userDto);

    UserDto getUserByEmail(String email);

    UserDto updateUser(UserDto userDto, String userId);

    void deleteUserById(String userId);

    UserDto getUserById(String userId);

    Iterable<UserDto> getAllUsers();

}
