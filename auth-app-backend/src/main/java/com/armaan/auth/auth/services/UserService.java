package com.armaan.auth.auth.services;

import com.armaan.auth.auth.payloads.RegisterRequest;
import com.armaan.auth.auth.payloads.UpdateProfileRequest;
import com.armaan.auth.auth.payloads.UserDto;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserDto createUser(RegisterRequest userDto);

    UserDto getUserByEmail(String email);

    UserDto updateProfile(UpdateProfileRequest request);

    UserDto updateProfileImage(MultipartFile file);

    void deleteUserById(String userId);

    UserDto getUserById(String userId);

    Iterable<UserDto> getAllUsers();
}