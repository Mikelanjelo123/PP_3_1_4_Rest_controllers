package ru.kata.spring.boot_security.demo.controllers;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.PersonDetails;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    private AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PersonDetails personDetails = (PersonDetails) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("users", userService.findAll());
        response.put("roles", roleService.findAll());
        response.put("personDetails", personDetails);
        response.put("user", new User());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody @Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        // проверка на имейл
        Optional<User> userWithSameEmail = userService.findByEmail(user.getEmail());
        if (userWithSameEmail.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Этот email уже используется.");
        }
        // Проверка: если роли не выбраны, добавляется роль по умолчанию
        userService.add(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/edit")
    public ResponseEntity<?> editUser(@RequestParam("id") int id, @RequestBody @Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        // проверка на имейл
        Optional<User> userWithSameEmail = userService.findByEmail(user.getEmail());
        if (userWithSameEmail.isPresent() && userWithSameEmail.get().getId() != id) {
            // проверяем, что email не совпадает с текущим пользователем
            result.rejectValue("email", "error.user", "Этот email уже используется другим пользователем.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Этот email уже используется другим пользователем.");
        }
        userService.update(id, user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestParam("id") int id) {
        userService.delete(id);
        return ResponseEntity.ok("Пользователь удалён.");
    }
}