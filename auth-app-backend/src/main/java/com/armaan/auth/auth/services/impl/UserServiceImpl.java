package com.armaan.auth.auth.services.impl;

import com.armaan.auth.auth.configs.AppConstants;
import com.armaan.auth.auth.models.Provider;
import com.armaan.auth.auth.models.Role;
import com.armaan.auth.auth.models.User;
import com.armaan.auth.auth.payloads.RegisterRequest;
import com.armaan.auth.auth.payloads.UpdateProfileRequest;
import com.armaan.auth.auth.payloads.UserDto;
import com.armaan.auth.auth.repositories.RefreshTokenRepository;
import com.armaan.auth.auth.repositories.RoleRepository;
import com.armaan.auth.auth.repositories.UserRepository;
import com.armaan.auth.auth.services.EmailService;
import com.armaan.auth.auth.services.ImageStorageService;
import com.armaan.auth.auth.services.UserService;
import com.armaan.auth.auth.utils.UserUtil;
import com.armaan.auth.exceptions.ResourceNotFound;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private final ImageStorageService imageStorageService;

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
                        new IllegalStateException(
                                "Default guest role not found"
                        )
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

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFound(
                                "User not found with given email id"
                        )
                );

        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional
    public UserDto updateProfile(UpdateProfileRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFound("User not found")
                );

        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (request.name().length() > 100) {
            throw new IllegalArgumentException(
                    "Name must not exceed 100 characters"
            );
        }

        user.setName(request.name().trim());

        /*
         * Image URL can still be updated through this endpoint
         * if needed. The dedicated image endpoint will handle
         * actual R2 file uploads.
         */
        User updatedUser = userRepository.save(user);

        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    @Transactional
    public UserDto updateProfileImage(MultipartFile file) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFound("User not found")
                );

        String oldImage = user.getImage();

        /*
         * Upload the new image to Cloudflare R2.
         */
        String newImage =
                imageStorageService.uploadProfileImage(
                        user.getId().toString(),
                        file
                );

        /*
         * Update the user's image URL in MySQL.
         */
        user.setImage(newImage);

        User updatedUser = userRepository.save(user);

        /*
         * Delete the old R2 image only after the new image
         * has been uploaded successfully.
         */
        if (oldImage != null && !oldImage.isBlank()) {
            imageStorageService.deleteProfileImage(oldImage);
        }

        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    @Transactional
    public void deleteUserById(String uuid) {
        UUID userId = UserUtil.pasrseUUID(uuid);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFound("User does not exist with given id"));

        // Delete stored profile image from R2
        if (user.getImage() != null && !user.getImage().isBlank()) {
            imageStorageService.deleteProfileImage(user.getImage());
        }

        // Delete dependent records first
        refreshTokenRepository.deleteAllByUser(user);

        // Delete user
        userRepository.delete(user);
    }

    @Override
    public UserDto getUserById(String userId) {

        User user = userRepository
                .findById(UserUtil.pasrseUUID(userId))
                .orElseThrow(() ->
                        new ResourceNotFound(
                                "User with given id does not exist"
                        )
                );

        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional
    public Iterable<UserDto> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(user ->
                        modelMapper.map(user, UserDto.class)
                )
                .toList();
    }
}