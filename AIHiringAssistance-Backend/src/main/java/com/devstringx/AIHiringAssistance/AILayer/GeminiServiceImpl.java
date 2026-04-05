package com.devstringx.AIHiringAssistance.AILayer;

import com.devstringx.AIHiringAssistance.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient.Builder webClientBuilder;

    // 🟢 ADDED
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    // Limits the whole app to 2 concurrent requests to Gemini
    private final Semaphore limiter = new Semaphore(2);

    @Override
    public String generateContent(String prompt) {
        try {
            limiter.acquire(); // Wait here if 2 requests are already running

            String url = geminiApiUrl + "?key=" + apiKey;

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    )
            );

            String response = webClientBuilder.build()
                    .post()
                    .uri(url)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(googleApiRetryStrategy()) // Clean and readable
                    .block();

            return response;
        }catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Request interrupted");
        } finally {
            limiter.release(); // Free up the spot for the next resume
        }
    }

    private Retry googleApiRetryStrategy() {
        return Retry.backoff(4, Duration.ofSeconds(3)) // Increased to 4 attempts, starting at 3s
                .jitter(0.75) // Adds randomness so requests don't sync up
                .filter(throwable -> {
                    // Log the hit so you can see it in the console
                    if (throwable instanceof WebClientResponseException.TooManyRequests) {
                        System.out.println("Rate limit hit. Retrying Gemini API...");
                        return true;
                    }
                    return false;
                })
                .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> {
                    return new RuntimeException("Gemini API limit exhausted after max retries.");
                });
    }
}
