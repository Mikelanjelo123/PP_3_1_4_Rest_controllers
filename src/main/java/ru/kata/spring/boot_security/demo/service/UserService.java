package ru.kata.spring.boot_security.demo.service;
import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;
import java.util.List;

public interface UserService extends UserDetailsService {
    void add(User user);

    void update(User user);

    void delete(int id);

    List<User> findAll();

    User findById(int id);
    Boolean existsByEmail(String email);
}
