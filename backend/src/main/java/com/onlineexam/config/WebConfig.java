package com.onlineexam.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration.
 *
 * Allowed origin is read from the CORS_ALLOWED_ORIGIN environment variable
 * (set CORS_ALLOWED_ORIGIN=https://your-app.vercel.app on Render/Railway).
 * Falls back to http://localhost:3000 for local development.
 */
@Configuration
public class WebConfig {

    @Value("${cors.allowed-origin:http://localhost:3000}")
    private String allowedOrigin;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigin)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        // Allow the Authorization header so the frontend JWT is passed through
                        .exposedHeaders("Authorization")
                        .allowCredentials(true);
            }
        };
    }
}
