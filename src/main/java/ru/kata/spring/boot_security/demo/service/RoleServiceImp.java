package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dao.RoleRepository;
import ru.kata.spring.boot_security.demo.dao.UserRepository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class RoleServiceImp implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImp(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    @Override
    public List <Role> findAll() {
        return roleRepository.findAll();
    }

    @Transactional
    @Override
    public void add(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role findByName(String name) {
        return roleRepository.findAll().stream().filter(r -> r.getName().equals(name)).findFirst().orElse(null);
    }
}