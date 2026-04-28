package com.onlineexam.controller;

import com.onlineexam.config.JwtUtil;
import com.onlineexam.model.User;
import com.onlineexam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// CORS is handled globally by WebConfig — no @CrossOrigin needed here
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Username is required"));
        }
        if (request.getPassword() == null || request.getPassword().length() < 4) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Password must be at least 4 characters"));
        }
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Username already taken"));
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(request.getPassword()); // plain text for demo; use BCrypt in production
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : "");
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(user.getUsername(), token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Username is required"));
        }

        var userOpt = userRepository.findByUsername(request.getUsername().trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("User not found. Please register first."));
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(new ErrorResponse("Incorrect password"));
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(user.getUsername(), token));
    }
}

class RegisterRequest {
    private String username;
    private String password;
    private String fullName;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}

class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class AuthResponse {
    private String username;
    private String token;

    public AuthResponse(String username, String token) {
        this.username = username;
        this.token = token;
    }

    public String getUsername() { return username; }
    public String getToken() { return token; }
}

class ErrorResponse {
    private String message;

    public ErrorResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
}
