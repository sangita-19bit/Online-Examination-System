package com.onlineexam.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT utility — generates and validates tokens.
 *
 * The secret is read from the environment variable JWT_SECRET
 * (configured in application.properties as ${JWT_SECRET:...}).
 * Expiry defaults to 7 days.
 */
@Component
public class JwtUtil {

    private static final long EXPIRY_MS = 7L * 24 * 60 * 60 * 1000; // 7 days

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // Key must be ≥ 256 bits for HS256
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /** Generate a signed JWT containing the username as the subject. */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
                .signWith(key)
                .compact();
    }

    /** Extract the username (subject) from a valid token. */
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    /** Returns true if the token is valid and not expired. */
    public boolean isValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
