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
        if (roleService.findAll().size() == 0) {
            // Создаём роли
            Role adminRole = new Role("ROLE_ADMIN");

            // Создаём множество ролей
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            User user = new User("Admin", "Admin", "admin@exemple.ru", "$2a$12$SOG.qzmEIVP/QZnQmxvdTuR3H5xU16C9/0RYmqpjhQh7KU/OlZsaO", roles);
            roleService.add(adminRole);
            userService.add(user);

        }
    }
}
