package com.fitforge.tracker.dto;

public class UserProfileDTO {
    private Long id;
    private String email;
    private String role;
    private String fullName;
    private Integer age;
    private Double weight;
    private Double height;
    private String fitnessGoal;

    public UserProfileDTO() {
    }

    public UserProfileDTO(Long id, String email, String role, String fullName, Integer age, Double weight,
            Double height, String fitnessGoal) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.age = age;
        this.weight = weight;
        this.height = height;
        this.fitnessGoal = fitnessGoal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }
}
