package com.devstringx.AIHiringAssistance.AILayer;

import com.devstringx.AIHiringAssistance.service.GeminiService;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

  @Value("${gemini.api.key}")
  private String apiKey;

  private final WebClient.Builder webClientBuilder;

  // 🟢 ADDED
  @Value("${gemini.api.url}")
  private String geminiApiUrl;

  @Value("${gemini.model.primary}")
  private String primaryModel;

  @Value("${gemini.model.fallback}")
  private String fallbackModel;

  // Limits the whole app to 2 concurrent requests to Gemini
  private final Semaphore limiter = new Semaphore(2);

  private String callModel(String modelName, Map<String, Object> requestBody) {

    String url =
        "https://generativelanguage.googleapis.com/v1beta/models/"
            + modelName
            + ":generateContent?key="
            + apiKey;

    String response =
        webClientBuilder
            .build()
            .post()
            .uri(url)
            .bodyValue(requestBody)
            .retrieve()
            .onStatus(
                status -> status.isError(),
                clientResponse ->
                    clientResponse
                        .createException()
                        .flatMap(
                            ex -> {
                              System.out.println("MODEL FAILED = " + modelName);

                              System.out.println(ex.getResponseBodyAsString());

                              return reactor.core.publisher.Mono.error(ex);
                            }))
            .bodyToMono(String.class)
            .retryWhen(googleApiRetryStrategy())
            .block();

    return response;
  }

  //    ==================================================
  @Override
  public String generateContent(String prompt) {
    boolean acquired = false;
    try {
      limiter.acquire(); // Wait here if 2 requests are already running
      acquired = true;

      //            String url = geminiApiUrl + "?key=" + apiKey;

      Map<String, Object> requestBody =
          Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

      //            String response = webClientBuilder.build()
      //                    .post()
      //                    .uri(url)
      //                    .bodyValue(requestBody)
      //                    .retrieve()
      //                    .onStatus(
      //                            status -> status.isError(),
      //                            clientResponse ->
      //                                    clientResponse.createException()
      //                                            .flatMap(ex -> {
      //
      //                                                System.out.println("GOOGLE ERROR BODY:");
      //
      // System.out.println(ex.getResponseBodyAsString());
      //
      //                                                return
      // reactor.core.publisher.Mono.error(ex);
      //                                            })
      //                    )
      //                    .bodyToMono(String.class)
      //                    .retryWhen(googleApiRetryStrategy()) // Clean and readable
      //                    .block();
      //
      //            return response;

      try {

        System.out.println("Trying Primary Model = " + primaryModel);

        return callModel(primaryModel, requestBody);

      } catch (Exception primaryException) {

        System.out.println("Primary Model Failed");

        System.out.println("Trying Fallback Model = " + fallbackModel);

        return callModel(fallbackModel, requestBody);
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RuntimeException("Request interrupted");
    } finally {
      if (acquired) {
        limiter.release();
      }
    }
  }

  private Retry googleApiRetryStrategy() {

    return Retry.backoff(5, Duration.ofSeconds(10))
        .jitter(0.75)
        .filter(
            ex -> {
              if (ex instanceof WebClientResponseException.TooManyRequests) {
                System.out.println("429 Rate Limit. Retrying...");
                return true;
              }

              if (ex instanceof WebClientResponseException.ServiceUnavailable) {
                System.out.println("503 Service Unavailable. Retrying...");
                return true;
              }

              return false;
            })
        .onRetryExhaustedThrow(
            (spec, signal) ->
                new RuntimeException("Gemini exhausted after retries", signal.failure()));
  }
}
