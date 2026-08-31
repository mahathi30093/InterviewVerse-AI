package com.interviewverseai.service;

import com.interviewverseai.dto.CandidateProfileDto;
import com.interviewverseai.model.CandidateProfile;
import com.interviewverseai.model.User;
import com.interviewverseai.repository.CandidateProfileRepository;
import com.interviewverseai.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandidateService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public CandidateProfileDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    CandidateProfile newProfile = new CandidateProfile();
                    newProfile.setUser(user);
                    newProfile.setTargetRole("Software Developer");
                    newProfile.setSkills("Java, Python, SQL");
                    return profileRepository.save(newProfile);
                });

        return mapToDto(profile, user);
    }

    @Transactional
    public CandidateProfileDto updateProfile(Long userId, CandidateProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            user.setName(dto.getName().trim());
            userRepository.save(user);
        }

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    CandidateProfile newProfile = new CandidateProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        if (dto.getEducation() != null) profile.setEducation(dto.getEducation());
        if (dto.getExperience() != null) profile.setExperience(dto.getExperience());
        if (dto.getTargetRole() != null) profile.setTargetRole(dto.getTargetRole());
        if (dto.getSkills() != null) profile.setSkills(dto.getSkills());
        if (dto.getResumeText() != null) profile.setResumeText(dto.getResumeText());

        CandidateProfile saved = profileRepository.save(profile);
        return mapToDto(saved, user);
    }

    private CandidateProfileDto mapToDto(CandidateProfile profile, User user) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setEducation(profile.getEducation());
        dto.setExperience(profile.getExperience());
        dto.setTargetRole(profile.getTargetRole());
        dto.setSkills(profile.getSkills());
        dto.setResumeText(profile.getResumeText());
        return dto;
    }
}
