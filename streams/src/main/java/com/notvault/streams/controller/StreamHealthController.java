package com.notvault.streams.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StreamHealthController {

    @GetMapping("/health/streams")
    public Map<String, String> health() {
        return Map.of(
            "status", "UP",
            "service", "notevault-streams",
            "mode", "local-dev"
        );
    }
}
