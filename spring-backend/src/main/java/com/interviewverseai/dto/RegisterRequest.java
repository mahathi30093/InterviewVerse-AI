package com.interviewverseai.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role = "CANDIDATE"; // CANDIDATE, ADMIN
    private String education;
    private String experience;
    private String targetRole;
    private String skills;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
}
