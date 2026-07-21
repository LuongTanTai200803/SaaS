package com.saasai.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableConfigurationProperties(OpenRouterProperties.class)
public class OpenRouterConfig {

    @Bean
    public WebClient openRouterWebClient(OpenRouterProperties properties) {
        validate(properties);

        long timeoutMillis = properties.getTimeoutSeconds() * 1000;

        HttpClient httpClient = HttpClient.create()
                .option(
                        ChannelOption.CONNECT_TIMEOUT_MILLIS,
                        Math.toIntExact(timeoutMillis)
                )
                .responseTimeout(java.time.Duration.ofMillis(timeoutMillis))
                .doOnConnected(connection -> connection
                        .addHandlerLast(
                                new ReadTimeoutHandler(
                                        timeoutMillis,
                                        TimeUnit.MILLISECONDS
                                )
                        )
                        .addHandlerLast(
                                new WriteTimeoutHandler(
                                        timeoutMillis,
                                        TimeUnit.MILLISECONDS
                                )
                        )
                );

        WebClient.Builder builder = WebClient.builder()
                .baseUrl(properties.getBaseUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + properties.getApiKey()
                )
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                );

        if (hasText(properties.getSiteUrl())) {
            builder.defaultHeader("HTTP-Referer", properties.getSiteUrl());
        }

        if (hasText(properties.getAppName())) {
            builder.defaultHeader(
                    "X-OpenRouter-Title",
                    properties.getAppName()
            );
        }

        return builder.build();
    }

    private void validate(OpenRouterProperties properties) {
        if (!hasText(properties.getApiKey())) {
            throw new IllegalStateException(
                    "OPENROUTER_API_KEY chưa được cấu hình"
            );
        }

        if (!hasText(properties.getBaseUrl())) {
            throw new IllegalStateException(
                    "OPENROUTER_BASE_URL chưa được cấu hình"
            );
        }

        if (properties.timeout() == null
                || properties.timeout().isNegative()
                || properties.timeout().isZero()) {
            throw new IllegalStateException(
                    "OPENROUTER_TIMEOUT phải lớn hơn 0"
            );
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}