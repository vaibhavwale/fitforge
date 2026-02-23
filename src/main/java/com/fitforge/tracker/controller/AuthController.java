package com.fitforge.tracker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.fitforge.tracker.dto.LoginRequest;
import com.fitforge.tracker.dto.RegisterRequest;
import com.fitforge.tracker.entity.User;
import com.fitforge.tracker.repository.UserRepository;
import com.fitforge.tracker.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered"));
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());

        String normalizedRole = request.getRole() == null ? "USER" : request.getRole().trim().toUpperCase();
        if (!normalizedRole.startsWith("ROLE_")) {
            normalizedRole = "ROLE_" + normalizedRole;
        }
        user.setRole(normalizedRole);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Login attempt for: " + request.getEmail());
        return userRepository.findByEmail(request.getEmail())
                .map(existingUser -> {
                    System.out.println("User found: " + existingUser.getEmail());
                    if (passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
                        System.out.println("Password matched");
                        try {
                            String token = jwtService.generateToken(existingUser.getEmail());
                            System.out.println("Token generated");

                            Map<String, Object> response = new HashMap<>();
                            response.put("token", token);
                            response.put("email", existingUser.getEmail());
                            response.put("fullName", existingUser.getFullName());
                            response.put("role", existingUser.getRole());

                            return ResponseEntity.ok(response);
                        } catch (Exception e) {
                            e.printStackTrace();
                            throw e;
                        }
                    } else {
                        System.out.println("Invalid credentials");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid credentials"));
                    }
                })
                .orElseGet(() -> {
                    System.out.println("User not found in DB");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "User not found"));
                });
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            return userRepository.findByEmail(email)
                    .map(user -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("email", user.getEmail());
                        response.put("fullName", user.getFullName());
                        response.put("role", user.getRole());
                        response.put("id", user.getId());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "User not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }
}
