package com.armaan.auth.services;

import com.armaan.auth.dtos.UserDto;
import com.armaan.auth.exceptions.ResourceNotFound;
import com.armaan.auth.models.Provider;
import com.armaan.auth.models.User;
import com.armaan.auth.repositories.UserRepository;
import com.armaan.auth.utils.UserUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userDto.getEmail() == null || userDto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("User with given email already exists");
        }
        User user = modelMapper.map(userDto, User.class);
        user.setProvider(userDto.getProvider() != null ? userDto.getProvider() : Provider.LOCAL);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFound("User not found with given email id"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public UserDto updateUser(UserDto userDto, String userId) {
        UUID uId = UserUtil.pasrseUUID(userId);
        User existingUser = userRepository.findById(uId).orElseThrow(() -> new ResourceNotFound("User not found with the given id"));

        return null;
    }

    @Override
    public void deleteUserById(String uuid) {
        UUID userId = UserUtil.pasrseUUID(uuid);
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFound("User does not exist with given id"));
        userRepository.delete(user);
    }

    @Override
    public UserDto getUserById(String userId) {
        User user = userRepository
                .findById(UserUtil.pasrseUUID(userId)).orElseThrow(() -> new ResourceNotFound("User with given id does not exist"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional
    public Iterable<UserDto> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(
                    user -> modelMapper.map(user, UserDto.class)
                )
                .toList();
    }
}
