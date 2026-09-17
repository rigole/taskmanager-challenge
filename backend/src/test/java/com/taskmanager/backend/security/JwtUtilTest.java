package com.taskmanager.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "aB3xK9pL2mQ7vT5wZ8nR4cF6hJ1sD0yU");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    void generateToken_thenExtractEmail_returnsOriginalEmail() {
        String token = jwtUtil.generateToken("test@test.com");

        String extractedEmail = jwtUtil.extractEmail(token);

        assertThat(extractedEmail).isEqualTo("test@test.com");
    }

    @Test
    void isTokenValid_withValidToken_returnsTrue() {
        String token = jwtUtil.generateToken("test@test.com");

        boolean valid = jwtUtil.isTokenValid(token);

        assertThat(valid).isTrue();
    }

    @Test
    void isTokenValid_withMalformedToken_returnsFalse() {
        boolean valid = jwtUtil.isTokenValid("token.invalide.malforme");

        assertThat(valid).isFalse();
    }

    @Test
    void isTokenValid_withTamperedToken_returnsFalse() {
        String token = jwtUtil.generateToken("test@test.com");
        String tamperedToken = token.substring(0, token.length() - 5) + "XXXXX";

        boolean valid = jwtUtil.isTokenValid(tamperedToken);

        assertThat(valid).isFalse();
    }
}