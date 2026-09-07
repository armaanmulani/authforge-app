package com.armaan.auth.services.impl;

import com.armaan.auth.configs.AppConstants;
import com.armaan.auth.dtos.RegisterRequest;
import com.armaan.auth.dtos.UserDto;
import com.armaan.auth.exceptions.ResourceNotFound;
import com.armaan.auth.models.Provider;
import com.armaan.auth.models.Role;
import com.armaan.auth.models.User;
import com.armaan.auth.repositories.RefreshTokenRepository;
import com.armaan.auth.repositories.RoleRepository;
import com.armaan.auth.repositories.UserRepository;
import com.armaan.auth.services.EmailService;
import com.armaan.auth.services.UserService;
import com.armaan.auth.utils.UserUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ModelMapper modelMapper;
    private final EmailService emailService;

    @Override
    @Transactional
    public UserDto createUser(RegisterRequest request) {

        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "User with given email already exists"
            );
        }

        Role role = roleRepository
                .findByName("ROLE_" + AppConstants.ROLE_GUEST)
                .orElseThrow(() ->
                        new IllegalStateException("Default guest role not found")
                );

        User user = User.builder()
                .name(request.name())
                .email(request.email().trim())
                .password(passwordEncoder.encode(request.password()))
                .isEnabled(true)
                .provider(Provider.LOCAL)
                .build();

        user.getRoles().add(role);

        User savedUser = userRepository.save(user);

        emailService.sendWelcomeEmail(
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getProvider()
        );

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
        if (userDto.getName() != null) existingUser.setName(userDto.getName());
        if (userDto.getImage() != null) existingUser.setImage(userDto.getImage());
        if (userDto.getProvider() != null) existingUser.setProvider(userDto.getProvider());
        if (userDto.getPassword() != null) existingUser.setPassword(userDto.getPassword());
        existingUser.setUpdatedAt(Instant.now());
        User updatedUser = userRepository.save(existingUser);
        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    @Transactional
    public void deleteUserById(String uuid) {

        UUID userId = UserUtil.pasrseUUID(uuid);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFound("User does not exist with given id")
                );

        refreshTokenRepository.deleteAllByUser(user);

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
