package com.fitforge.tracker.config;

import com.fitforge.tracker.entity.User;
import com.fitforge.tracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if demo user already exists
            if (!userRepository.existsByEmail("demo@fitforge.com")) {
                User demoUser = new User();
                demoUser.setEmail("demo@fitforge.com");
                demoUser.setPassword(passwordEncoder.encode("demo123"));
                demoUser.setRole("ROLE_USER");
                demoUser.setFullName("Demo User");
                demoUser.setAge(25);
                demoUser.setWeight(70.0);
                demoUser.setHeight(175.0);
                demoUser.setFitnessGoal("general_fitness");

                userRepository.save(demoUser);
                System.out.println("\n========================================");
                System.out.println("✅ DEMO USER CREATED SUCCESSFULLY!");
                System.out.println("========================================");
                System.out.println("Email: demo@fitforge.com");
                System.out.println("Password: demo123");
                System.out.println("========================================\n");
            } else {
                System.out.println("\n========================================");
                System.out.println("ℹ️  Demo user already exists");
                System.out.println("========================================");
                System.out.println("Email: demo@fitforge.com");
                System.out.println("Password: demo123");
                System.out.println("========================================\n");
            }
        };
    }
}
