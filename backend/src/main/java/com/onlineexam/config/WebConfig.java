package com.onlineexam.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration.
 *
 * cors.allowed-origins accepts a comma-separated list of origins.
 * The default covers both local development and the production Vercel URL,
 * so neither environment needs a separate env-var override.
 *
 * To restrict to a single origin in production, set the CORS_ALLOWED_ORIGINS
 * environment variable on Render/Railway to just your Vercel URL.
 */
@Configuration
public class WebConfig {

    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String allowedOriginsRaw;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Split the comma-separated string so both localhost and production work
        String[] origins = allowedOriginsRaw.split(",");

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(origins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        // Allow the Authorization header so the frontend JWT is passed through
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);
            }
        };
    }
}
