package com.armaan.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuthAppBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthAppBackendApplication.class, args);
	}

}
