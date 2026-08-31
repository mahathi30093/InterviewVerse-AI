package com.interviewverseai;

import com.interviewverseai.config.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class InterviewVerseAiTests {

    @Test
    void testJwtTokenGenerationAndValidation() {
        JwtTokenProvider provider = new JwtTokenProvider(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                3600000
        );

        String token = provider.generateToken("candidate@interviewverse.ai", "CANDIDATE", 1L);
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("candidate@interviewverse.ai", provider.getEmailFromToken(token));
    }
}
