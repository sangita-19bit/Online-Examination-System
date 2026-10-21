package com.onlineexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Lightweight public health endpoint for uptime monitors and Render health checks.
 * This endpoint intentionally avoids database calls.
 */
@RestController
public class HealthController {

    @GetMapping({"/health", "/healthz"})
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
