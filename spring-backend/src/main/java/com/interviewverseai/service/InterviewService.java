package com.interviewverseai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewverseai.dto.*;
import com.interviewverseai.model.*;
import com.interviewverseai.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final SkillAssessmentRepository skillAssessmentRepository;
    private final SkillGapRepository skillGapRepository;
    private final CareerReadinessRepository careerReadinessRepository;
    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final AiClientService aiClientService;
    private final ObjectMapper objectMapper;

    public static final int MAX_QUESTIONS_PER_SESSION = 5;

    public InterviewService(
            InterviewSessionRepository sessionRepository,
            InterviewQuestionRepository questionRepository,
            InterviewAnswerRepository answerRepository,
            SkillAssessmentRepository skillAssessmentRepository,
            SkillGapRepository skillGapRepository,
            CareerReadinessRepository careerReadinessRepository,
            UserRepository userRepository,
            CandidateProfileRepository profileRepository,
            AiClientService aiClientService,
            ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.skillAssessmentRepository = skillAssessmentRepository;
        this.skillGapRepository = skillGapRepository;
        this.careerReadinessRepository = careerReadinessRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.aiClientService = aiClientService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public InterviewSessionDto startInterview(Long userId, InterviewStartRequest request) {
        User candidate = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        CandidateProfile profile = profileRepository.findByUserId(userId).orElse(null);

        // 1. Create new InterviewSession
        InterviewSession session = new InterviewSession();
        session.setCandidate(candidate);
        session.setJobRole(request.getJobRole() != null ? request.getJobRole() : "Software Developer");
        session.setInterviewType(request.getInterviewType() != null ? request.getInterviewType() : "Mixed");
        session.setStatus("IN_PROGRESS");
        session.setCurrentDifficulty(request.getInitialDifficulty() != null ? request.getInitialDifficulty() : "EASY");
        session.setStartedAt(OffsetDateTime.now());
        session = sessionRepository.save(session);

        // 2. Call FastAPI to generate First Question via Adaptive Agent
        Map<String, Object> aiPayload = new HashMap<>();
        aiPayload.put("target_role", session.getJobRole());
        aiPayload.put("interview_type", session.getInterviewType());
        aiPayload.put("difficulty", session.getCurrentDifficulty());
        aiPayload.put("sequence_number", 1);
        if (profile != null) {
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("education", profile.getEducation());
            pMap.put("experience", profile.getExperience());
            pMap.put("skills", profile.getSkills());
            aiPayload.put("candidate_profile", pMap);
        }

        Map<String, Object> aiResponse = aiClientService.generateQuestion(aiPayload);

        // 3. Persist First Question
        InterviewQuestion firstQuestion = new InterviewQuestion();
        firstQuestion.setSession(session);
        firstQuestion.setQuestion((String) aiResponse.getOrDefault("question", "Can you introduce your technical background?"));
        firstQuestion.setCategory((String) aiResponse.getOrDefault("category", "Technical"));
        firstQuestion.setTopic((String) aiResponse.getOrDefault("topic", "General"));
        firstQuestion.setDifficulty((String) aiResponse.getOrDefault("difficulty", session.getCurrentDifficulty()));
        firstQuestion.setSequenceNumber(1);
        firstQuestion = questionRepository.save(firstQuestion);

        session.getQuestions().add(firstQuestion);
        return mapSessionToDto(session);
    }

    public InterviewSessionDto getSessionById(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + sessionId));
        return mapSessionToDto(session);
    }

    public List<InterviewSessionDto> getCandidateSessions(Long userId) {
        List<InterviewSession> sessions = sessionRepository.findByCandidateIdOrderByStartedAtDesc(userId);
        return sessions.stream().map(this::mapSessionToDto).collect(Collectors.toList());
    }

    @Transactional
    public AnswerResponseDto submitAnswer(Long sessionId, AnswerSubmissionDto submission) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + sessionId));

        InterviewQuestion question = questionRepository.findById(submission.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + submission.getQuestionId()));

        return processCandidateAnswer(session, question, submission.getAnswerText(), null, null);
    }

    @Transactional
    public AnswerResponseDto submitVoiceAnswer(Long sessionId, Long questionId, byte[] audioBytes, String filename, String fallbackText) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + sessionId));

        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));

        // 1. Transcribe audio via Whisper
        String transcribedText = aiClientService.transcribeAudio(audioBytes, filename, fallbackText);

        return processCandidateAnswer(session, question, transcribedText, filename, transcribedText);
    }

    private AnswerResponseDto processCandidateAnswer(
            InterviewSession session,
            InterviewQuestion question,
            String answerText,
            String audioPath,
            String transcription) {

        // 1. Call AI Service Evaluation Agent
        Map<String, Object> evalPayload = new HashMap<>();
        evalPayload.put("question", question.getQuestion());
        evalPayload.put("candidate_answer", answerText);
        evalPayload.put("job_role", session.getJobRole());
        evalPayload.put("skill", question.getTopic());
        evalPayload.put("category", question.getCategory());
        evalPayload.put("difficulty", question.getDifficulty());

        Map<String, Object> evalResult = aiClientService.analyzeAnswer(evalPayload);

        BigDecimal score = BigDecimal.valueOf(((Number) evalResult.getOrDefault("score", 75.0)).doubleValue())
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal correctness = BigDecimal.valueOf(((Number) evalResult.getOrDefault("correctness", 75.0)).doubleValue())
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal relevance = BigDecimal.valueOf(((Number) evalResult.getOrDefault("relevance", 75.0)).doubleValue())
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal completeness = BigDecimal.valueOf(((Number) evalResult.getOrDefault("completeness", 75.0)).doubleValue())
                .setScale(2, RoundingMode.HALF_UP);
        String feedback = (String) evalResult.getOrDefault("feedback", "Good explanation.");

        @SuppressWarnings("unchecked")
        List<String> strengths = (List<String>) evalResult.getOrDefault("strengths", new ArrayList<>());
        @SuppressWarnings("unchecked")
        List<String> weaknesses = (List<String>) evalResult.getOrDefault("weaknesses", new ArrayList<>());

        // 2. Persist Answer Record
        InterviewAnswer answer = answerRepository.findByQuestionId(question.getId()).orElse(new InterviewAnswer());
        answer.setQuestion(question);
        answer.setAnswerText(answerText);
        answer.setAudioPath(audioPath);
        answer.setTranscription(transcription);
        answer.setScore(score);
        answer.setCorrectness(correctness);
        answer.setRelevance(relevance);
        answer.setCompleteness(completeness);
        answer.setFeedback(feedback);
        answer = answerRepository.save(answer);

        // 3. Check Adaptive Difficulty Transition
        String currentDiff = session.getCurrentDifficulty();
        String nextDiff = currentDiff;
        if (score.doubleValue() >= 80.0) {
            if ("EASY".equalsIgnoreCase(currentDiff)) nextDiff = "MEDIUM";
            else if ("MEDIUM".equalsIgnoreCase(currentDiff)) nextDiff = "HARD";
            else nextDiff = "HARD";
        } else if (score.doubleValue() < 60.0) {
            if ("HARD".equalsIgnoreCase(currentDiff)) nextDiff = "MEDIUM";
            else if ("MEDIUM".equalsIgnoreCase(currentDiff)) nextDiff = "EASY";
            else nextDiff = "EASY";
        }
        session.setCurrentDifficulty(nextDiff);

        // 4. Check if interview is completed
        int currentSeq = question.getSequenceNumber();
        boolean isComplete = currentSeq >= MAX_QUESTIONS_PER_SESSION;

        InterviewQuestionDto nextQuestionDto = null;
        if (!isComplete) {
            // Generate next question via Adaptive Agent
            int nextSeq = currentSeq + 1;
            
            // Gather previous interactions
            List<InterviewQuestion> allQuestions = questionRepository.findBySessionIdOrderBySequenceNumberAsc(session.getId());
            List<Map<String, Object>> interactionsList = new ArrayList<>();
            for (InterviewQuestion q : allQuestions) {
                if (q.getAnswer() != null) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("sequence_number", q.getSequenceNumber());
                    map.put("question", q.getQuestion());
                    map.put("category", q.getCategory());
                    map.put("topic", q.getTopic());
                    map.put("difficulty", q.getDifficulty());
                    map.put("answer", q.getAnswer().getAnswerText());
                    map.put("score", q.getAnswer().getScore().doubleValue());
                    map.put("feedback", q.getAnswer().getFeedback());
                    interactionsList.add(map);
                }
            }

            Map<String, Object> nextQP = new HashMap<>();
            nextQP.put("target_role", session.getJobRole());
            nextQP.put("interview_type", session.getInterviewType());
            nextQP.put("current_difficulty", nextDiff);
            nextQP.put("current_question_number", nextSeq);
            nextQP.put("previous_interactions", interactionsList);
            // also pass profile if needed, but adaptive doesn't strictly crash without it

            Map<String, Object> nextQRes = aiClientService.generateAdaptiveQuestion(nextQP);

            InterviewQuestion nextQ = new InterviewQuestion();
            nextQ.setSession(session);
            nextQ.setQuestion((String) nextQRes.getOrDefault("question", "How do you handle technical trade-offs?"));
            nextQ.setCategory((String) nextQRes.getOrDefault("category", "Problem Solving"));
            nextQ.setTopic((String) nextQRes.getOrDefault("topic", "System Architecture"));
            nextQ.setDifficulty((String) nextQRes.getOrDefault("difficulty", nextDiff));
            nextQ.setSequenceNumber(nextSeq);
            nextQ = questionRepository.save(nextQ);

            nextQuestionDto = mapQuestionToDto(nextQ);
        } else {
            // Automatically complete session and trigger final assessments
            completeInterview(session.getId());
        }

        sessionRepository.save(session);

        AnswerResponseDto response = new AnswerResponseDto();
        response.setAnswerId(answer.getId());
        response.setQuestionId(question.getId());
        response.setScore(score);
        response.setCorrectness(correctness);
        response.setRelevance(relevance);
        response.setCompleteness(completeness);
        response.setFeedback(feedback);
        response.setStrengths(strengths);
        response.setWeaknesses(weaknesses);
        response.setNextDifficulty(nextDiff);
        response.setNextQuestion(nextQuestionDto);
        response.setInterviewComplete(isComplete);
        return response;
    }

    @Transactional
    public AssessmentResponseDto completeInterview(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + sessionId));

        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderBySequenceNumberAsc(sessionId);
        
        // 1. Gather all answered questions
        List<Map<String, Object>> interactionsList = new ArrayList<>();
        double totalScoreSum = 0.0;
        int answeredCount = 0;

        for (InterviewQuestion q : questions) {
            InterviewAnswer ans = q.getAnswer();
            if (ans != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("sequence_number", q.getSequenceNumber());
                map.put("question", q.getQuestion());
                map.put("category", q.getCategory());
                map.put("topic", q.getTopic());
                map.put("difficulty", q.getDifficulty());
                map.put("answer", ans.getAnswerText());
                map.put("score", ans.getScore().doubleValue());
                map.put("feedback", ans.getFeedback());
                interactionsList.add(map);

                totalScoreSum += ans.getScore().doubleValue();
                answeredCount++;
            }
        }

        double avgScore = answeredCount > 0 ? (totalScoreSum / answeredCount) : 75.0;

        // 2. Call Skill Assessment Agent
        Map<String, Object> skillReq = new HashMap<>();
        skillReq.put("job_role", session.getJobRole());
        skillReq.put("interview_type", session.getInterviewType());
        skillReq.put("interactions", interactionsList);

        Map<String, Object> skillRes = aiClientService.generateSkillAssessment(skillReq);

        BigDecimal tech = BigDecimal.valueOf(((Number) skillRes.getOrDefault("technical_score", avgScore)).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal prob = BigDecimal.valueOf(((Number) skillRes.getOrDefault("problem_solving_score", avgScore)).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal comm = BigDecimal.valueOf(((Number) skillRes.getOrDefault("communication_score", avgScore)).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal beh = BigDecimal.valueOf(((Number) skillRes.getOrDefault("behavioral_score", avgScore)).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal overallSkill = BigDecimal.valueOf(((Number) skillRes.getOrDefault("overall_score", avgScore)).doubleValue()).setScale(2, RoundingMode.HALF_UP);

        SkillAssessment skillAssessment = skillAssessmentRepository.findBySessionId(sessionId).orElse(new SkillAssessment());
        skillAssessment.setSession(session);
        skillAssessment.setTechnicalScore(tech);
        skillAssessment.setProblemSolvingScore(prob);
        skillAssessment.setCommunicationScore(comm);
        skillAssessment.setBehavioralScore(beh);
        skillAssessment.setOverallScore(overallSkill);
        skillAssessment = skillAssessmentRepository.save(skillAssessment);

        // 3. Call Career Readiness Agent
        Map<String, Object> careerReq = new HashMap<>();
        careerReq.put("job_role", session.getJobRole());
        careerReq.put("technical_score", tech.doubleValue());
        careerReq.put("problem_solving_score", prob.doubleValue());
        careerReq.put("communication_score", comm.doubleValue());
        careerReq.put("behavioral_score", beh.doubleValue());

        Map<String, Object> careerRes = aiClientService.generateCareerReadiness(careerReq);

        BigDecimal readinessScore = BigDecimal.valueOf(((Number) careerRes.getOrDefault("readiness_score", overallSkill.doubleValue())).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        String readinessLevel = (String) careerRes.getOrDefault("readiness_level", "INTERVIEW READY");

        Object strengthsObj = careerRes.getOrDefault("strengths", Arrays.asList("Strong technical fundamentals"));
        Object weaknessesObj = careerRes.getOrDefault("weaknesses", Arrays.asList("Edge-case considerations"));
        Object recsObj = careerRes.getOrDefault("recommendations", Arrays.asList("Practice live mock interviews"));

        String strengthsJson = toJson(strengthsObj);
        String weaknessesJson = toJson(weaknessesObj);
        String recsJson = toJson(recsObj);

        CareerReadiness careerReadiness = careerReadinessRepository.findBySessionId(sessionId).orElse(new CareerReadiness());
        careerReadiness.setSession(session);
        careerReadiness.setReadinessScore(readinessScore);
        careerReadiness.setReadinessLevel(readinessLevel);
        careerReadiness.setStrengths(strengthsJson);
        careerReadiness.setWeaknesses(weaknessesJson);
        careerReadiness.setRecommendations(recsJson);
        careerReadiness = careerReadinessRepository.save(careerReadiness);

        // 4. Save Skill Gaps
        List<SkillGap> existingGaps = skillGapRepository.findBySessionId(sessionId);
        if (existingGaps.isEmpty()) {
            SkillGap gap1 = new SkillGap();
            gap1.setSession(session);
            gap1.setSkillName(session.getJobRole() + " Architecture");
            gap1.setCurrentLevel(tech.doubleValue() >= 80 ? "INTERMEDIATE" : "BEGINNER");
            gap1.setTargetLevel("ADVANCED");
            gap1.setRecommendation("Deep dive into distributed systems, async patterns, and testing.");
            skillGapRepository.save(gap1);
        }

        // 5. Finalize Session Status
        session.setStatus("COMPLETED");
        session.setCompletedAt(OffsetDateTime.now());
        session.setOverallScore(readinessScore);
        session = sessionRepository.save(session);

        return getSessionAssessment(sessionId);
    }

    public AssessmentResponseDto getSessionAssessment(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + sessionId));

        SkillAssessment skill = skillAssessmentRepository.findBySessionId(sessionId).orElse(null);
        CareerReadiness career = careerReadinessRepository.findBySessionId(sessionId).orElse(null);
        List<SkillGap> gaps = skillGapRepository.findBySessionId(sessionId);
        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderBySequenceNumberAsc(sessionId);

        AssessmentResponseDto dto = new AssessmentResponseDto();
        dto.setSessionId(session.getId());
        dto.setCandidateName(session.getCandidate() != null ? session.getCandidate().getName() : "Candidate");
        dto.setJobRole(session.getJobRole());
        dto.setInterviewType(session.getInterviewType());
        dto.setOverallScore(session.getOverallScore());

        if (skill != null) {
            SkillAssessmentDto sDto = new SkillAssessmentDto();
            sDto.setId(skill.getId());
            sDto.setSessionId(sessionId);
            sDto.setTechnicalScore(skill.getTechnicalScore());
            sDto.setProblemSolvingScore(skill.getProblemSolvingScore());
            sDto.setCommunicationScore(skill.getCommunicationScore());
            sDto.setBehavioralScore(skill.getBehavioralScore());
            sDto.setOverallScore(skill.getOverallScore());
            dto.setSkillAssessment(sDto);
        }

        if (career != null) {
            CareerReadinessDto cDto = new CareerReadinessDto();
            cDto.setId(career.getId());
            cDto.setSessionId(sessionId);
            cDto.setReadinessScore(career.getReadinessScore());
            cDto.setReadinessLevel(career.getReadinessLevel());
            cDto.setStrengths(fromJsonList(career.getStrengths()));
            cDto.setWeaknesses(fromJsonList(career.getWeaknesses()));
            cDto.setRecommendations(fromJsonList(career.getRecommendations()));
            dto.setCareerReadiness(cDto);
        }

        dto.setSkillGaps(gaps.stream().map(g -> {
            SkillGapDto gDto = new SkillGapDto();
            gDto.setId(g.getId());
            gDto.setSkillName(g.getSkillName());
            gDto.setCurrentLevel(g.getCurrentLevel());
            gDto.setTargetLevel(g.getTargetLevel());
            gDto.setRecommendation(g.getRecommendation());
            return gDto;
        }).collect(Collectors.toList()));

        dto.setQuestions(questions.stream().map(this::mapQuestionToDto).collect(Collectors.toList()));
        return dto;
    }

    private InterviewSessionDto mapSessionToDto(InterviewSession session) {
        InterviewSessionDto dto = new InterviewSessionDto();
        dto.setId(session.getId());
        dto.setCandidateId(session.getCandidate() != null ? session.getCandidate().getId() : null);
        dto.setCandidateName(session.getCandidate() != null ? session.getCandidate().getName() : null);
        dto.setInterviewType(session.getInterviewType());
        dto.setJobRole(session.getJobRole());
        dto.setStatus(session.getStatus());
        dto.setCurrentDifficulty(session.getCurrentDifficulty());
        dto.setStartedAt(session.getStartedAt());
        dto.setCompletedAt(session.getCompletedAt());
        dto.setOverallScore(session.getOverallScore());

        List<InterviewQuestion> qs = questionRepository.findBySessionIdOrderBySequenceNumberAsc(session.getId());
        dto.setQuestions(qs.stream().map(this::mapQuestionToDto).collect(Collectors.toList()));

        return dto;
    }

    private InterviewQuestionDto mapQuestionToDto(InterviewQuestion q) {
        InterviewQuestionDto dto = new InterviewQuestionDto();
        dto.setId(q.getId());
        dto.setSessionId(q.getSession() != null ? q.getSession().getId() : null);
        dto.setQuestion(q.getQuestion());
        dto.setCategory(q.getCategory());
        dto.setTopic(q.getTopic());
        dto.setDifficulty(q.getDifficulty());
        dto.setSequenceNumber(q.getSequenceNumber());
        dto.setCreatedAt(q.getCreatedAt());

        InterviewAnswer ans = q.getAnswer();
        if (ans != null) {
            dto.setCandidateAnswer(ans.getAnswerText());
            dto.setScore(ans.getScore());
            dto.setFeedback(ans.getFeedback());
        }
        return dto;
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<String> fromJsonList(String json) {
        if (json == null || json.trim().isEmpty()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Arrays.asList(json);
        }
    }
}
