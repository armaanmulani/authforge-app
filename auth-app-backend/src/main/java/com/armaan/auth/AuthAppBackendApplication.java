package com.armaan.auth;

import com.armaan.auth.configs.AppConstants;
import com.armaan.auth.models.Role;
import com.armaan.auth.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.UUID;

@SpringBootApplication
@EnableScheduling
public class AuthAppBackendApplication implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

	public static void main(String[] args) {
		SpringApplication.run(AuthAppBackendApplication.class, args);
	}

    @Override
    public void run(String... args) throws Exception {

        roleRepository.findByName("ROLE_" + AppConstants.ROLE_ADMIN).ifPresentOrElse(role -> {
            System.out.println("Admin Role already exists!");
        }, () -> {

            Role role = new Role();
            role.setName("ROLE_" + AppConstants.ROLE_ADMIN);
            role.setId(UUID.randomUUID());

            roleRepository.save(role);

        });

        roleRepository.findByName("ROLE_" + AppConstants.ROLE_GUEST).ifPresentOrElse(role -> {
            System.out.println("Guest Role already exists!");
        }, () -> {

            Role role = new Role();
            role.setName("ROLE_" + AppConstants.ROLE_GUEST);
            role.setId(UUID.randomUUID());

            roleRepository.save(role);

        });

    }
}
