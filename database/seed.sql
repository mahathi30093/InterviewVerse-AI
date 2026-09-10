-- ============================================================
-- InterviewVerseAI - Database Seed Data
-- ============================================================

-- BCrypt hash for 'password123' is $2a$10$eACCYoNOHEqgkZ8A2G1mgeiH4vA5h2y0f8.jXl9Bf8M7aD3l1V0b2
-- BCrypt hash for 'admin123' is $2a$10$7R9rR.k1yE5jK9D4aK0qI.eW0gL7f4V5p3n7J9k5m2B8v4L0q7C2i

-- 1. Insert Initial Users (Candidate & Admin)
INSERT INTO USERS (id, name, email, password_hash, role, created_at)
VALUES 
(1, 'Alex Mercer', 'alex.mercer@example.com', '$2a$10$eACCYoNOHEqgkZ8A2G1mgeiH4vA5h2y0f8.jXl9Bf8M7aD3l1V0b2', 'CANDIDATE', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 'Sarah Connor', 'sarah.connor@example.com', '$2a$10$eACCYoNOHEqgkZ8A2G1mgeiH4vA5h2y0f8.jXl9Bf8M7aD3l1V0b2', 'CANDIDATE', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 'Admin User', 'admin@interviewverse.ai', '$2a$10$7R9rR.k1yE5jK9D4aK0qI.eW0gL7f4V5p3n7J9k5m2B8v4L0q7C2i', 'ADMIN', CURRENT_TIMESTAMP - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Candidate Profiles
INSERT INTO CANDIDATE_PROFILES (id, user_id, education, experience, target_role, skills, resume_text, created_at)
VALUES 
(1, 1, 'B.Tech in Computer Science & Engineering, 2024', '1 year internship experience in backend development', 'Software Developer', 'Java, Spring Boot, Python, SQL, REST APIs, Git, Docker', 'Software engineering graduate with solid foundation in Java, OOP, microservices, and distributed systems. Built full-stack e-commerce project with Spring Boot.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 2, 'B.S. in Data Science & Artificial Intelligence, 2023', '2 years as junior machine learning specialist', 'Machine Learning Engineer', 'Python, PyTorch, Scikit-Learn, Pandas, NumPy, FastAPI, SQL', 'ML practitioner experienced in regression, neural networks, NLP, and model serving. Built end-to-end sentiment analysis pipeline.', CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Completed Demo Session for Alex Mercer
INSERT INTO INTERVIEW_SESSIONS (id, candidate_id, interview_type, job_role, status, current_difficulty, started_at, completed_at, overall_score)
VALUES 
(1, 1, 'Mixed', 'Software Developer', 'COMPLETED', 'HARD', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '25 minutes', 82.50)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Demo Questions
INSERT INTO INTERVIEW_QUESTIONS (id, session_id, question, category, topic, difficulty, sequence_number, created_at)
VALUES 
(1, 1, 'Can you explain the core differences between an Abstract Class and an Interface in Java, and when to use each?', 'Technical', 'Java OOP', 'EASY', 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 1, 'How would you design a rate limiter for a RESTful API to prevent abusive requests? Explain your chosen algorithm.', 'Problem Solving', 'System Design', 'MEDIUM', 2, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '5 minutes'),
(3, 1, 'Describe a situation where you had to explain a complex technical bug or architecture to a non-technical stakeholder.', 'Communication', 'Stakeholder Communication', 'MEDIUM', 3, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '10 minutes'),
(4, 1, 'Tell me about a time when you experienced a critical production outage or code conflict right before a deadline. How did you handle it?', 'Behavioral', 'Conflict & Pressure Management', 'HARD', 4, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Demo Answers
INSERT INTO INTERVIEW_ANSWERS (id, question_id, answer_text, audio_path, transcription, score, correctness, relevance, completeness, feedback, created_at)
VALUES 
(1, 1, 'An abstract class can have state and default method implementations, while interfaces define contracts. In modern Java, interfaces can have default and static methods. Use abstract classes for base code sharing among closely related classes, and interfaces for behavior abstraction.', NULL, 'An abstract class can have state and default method implementations...', 88.00, 90.00, 90.00, 84.00, 'Excellent grasp of Java OOP principles and practical design trade-offs.', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '4 minutes'),
(2, 2, 'I would use the Token Bucket or Sliding Window Log algorithm. Token bucket is memory efficient and handles bursts smoothly. For distributed architectures, Redis with Lua scripts ensures atomic counter increments across nodes.', NULL, 'I would use the Token Bucket or Sliding Window Log algorithm...', 85.00, 85.00, 90.00, 80.00, 'Solid architectural thought process with distributed Redis awareness.', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '9 minutes'),
(3, 3, 'I used analogies like a water pipe network to explain network bottlenecks to marketing teams, focusing on impact, user experience, and resolution timelines rather than TCP packet details.', NULL, 'I used analogies like a water pipe network...', 78.00, 80.00, 80.00, 74.00, 'Good clarity and empathy; could include how stakeholder feedback was gathered.', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '14 minutes'),
(4, 4, 'During our final release, a merge conflict broke authentication. I coordinated a quick huddle, rolled back to the stable tag, isolated the breaking commit, and added unit tests before redeploying in 40 minutes.', NULL, 'During our final release, a merge conflict broke authentication...', 80.00, 82.00, 80.00, 78.00, 'Great demonstration of calm under pressure and systematic root cause resolution.', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '20 minutes')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Skill Assessment
INSERT INTO SKILL_ASSESSMENTS (id, session_id, technical_score, problem_solving_score, communication_score, behavioral_score, overall_score, created_at)
VALUES 
(1, 1, 88.00, 85.00, 78.00, 80.00, 83.85, CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '25 minutes')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Skill Gaps
INSERT INTO SKILL_GAPS (id, session_id, skill_name, current_level, target_level, recommendation, created_at)
VALUES 
(1, 1, 'Distributed System Fault Tolerance', 'INTERMEDIATE', 'ADVANCED', 'Deep dive into circuit breakers (Resilience4j), distributed tracing, and chaos engineering principles.', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '25 minutes'),
(2, 1, 'Stakeholder Feedback Loops', 'INTERMEDIATE', 'ADVANCED', 'Practice structuring post-incident reviews and continuous asynchronous communication channels.', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '25 minutes')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Career Readiness
INSERT INTO CAREER_READINESS (id, session_id, readiness_score, readiness_level, strengths, weaknesses, recommendations, created_at)
VALUES 
(1, 1, 83.85, 'JOB READY', 
'["Strong foundational and modern Java OOP knowledge", "Practical system design intuition with distributed rate limiting", "Calm and methodical crisis response mindset"]',
'["Could explain edge cases and asynchronous fallback strategies in greater depth", "Stakeholder communications can include structured follow-up metrics"]',
'["Build a full distributed microservices portfolio project featuring Kafka and Resilience4j", "Participate in open source code reviews to sharpen complex collaboration skills", "Target Mid-level Software Engineering and Backend Developer positions"]',
CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '25 minutes')
ON CONFLICT (id) DO NOTHING;

-- Update sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM USERS));
SELECT setval('candidate_profiles_id_seq', (SELECT MAX(id) FROM CANDIDATE_PROFILES));
SELECT setval('interview_sessions_id_seq', (SELECT MAX(id) FROM INTERVIEW_SESSIONS));
SELECT setval('interview_questions_id_seq', (SELECT MAX(id) FROM INTERVIEW_QUESTIONS));
SELECT setval('interview_answers_id_seq', (SELECT MAX(id) FROM INTERVIEW_ANSWERS));
SELECT setval('skill_assessments_id_seq', (SELECT MAX(id) FROM SKILL_ASSESSMENTS));
SELECT setval('skill_gaps_id_seq', (SELECT MAX(id) FROM SKILL_GAPS));
SELECT setval('career_readiness_id_seq', (SELECT MAX(id) FROM CAREER_READINESS));
