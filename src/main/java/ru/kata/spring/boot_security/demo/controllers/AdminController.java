package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DefaultAuthenticationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.PersonDetails;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.Optional;


@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;
    private final DefaultAuthenticationEventPublisher authenticationEventPublisher;

    @Autowired
    private AdminController(UserService userService, RoleService roleService, DefaultAuthenticationEventPublisher authenticationEventPublisher) {
        this.userService = userService;
        this.roleService = roleService;
        this.authenticationEventPublisher = authenticationEventPublisher;
    }

    @GetMapping
    public String listUsers(ModelMap model) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("roles", roleService.findAll());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PersonDetails personDetails =(PersonDetails) authentication.getPrincipal();
        model.addAttribute("userDetails", personDetails);
        return "user-list";
    }

    @GetMapping("/add")
    public String addUserForm(ModelMap model) {
        model.addAttribute("user", new User());
        model.addAttribute("allRoles", roleService.findAll());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PersonDetails personDetails =(PersonDetails) authentication.getPrincipal();
        model.addAttribute("userDetails", personDetails);
        return "user-add";
    }

    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") @Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            return "user-add";
        }
        // проверка на имейл
        Optional<User> userWithSameEmail = userService.findByEmail(user.getEmail());
        if (userWithSameEmail.isPresent()) {
            return "user-add";
        }
        // Проверка: если роли не выбраны, добавляется роль по умолчанию
        userService.add(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String editUserForm(@RequestParam("id") int id, ModelMap model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        model.addAttribute("allRoles", roleService.findAll());
        return "user-edit";
    }

    @PostMapping("/edit")
    public String editUser(@RequestParam("id") int id, @ModelAttribute("user") @Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            return "user-edit";
        }
        // проверка на имейл
        Optional<User> userWithSameEmail = userService.findByEmail(user.getEmail());
        if (userWithSameEmail.isPresent() && userWithSameEmail.get().getId() != id) {
            // проверяем, что email не совпадает с текущим пользователем
            result.rejectValue("email", "error.user", "Этот email уже используется другим пользователем.");
            return "user-edit";
        }
        userService.update(id, user);
        return "redirect:/admin";
    }

    @GetMapping("/delete")
    public String deleteUser(@RequestParam("id") int id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}