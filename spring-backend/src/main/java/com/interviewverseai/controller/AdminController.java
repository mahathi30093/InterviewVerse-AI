package com.interviewverseai.controller;

import com.interviewverseai.dto.AdminDashboardDto;
import com.interviewverseai.dto.CandidateOverviewDto;
import com.interviewverseai.dto.InterviewSessionDto;
import com.interviewverseai.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<CandidateOverviewDto>> getCandidates() {
        return ResponseEntity.ok(adminService.getAllCandidates());
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewSessionDto>> getInterviews() {
        return ResponseEntity.ok(adminService.getAllInterviews());
    }

    @GetMapping("/reports")
    public ResponseEntity<AdminDashboardDto> getReports() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
