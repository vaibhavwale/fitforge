package com.fitforge.tracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitforge.tracker.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // ✅ Find a user by email (matches your entity + DB schema)
    Optional<User> findByEmail(String email);

    // ✅ Check if an email already exists (useful for registration)
    boolean existsByEmail(String email);
}   