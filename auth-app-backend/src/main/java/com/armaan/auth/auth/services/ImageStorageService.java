package com.armaan.auth.auth.services;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    String uploadProfileImage(String userId, MultipartFile file);

    void deleteProfileImage(String imageUrl);
}