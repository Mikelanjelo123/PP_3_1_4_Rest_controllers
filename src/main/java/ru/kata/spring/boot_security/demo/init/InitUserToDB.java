package ru.kata.spring.boot_security.demo.init;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class InitUserToDB {
    private final UserService userService;
    private final RoleService roleService;

    public InitUserToDB(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init() {
        // Создаём роли
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");

        // Создаём сет ролей
        Set<Role> rolesAdmin = new HashSet<>();
        Set<Role> rolesUser = new HashSet<>();
        rolesAdmin.add(adminRole);
        rolesUser.add(userRole);
        User admin = new User("Admin", "Admin", "admin@exemple.ru", "$2a$12$SOG.qzmEIVP/QZnQmxvdTuR3H5xU16C9/0RYmqpjhQh7KU/OlZsaO", rolesAdmin);
        User user = new User("User", "User", "user@exemple.ru","$2a$12$SOG.qzmEIVP/QZnQmxvdTuR3H5xU16C9/0RYmqpjhQh7KU/OlZsaO", rolesUser);
        roleService.add(adminRole);
        roleService.add(userRole);
        userService.add(admin);
        userService.add(user);

    }
}
