package com.fitforge.tracker.service;

import com.fitforge.tracker.dto.UserProfileDTO;
import com.fitforge.tracker.entity.User;
import com.fitforge.tracker.exception.ResourceNotFoundException;
import com.fitforge.tracker.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserProfileDTO getUserProfile() {
        User user = getCurrentUser();
        return convertToDTO(user);
    }

    public UserProfileDTO updateProfile(UserProfileDTO profileDTO) {
        User user = getCurrentUser();

        if (profileDTO.getFullName() != null) {
            user.setFullName(profileDTO.getFullName());
        }
        if (profileDTO.getAge() != null) {
            user.setAge(profileDTO.getAge());
        }
        if (profileDTO.getWeight() != null) {
            user.setWeight(profileDTO.getWeight());
        }
        if (profileDTO.getHeight() != null) {
            user.setHeight(profileDTO.getHeight());
        }
        if (profileDTO.getFitnessGoal() != null) {
            user.setFitnessGoal(profileDTO.getFitnessGoal());
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public void changePassword(String oldPassword, String newPassword) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private UserProfileDTO convertToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setFullName(user.getFullName());
        dto.setAge(user.getAge());
        dto.setWeight(user.getWeight());
        dto.setHeight(user.getHeight());
        dto.setFitnessGoal(user.getFitnessGoal());
        return dto;
    }
}
