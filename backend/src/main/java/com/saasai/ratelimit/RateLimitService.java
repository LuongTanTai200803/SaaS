package com.saasai.ratelimit;

import com.saasai.exception.TooManyRequestsException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimitService {

    @Value("${ratelimit.auth.login.limit:10}")
    private int loginLimit;

    @Value("${ratelimit.credits.estimate.limit:30}")
    private int creditsEstimateLimit;

    @Value("${ratelimit.files.upload.limit:10}")
    private int filesUploadLimit;

    @Value("${ratelimit.ai.completions.limit:20}")
    private int aiCompletionsLimit;

    @Value("${ratelimit.window.seconds:60}")
    private int windowSeconds;

    private final Map<String, RateBucket> buckets = new ConcurrentHashMap<>();

    public void validateLogin(String key) {
        validate(key, loginLimit, "Too many login attempts");
    }

    public void validateCreditEstimate(String key) {
        validate(key, creditsEstimateLimit, "Too many credit estimate requests");
    }

    public void validateFileUpload(String key) {
        validate(key, filesUploadLimit, "Too many file upload requests");
    }

    public void validateAiCompletion(String key) {
        validate(key, aiCompletionsLimit, "Too many AI completion requests");
    }

    private void validate(String key, int limit, String message) {
        RateBucket bucket = buckets.computeIfAbsent(key, k -> new RateBucket(limit, windowSeconds));
        if (!bucket.tryConsume()) {
            throw new TooManyRequestsException(message + " - please try again later");
        }
    }

    private static class RateBucket {
        private final int limit;
        private final int windowSeconds;
        private Instant windowStart;
        private final AtomicInteger count;

        public RateBucket(int limit, int windowSeconds) {
            this.limit = limit;
            this.windowSeconds = windowSeconds;
            this.windowStart = Instant.now();
            this.count = new AtomicInteger(0);
        }

        public synchronized boolean tryConsume() {
            Instant now = Instant.now();
            if (Duration.between(windowStart, now).getSeconds() >= windowSeconds) {
                windowStart = now;
                count.set(0);
            }
            if (count.incrementAndGet() > limit) {
                return false;
            }
            return true;
        }
    }
}
