package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.PersonDetails;

import java.util.HashMap;
import java.util.Map;


@RestController
public class UserController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> userPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PersonDetails personDetails = (PersonDetails) authentication.getPrincipal();
        Map<String, Object> response = new HashMap<>();
        response.put("userDetails", personDetails);
        return ResponseEntity.ok(response);
    }
}
