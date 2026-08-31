package com.interviewverseai.service;

import com.interviewverseai.config.JwtTokenProvider;
import com.interviewverseai.dto.AuthRequest;
import com.interviewverseai.dto.AuthResponse;
import com.interviewverseai.dto.RegisterRequest;
import com.interviewverseai.model.CandidateProfile;
import com.interviewverseai.model.User;
import com.interviewverseai.repository.CandidateProfileRepository;
import com.interviewverseai.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            CandidateProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostConstruct
    public void initDefaultAccounts() {
        // Seed default Admin if not present
        if (!userRepository.existsByEmail("admin@interviewverse.ai")) {
            User admin = new User(
                    "Admin User",
                    "admin@interviewverse.ai",
                    passwordEncoder.encode("admin123"),
                    "ADMIN"
            );
            userRepository.save(admin);
        }

        // Seed default Candidate if not present
        if (!userRepository.existsByEmail("alex.mercer@example.com")) {
            User candidate = new User(
                    "Alex Mercer",
                    "alex.mercer@example.com",
                    passwordEncoder.encode("password123"),
                    "CANDIDATE"
            );
            userRepository.save(candidate);

            CandidateProfile profile = new CandidateProfile();
            profile.setUser(candidate);
            profile.setEducation("B.Tech in Computer Science & Engineering, 2024");
            profile.setExperience("1 year internship experience in backend development");
            profile.setTargetRole("Software Developer");
            profile.setSkills("Java, Spring Boot, Python, SQL, REST APIs, Git, Docker");
            profile.setResumeText("Software engineering graduate with solid foundation in Java, OOP, microservices, and distributed systems.");
            profileRepository.save(profile);
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole() != null ? request.getRole().toUpperCase() : "CANDIDATE"
        );
        user = userRepository.save(user);

        // Create Candidate Profile if Candidate
        if ("CANDIDATE".equalsIgnoreCase(user.getRole())) {
            CandidateProfile profile = new CandidateProfile();
            profile.setUser(user);
            profile.setEducation(request.getEducation() != null ? request.getEducation() : "Computer Science Graduate");
            profile.setExperience(request.getExperience() != null ? request.getExperience() : "Fresh Graduate / 1 Year");
            profile.setTargetRole(request.getTargetRole() != null ? request.getTargetRole() : "Software Developer");
            profile.setSkills(request.getSkills() != null ? request.getSkills() : "Java, Python, SQL, Web Development");
            profileRepository.save(profile);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
