package com.armaan.auth.repositories;

import com.armaan.auth.models.RefreshToken;
import com.armaan.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByJti(String jti);
    void deleteAllByUser(User user);

}
