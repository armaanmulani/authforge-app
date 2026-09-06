package com.armaan.auth.security;

import com.armaan.auth.repositories.UserRepository;
import com.armaan.auth.utils.UserUtil;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        logger.info("========== JWT FILTER ==========");
        logger.info("Request: {} {}", request.getMethod(), request.getRequestURI());
        logger.info("Authorization header present: {}", header != null);

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                boolean isAccessToken = jwtService.isAccessToken(token);

                logger.info("Is access token: {}", isAccessToken);

                if (!isAccessToken) {
                    logger.warn("Token is NOT an access token");
                    filterChain.doFilter(request, response);
                    return;
                }

                Jws<Claims> parse = jwtService.parse(token);
                Claims payload = parse.getPayload();

                String userId = payload.getSubject();

                logger.info("JWT subject/userId: {}", userId);

                UUID userUuid = UserUtil.pasrseUUID(userId);

                userRepository.findById(userUuid)
                        .ifPresentOrElse(user -> {

                            logger.info("User found: {}", user.getEmail());
                            logger.info("User enabled: {}", user.isEnabled());

                            if (user.isEnabled()) {

                                List<GrantedAuthority> authorities =
                                        user.getRoles() == null
                                                ? List.of()
                                                : user.getRoles().stream()
                                                .map(role ->
                                                        new SimpleGrantedAuthority(role.getName())
                                                )
                                                .collect(Collectors.toList());

                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                user.getEmail(),
                                                null,
                                                authorities
                                        );

                                authentication.setDetails(
                                        new WebAuthenticationDetailsSource()
                                                .buildDetails(request)
                                );

                                if (SecurityContextHolder
                                        .getContext()
                                        .getAuthentication() == null) {

                                    SecurityContextHolder
                                            .getContext()
                                            .setAuthentication(authentication);

                                    logger.info(
                                            "Authentication successfully set for {}",
                                            user.getEmail()
                                    );

                                } else {
                                    logger.info(
                                            "SecurityContext already contains authentication: {}",
                                            SecurityContextHolder
                                                    .getContext()
                                                    .getAuthentication()
                                    );
                                }

                            } else {
                                logger.warn("USER IS DISABLED!");
                            }

                        }, () -> {
                            logger.warn("USER NOT FOUND: {}", userUuid);
                        });

            } catch (ExpiredJwtException e) {

                logger.error("JWT EXPIRED", e);

                request.setAttribute("error", "Token expired");

            } catch (Exception e) {

                logger.error("JWT VALIDATION FAILED", e);

                request.setAttribute("error", "Invalid token");
            }
        }

        logger.info(
                "Authentication before filter chain: {}",
                SecurityContextHolder.getContext().getAuthentication()
        );

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/auth");
    }
}
